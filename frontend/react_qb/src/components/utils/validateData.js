// this function checks if the customer name given is correct and exists in the customers list or not
export function validateCustomerName(customerName, customerNameListAsString) {
    return customerNameListAsString.includes(customerName);
}

// this function checks if the invoiceDate is given in the future or not
export function validateInvoiceDate(invoiceDate) {
    if (Date.parse(invoiceDate) > new Date().getTime()) return true;
    return false;
}

// this function checks if the dueDate is given after invoiceDate or not
export function validateDueDate(invoiceDate, dueDate) {
    if (Date.parse(dueDate) > Date.parse(invoiceDate)) return true;
    return false;
}

// this function checks if any cartItem is name is empty
export function validateEmptyCartItem(cartItems) {
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems.itemName === null || cartItems.itemName === "")
            return false;
    }
    return true;
}

// this function checks if any cartItem is name is invalid
export function validateInvalidCartItem(cartItems, items) {
    let itemNameListAsString = [];

    if (items !== undefined) {
        for (let i = 0; i < items.length; i++) {
            itemNameListAsString.push(items[i].name);
        }
    }
    for (let i = 0; i < cartItems.length; i++) {
        if (!itemNameListAsString.includes(cartItems[i].itemName)) {
            return false;
        }
    }
    return true;
}

// this function checks if any cartItem quantity is zero
export function validateCartItemQuantity(cartItems) {
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].quantity === null || cartItems[i].quantity === 0)
            return false;
    }
    return true;
}
