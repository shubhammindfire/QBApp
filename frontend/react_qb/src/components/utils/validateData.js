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

// this function checks if any invoiceItem is name is empty
export function validateEmptyInvoiceItem(invoiceItems) {
    for (let i = 0; i < invoiceItems.length; i++) {
        if (invoiceItems.itemName === null || invoiceItems.itemName === "")
            return false;
    }
    return true;
}

// this function checks if any invoiceItem is name is invalid
export function validateInvalidInvoiceItem(invoiceItems, items) {
    let itemNameListAsString = [];

    if (items !== undefined) {
        for (let i = 0; i < items.length; i++) {
            itemNameListAsString.push(items[i].name);
        }
    }
    for (let i = 0; i < invoiceItems.length; i++) {
        if (!itemNameListAsString.includes(invoiceItems[i].itemName)) {
            return false;
        }
    }
    return true;
}

// this function checks if any invoiceItem quantity is zero
export function validateInvoiceItemQuantity(invoiceItems) {
    for (let i = 0; i < invoiceItems.length; i++) {
        if (invoiceItems[i].quantity === null || invoiceItems[i].quantity === 0)
            return false;
    }
    return true;
}
