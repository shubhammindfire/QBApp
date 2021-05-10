<?php

require_once('./../vendor/autoload.php');
require_once('./../connect.php');
require_once('updateUserAccessToken.php');

use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2AccessToken;
use QuickBooksOnline\API\Data\IPPItem;
use QuickBooksOnline\API\DataService\DataService;

fetchItems();
function fetchItems()
{
    // update user access token if it has expired
    updateUserAccessToken();
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

    if (emptyItemTable($conn) === true) {
        foreach ($users as $user) {
            $accessToken = new OAuth2AccessToken($config['client_id'], $config['client_secret'], $user['accessToken'], $user['refreshToken'], $user['accessTokenExpiresAt'], $user['refreshTokenExpiresAt']);
            $accessToken->setRealmID($user['realmId']);

            /*
            * Update the OAuth2Token of the dataService object
            */
            $dataService->updateOAuth2Token($accessToken);
            $items = $dataService->Query("Select * from Item");

            // var_dump($items);
            foreach ($items as $item) {
                updateItemTable($conn, $item, $user);
            }
        }
    }

    $error = $dataService->getLastError();
    if ($error) {
        echo "The Status code is: " . $error->getHttpStatusCode() . "\n";
        echo "The Helper message is: " . $error->getOAuthHelperError() . "\n";
        echo "The Response message is: " . $error->getResponseBody() . "\n";
        exit();
    } else {
        echo json_encode(["status" => "1", "message" => "Items fetched successfully"]);
    }
}

/**
 * @param mysqli $conn
 * @return bool
 */
function emptyItemTable($conn)
{
    if ($conn->query("DELETE FROM item WHERE 1") === false) {
        echo ("Error in emptying table item: " . $conn->error);
        return false;
    }
    return true;
}

/**
 * @param mysqli $conn
 * @param IPPItem $item
 * @param Array $user
 * @return bool
 */
function updateItemTable($conn, $item, $user): bool
{
    $id = $item->Id;
    $type = ($item->Type === "Inventory") ? "INVENTORY" : "SERVICE";
    $name = ($item->Name) ?? "null";
    $description = ($item->Description) ?? "null";
    $salesPrice = ($item->UnitPrice) ?? 0.0;
    $costPrice = ($item->PurchaseCost) ?? 0.0;
    $quantity = ($item->TrackQtyOnHand === true) ? $item->QtyOnHand : 0;
    $createdAt = strtotime($item->MetaData->CreateTime);
    $updatedAt = strtotime($item->MetaData->LastUpdatedTime);
    $userId = $user['realmId'];

    $stmt = $conn->prepare("INSERT INTO item(itemId, type, name, description, salesPrice, costPrice, quantity, createdAt, updatedAt, userId) VALUES(?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("isssddiiis", $id, $type, $name, $description, $salesPrice, $costPrice, $quantity, $createdAt, $updatedAt, $userId);

    if ($stmt->execute() === false) {
        echo ("Error in adding new item in table item: " . $conn->error);
        echo ("Statement Error: " . $stmt->error);
        $stmt->close();
        return false;
    }
    $stmt->close();

    return true;
}
