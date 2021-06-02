<?php

require_once('./../vendor/autoload.php');
require_once('./../connect.php');
require_once('updateUserAccessToken.php');

use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2AccessToken;
use QuickBooksOnline\API\Data\IPPCustomer;
use QuickBooksOnline\API\DataService\DataService;

fetchCustomers();
function fetchCustomers()
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

    foreach ($users as $user) {
        $accessToken = new OAuth2AccessToken($config['client_id'], $config['client_secret'], $user['accessToken'], $user['refreshToken'], $user['accessTokenExpiresAt'], $user['refreshTokenExpiresAt']);
        $accessToken->setRealmID($user['realmId']);

        /*
            * Update the OAuth2Token of the dataService object
            */
        $dataService->updateOAuth2Token($accessToken);
        $customers = $dataService->Query("Select * from Customer");

        // var_dump($customers);
        foreach ($customers as $customer) {
            if (customerExists($conn, $customer->Id, $user['id']) === false) {
                addCustomer($conn, $customer, $user);
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
        echo json_encode(["status" => "1", "message" => "Customers fetched successfully"]);
    }
}

/**
 * @param mysqli $conn
 * @param String $qboId
 * @param String $userId
 * @return bool
 */
function customerExists($conn, $qboId, $userId): bool
{
    $sql = "SELECT id from customers WHERE qbo_id=$qboId AND FK_users=$userId";

    $res = $conn->query($sql)->fetch_assoc();
    if ($res !== null) {
        return true;
    }
    return false;
}

/**
 * @param mysqli $conn
 * @param IPPCustomer $customer
 * @param Array $user
 * @return bool
 */
function addCustomer($conn, $customer, $user): bool
{
    $qboId = $customer->Id;
    $firstname = ($customer->GivenName) ?? "null";
    $lastname = ($customer->FamilyName) ?? "null";
    $companyName = ($customer->CompanyName) ?? "null";
    $displayName = ($customer->DisplayName) ?? "null";
    $email = ($customer->PrimaryEmailAddr->Address) ?? "null";
    $billAddr = $customer->BillAddr;
    $billingAddress = $billAddr->Line1 . ", " . $billAddr->City . ", " . $billAddr->CountrySubDivisionCode . ", " . $billAddr->PostalCode;
    // if $billingAddress is empty then replace ,,, with null
    $billingAddress = ($billingAddress === ", , , ") ? "null" : $billingAddress;
    $shipAddr = $customer->ShipAddr;
    $shippingAddress = $shipAddr->Line1 . ", " . $shipAddr->City . ", " . $shipAddr->CountrySubDivisionCode . ", " . $shipAddr->PostalCode;
    // if $shippingAddress is empty then replace ,,, with null
    $shippingAddress = ($shippingAddress === ", , , ") ? "null" : $shippingAddress;
    $phoneNumber = ($customer->PrimaryPhone->FreeFormNumber) ?? "null";
    $openBalance = ($customer->Balance) ?? 0.0;
    $createdAt = strtotime($customer->MetaData->CreateTime);
    $updatedAt = strtotime($customer->MetaData->LastUpdatedTime);
    $FK_users = $user['id'];

    $stmt = $conn->prepare("INSERT INTO customers(qbo_id,firstName,lastName, companyName, displayName, email, billingAddress, shippingAddress, phoneNumber, openBalance, createdAt, updatedAt, FK_users) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("issssssssdiii", $qboId, $firstname, $lastname, $companyName, $displayName, $email, $billingAddress, $shippingAddress, $phoneNumber, $openBalance, $createdAt, $updatedAt, $FK_users);

    if ($stmt->execute() === false) {
        echo ("Error in adding new customer in table customers: " . $conn->error);
        echo ("Statement Error: " . $stmt->error);
        $stmt->close();
        return false;
    }
    $stmt->close();

    return true;
}
