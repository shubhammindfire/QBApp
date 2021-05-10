<?php

require_once('./../vendor/autoload.php');
require_once('./../connect.php');
require_once('updateUserAccessToken.php');
require_once('fetchCartItems.php');

use QuickBooksOnline\API\Core\OAuth\OAuth2\OAuth2AccessToken;
use QuickBooksOnline\API\Data\IPPInvoice;
use QuickBooksOnline\API\DataService\DataService;

fetchInvoices();
function fetchInvoices()
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

    if (emptyInvoiceAndCartItemTable($conn, $config['cartItem_tablename']) === true && emptyInvoiceAndCartItemTable($conn, $config['invoice_tablename']) === true) {
        foreach ($users as $user) {
            $accessToken = new OAuth2AccessToken($config['client_id'], $config['client_secret'], $user['accessToken'], $user['refreshToken'], $user['accessTokenExpiresAt'], $user['refreshTokenExpiresAt']);
            $accessToken->setRealmID($user['realmId']);

            /*
            * Update the OAuth2Token of the dataService object
            */
            $dataService->updateOAuth2Token($accessToken);
            $invoices = $dataService->Query("Select * from Invoice");

            // var_dump($invoices);
            foreach ($invoices as $invoice) {
                updateInvoiceTable($conn, $invoice, $user);
                $lastInvoiceId = getLastAddedInvoiceId($conn, $invoice->Id, $user['realmId']);
                fetchCartItems($conn, $invoice->Line, $invoice->MetaData->CreateTime, $invoice->MetaData->LastUpdatedTime, $lastInvoiceId, $user['realmId']);
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
        echo json_encode(["status" => "1", "message" => "Invoices fetched successfully"]);
    }
}

/**
 * @param mysqli $conn
 * @return bool
 */
function emptyInvoiceAndCartItemTable($conn, $tablename)
{
    if ($conn->query("DELETE FROM $tablename WHERE 1") === false) {
        echo ("Error in emptying table $tablename: " . $conn->error);
        return false;
    }
    return true;
}

/**
 * @param mysqli $conn
 * @param String $invoiceId
 * @param String $userId
 * @return String
 */
function getLastAddedInvoiceId($conn, $invoiceId, $userId)
{
    $sql = "SELECT id from invoice WHERE invoiceId=$invoiceId AND userId=$userId";

    return $conn->query($sql)->fetch_assoc()['id'];
}

/**
 * @param mysqli $conn
 * @param IPPInvoice $invoice
 * @param Array $user
 * @return bool
 */
function updateInvoiceTable($conn, $invoice, $user): bool
{
    $invoiceId = $invoice->Id;
    $invoiceNumber = $invoice->DocNumber;
    $customerId = getCustomerId($conn, $invoice->CustomerRef, $user['realmId']);
    $amount = $invoice->TotalAmt;
    $balance = $invoice->Balance;
    $paymentStatus = ($balance == 0) ? "PAID" : "PENDING";
    $invoiceDate = $invoice->TxnDate;
    $dueDate = $invoice->DueDate;
    $createdAt = strtotime($invoice->MetaData->CreateTime);
    $updatedAt = strtotime($invoice->MetaData->LastUpdatedTime);
    $userId = $user['realmId'];

    $sql = "INSERT INTO invoice(invoiceId, invoiceNumber, customerId, paymentStatus, invoiceDate, dueDate, amount, balance, createdAt, updatedAt, userId) VALUES($invoiceId, $invoiceNumber, $customerId, '$paymentStatus', '$invoiceDate', '$dueDate', $amount, $balance, $createdAt, $updatedAt, $userId)";
    if ($conn->query($sql) === false) {
        echo ("Error in adding new invoice in table invoice: " . $conn->error);
        return false;
    }

    return true;
}

/**
 * @param mysqli $conn
 * @param String $customerId
 * @param String $userId
 * @return String
 * this function takes in the customerId from the QB API response
 * and checks it across with the customer table in the local database.
 * The local database has a separate PRIMARY KEY column id
 * It has another column customerId which corresponds to the id of the customer received from QB
 */
function getCustomerId($conn, $customerId, $userId): String
{
    $sql = "SELECT id from customer WHERE customerId=$customerId AND userId=$userId";

    return $conn->query($sql)->fetch_assoc()['id'];
}
