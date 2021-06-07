<?php

require_once('./../vendor/autoload.php');
require_once('./../connect.php');

use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2AccessToken;
use QuickBooksOnline\API\DataService\DataService;

updateUserAccessToken();
function updateUserAccessToken()
{
    // Create SDK instance
    $config = include('./../config.php');
    $dataService = DataService::Configure(array(
        'auth_mode' => 'oauth2',
        'ClientID' => $config['client_id'],
        'ClientSecret' =>  $config['client_secret'],
        'RedirectURI' => $config['oauth_redirect_uri'],
        'scope' => $config['oauth_scope'],
        'baseUrl' => "development"
    ));

    // connect to mysql database
    $conn = (new Connect())->connectDB();
    $conn->select_db($config['dbname']);

    $result = $conn->query("SELECT * FROM " . $config['user_tablename']);
    $users = [];
    foreach ($result as $key => $value) {
        $users[$key] = $value;
    }

    foreach ($users as $user) {
        $accessToken = new OAuth2AccessToken($config['client_id'], $config['client_secret'], $user['accessToken'], $user['refreshToken'], $user['accessTokenExpiresAt'], $user['refreshTokenExpiresAt']);
        $accessToken->setRealmID($user['realmId']);

        if (checkAccessTokenExpiry($accessToken->getAccessTokenExpiresAt()) === true) {
            $newAccessToken = myRefreshToken($accessToken, $user['realmId']);
            updateDBAccessToken($conn, $newAccessToken, $user['realmId']);
        }
    }

    $error = $dataService->getLastError();
    if ($error) {
        echo "The Status code is: " . $error->getHttpStatusCode() . "\n";
        echo "The Helper message is: " . $error->getOAuthHelperError() . "\n";
        echo "The Response message is: " . $error->getResponseBody() . "\n";
        exit();
    }
}


/**
 * @param mysqli $conn
 * @param String $newAccessToken 
 * @param String $realmId
 * @return bool
 */
function updateDBAccessToken(mysqli $conn, OAuth2AccessToken $newAccessToken, String $realmId)
{
    // update the user AccessToken
    $stmt = $conn->prepare("UPDATE user SET accessToken=? WHERE realmId=?");
    $stmt->bind_param("ss", $newAccessToken->getAccessToken(), $realmId);

    if ($stmt->execute() === false) {
        echo ("Error in updating accessToken in table user: " . $conn->error);
        echo ("Statement Error: " . $stmt->error);
        $stmt->close();
        return false;
    }
    $stmt->close();

    // update the user RefreshToken
    $stmt = $conn->prepare("UPDATE user SET refreshToken=? WHERE realmId=?");
    $stmt->bind_param("ss", $newAccessToken->getRefreshToken(), $realmId);

    if ($stmt->execute() === false) {
        echo ("Error in updating refreshToken in table user: " . $conn->error);
        echo ("Statement Error: " . $stmt->error);
        $stmt->close();
        return false;
    }
    $stmt->close();

    // update the user updatedAt
    $stmt = $conn->prepare("UPDATE user SET updatedAt=? WHERE realmId=?");
    $stmt->bind_param("is", time(), $realmId);
    if ($stmt->execute() === false) {
        echo ("Error in updating user updatedAt in table user: " . $conn->error);
        echo ("Statement Error: " . $stmt->error);
        $stmt->close();
        return false;
    }
    $stmt->close();

    // update the user accessTokenExpiresAt
    $stmt = $conn->prepare("UPDATE user SET accessTokenExpiresAt=? WHERE realmId=?");
    $stmt->bind_param("is", strtotime($newAccessToken->getAccessTokenExpiresAt()), $realmId);
    if ($stmt->execute() === false) {
        echo ("Error in updating user accessTokenExpiresAt in table user: " . $conn->error);
        echo ("Statement Error: " . $stmt->error);
        $stmt->close();
        return false;
    }
    $stmt->close();

    return true;
}

/**
 * @param String $accessTokenExpiryAt
 * @return bool
 */
function checkAccessTokenExpiry($accessTokenExpiryAt): bool
{
    if (strtotime($accessTokenExpiryAt) < time()) {
        return true;
    }

    return false;
}

/**
 * @param OAuth2AccessToken $accessToken
 * @param String $realmId
 * @return OAuth2AccessToken $refreshedAccessTokenObj
 */
function myRefreshToken($accessToken, $realmId): OAuth2AccessToken
{
    $config = include('./../config.php');

    $dataService = DataService::Configure(array(
        'auth_mode' => 'oauth2',
        'ClientID' => $config['client_id'],
        'ClientSecret' =>  $config['client_secret'],
        'RedirectURI' => $config['oauth_redirect_uri'],
        'baseUrl' => "development",
        'refreshTokenKey' => $accessToken->getRefreshToken(),
        'QBORealmID' => $realmId,
    ));


    /*
     * Update the OAuth2Token of the dataService object
     */
    $OAuth2LoginHelper = $dataService->getOAuth2LoginHelper();
    $refreshedAccessTokenObj = $OAuth2LoginHelper->refreshToken();
    $dataService->updateOAuth2Token($refreshedAccessTokenObj);

    return $refreshedAccessTokenObj;
}
