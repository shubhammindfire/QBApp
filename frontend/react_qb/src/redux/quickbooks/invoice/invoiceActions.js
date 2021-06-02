import {
    ADD_ALL_INVOICES,
    REMOVE_ALL_INVOICES,
    REMOVE_INVOICE_BY_INDEX,
    ADD_CURRENT_INVOICE,
    ADD_CURRENT_INVOICE_ITEMS,
    DELETE_CURRENT_INVOICE_ITEM_BY_INDEX,
    REMOVE_CURRENT_INVOICE,
    REMOVE_CURRENT_INVOICE_ITEMS,
} from "./invoiceTypes.js";

export const addAllInvoices = (invoices = []) => {
    return {
        type: ADD_ALL_INVOICES,
        payload: invoices,
    };
};

export const removeAllInvoices = () => {
    return {
        type: REMOVE_ALL_INVOICES,
    };
};

export const removeInvoiceByIndex = (index) => {
    return {
        type: REMOVE_INVOICE_BY_INDEX,
        payload: index,
    };
};

export const addCurrentInvoice = (invoice = {}) => {
    return {
        type: ADD_CURRENT_INVOICE,
        payload: invoice,
    };
};

export const addCurrentInvoiceItems = (invoiceItems = []) => {
    return {
        type: ADD_CURRENT_INVOICE_ITEMS,
        payload: invoiceItems,
    };
};

export const deleteCurrentInvoiceItemByIndex = (index) => {
    return {
        type: DELETE_CURRENT_INVOICE_ITEM_BY_INDEX,
        payload: index,
    };
};

export const removeCurrentInvoice = () => {
    return {
        type: REMOVE_CURRENT_INVOICE,
    };
};

export const removeCurrentInvoiceItems = () => {
    return {
        type: REMOVE_CURRENT_INVOICE_ITEMS,
    };
};
