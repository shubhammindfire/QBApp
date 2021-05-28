import {
    ADD_ALL_INVOICES,
    ADD_CURRENT_INVOICE,
    ADD_CURRENT_CART_ITEMS,
    DELETE_CURRENT_CART_ITEM_BY_INDEX,
    REMOVE_CURRENT_INVOICE,
    REMOVE_CURRENT_CART_ITEMS,
} from "./invoiceTypes.js";

export const addAllInvoices = (invoices = []) => {
    return {
        type: ADD_ALL_INVOICES,
        payload: invoices,
    };
};

export const addCurrentInvoice = (invoice = {}) => {
    return {
        type: ADD_CURRENT_INVOICE,
        payload: invoice,
    };
};

export const addCurrentCartItems = (cartItems = []) => {
    return {
        type: ADD_CURRENT_CART_ITEMS,
        payload: cartItems,
    };
};

export const deleteCurrentCartItemByIndex = (index) => {
    return {
        type: DELETE_CURRENT_CART_ITEM_BY_INDEX,
        payload: index,
    };
};

export const removeCurrentInvoice = () => {
    return {
        type: REMOVE_CURRENT_INVOICE,
    };
};

export const removeCurrentCartItems = () => {
    return {
        type: REMOVE_CURRENT_CART_ITEMS,
    };
};
