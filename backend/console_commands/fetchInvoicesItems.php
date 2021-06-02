<?php

require_once('./../vendor/autoload.php');
require_once('./../connect.php');
require_once('updateUserAccessToken.php');

use QuickBooksOnline\API\Data\IPPLine;

/**
 * @param mysqli $conn
 * @param IPPLine $line
 * @param String $createdAt
 * @param String $updatedAt
 * @param String $invoiceId
 * this is the invoice id of the last invoice that was successfully added
 * and thus it will the invoiceId for this invoiceItem
 */
function fetchInvoicesItems($conn, $line, $createdAt, $updatedAt, $invoiceId, $userId)
{
    foreach ($line as $item) {
        if ($item->Id !== null)
            updateinvoicesItemsTable($conn, $item, $createdAt, $updatedAt, $invoiceId, $userId);
    }
}


/**
 * @param mysqli $conn
 * @param IPPLine $item
 * @param String $invoiceDate
 * @param String $dueDate
 * @return bool
 */
function updateinvoicesItemsTable($conn, $item, $createdAt, $updatedAt, $FK_invoices, $FK_users): bool
{
    $FK_items = getItemId($conn, $item->SalesItemLineDetail->ItemRef, $FK_users);
    $quantity = $item->SalesItemLineDetail->Qty ?? 0;
    $rate = $item->UnitPrice ?? 0;
    $createdAt = strtotime($createdAt);
    $updatedAt = strtotime($updatedAt);

    $sql = "INSERT INTO invoices_items(FK_items, quantity, rate, FK_invoices, createdAt, updatedAt, FK_users) VALUES($FK_items, $quantity, $rate, $FK_invoices, $createdAt, $updatedAt, $FK_users)";
    if ($conn->query($sql) === false) {
        echo ("Error in adding new invoice item in table invoicesItems: " . $conn->error);
        return false;
    }

    return true;
}

/**
 * @param mysqli $conn
 * @param String $itemQBOId
 * @param String $userId
 * @return String
 */
function getItemId($conn, $itemQBOId, $userId): String
{
    $sql = "SELECT id from items WHERE qbo_id=$itemQBOId AND FK_users=$userId";

    return $conn->query($sql)->fetch_assoc()['id'];
}
