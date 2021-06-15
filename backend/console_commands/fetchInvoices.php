<?php

require_once('./../vendor/autoload.php');
require_once('./../connect.php');
require_once('updateUserAccessToken.php');
require_once('fetchInvoicesItems.php');

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
            if (invoiceExists($conn, $invoice->Id, $user['id']) === false) {
                addInvoice($conn, $invoice, $user);
                $lastInvoiceId = getLastAddedInvoiceId($conn, $invoice->Id, $user['id']);
                fetchInvoicesItems($conn, $invoice->Line, $invoice->MetaData->CreateTime, $invoice->MetaData->LastUpdatedTime, $lastInvoiceId, $user['id']);
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
 * @param String $qboId
 * @param String $userId
 * @return bool
 */
function invoiceExists($conn, $qboId, $userId): bool
{
    $sql = "SELECT id from invoices WHERE qbo_id=$qboId AND FK_users=$userId";

    $res = $conn->query($sql)->fetch_assoc();
    if ($res !== null) {
        return true;
    }
    return false;
}

/**
 * @param mysqli $conn
 * @param String $qbo_id
 * @param String $userId
 * @return String
 */
function getLastAddedInvoiceId($conn, $qboId, $userId)
{
    $sql = "SELECT id from invoices WHERE qbo_id=$qboId AND FK_users=$userId";

    return $conn->query($sql)->fetch_assoc()['id'];
}

/**
 * @param mysqli $conn
 * @param IPPInvoice $invoice
 * @param Array $user
 * @return bool
 */
function addInvoice($conn, $invoice, $user): bool
{
    $qboId = $invoice->Id;
    $invoiceNumber = $invoice->DocNumber;
    $FK_customers = getCustomerId($conn, $invoice->CustomerRef, $user['id']);
    $amount = $invoice->TotalAmt;
    $balance = $invoice->Balance;
    $paymentStatus = ($balance == 0) ? "PAID" : "PENDING";
    $invoiceDate = $invoice->TxnDate;
    $dueDate = $invoice->DueDate;
    $createdAt = strtotime($invoice->MetaData->CreateTime);
    $updatedAt = strtotime($invoice->MetaData->LastUpdatedTime);
    $FK_users = $user['id'];

    $sql = "INSERT INTO invoices(qbo_id, invoiceNumber, FK_customers, paymentStatus, invoiceDate, dueDate, amount, balance, createdAt, updatedAt, FK_users) VALUES($qboId, $invoiceNumber, $FK_customers, '$paymentStatus', '$invoiceDate', '$dueDate', $amount, $balance, $createdAt, $updatedAt, $FK_users)";
    if ($conn->query($sql) === false) {
        echo "Error in adding new invoice in table invoices: " . $conn->error;
        return false;
    }

    return true;
}

/**
 * @param mysqli $conn
 * @param String $customerQBOId
 * @param String $userId
 * @return String
 * this function takes in the customerId from the QB API response
 * and checks it across with the customer table in the local database.
 * The local database has a separate PRIMARY KEY column id
 * It has another column customerId which corresponds to the id of the customer received from QB
 */
function getCustomerId($conn, $customerQBOId, $userId): String
{
    $sql = "SELECT id from customers WHERE qbo_id=$customerQBOId AND FK_users=$userId";

    return $conn->query($sql)->fetch_assoc()['id'];
}
