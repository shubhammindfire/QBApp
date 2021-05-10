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
 * and thus it will the invoiceId for this cartItem
 */
function fetchCartItems($conn, $line, $createdAt, $updatedAt, $invoiceId, $userId)
{
    foreach ($line as $item) {
        if ($item->Id !== null)
            updateCartItemTable($conn, $item, $createdAt, $updatedAt, $invoiceId, $userId);
    }
}


/**
 * @param mysqli $conn
 * @param IPPLine $item
 * @param String $invoiceDate
 * @param String $dueDate
 * @return bool
 */
function updateCartItemTable($conn, $item, $createdAt, $updatedAt, $invoiceId, $userId): bool
{
    $itemId = getItemId($conn, $item->SalesItemLineDetail->ItemRef, $userId);
    $quantity = $item->SalesItemLineDetail->Qty ?? 0;
    $createdAt = strtotime($createdAt);
    $updatedAt = strtotime($updatedAt);

    $sql = "INSERT INTO cartItem(itemId, quantity, invoiceId, createdAt, updatedAt) VALUES($itemId, $quantity, $invoiceId, $createdAt, $updatedAt)";
    if ($conn->query($sql) === false) {
        echo ("Error in adding new cart item in table cartItem: " . $conn->error);
        return false;
    }

    return true;
}

/**
 * @param mysqli $conn
 * @param String $itemId
 * @param String $userId
 * @return String
 */
function getItemId($conn, $itemId, $userId): String
{
    $sql = "SELECT id from item WHERE itemId=$itemId AND userId=$userId";

    return $conn->query($sql)->fetch_assoc()['id'];
}
