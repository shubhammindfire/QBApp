import {
    ADD_ALL_INVOICES,
    REMOVE_ALL_INVOICES,
    ADD_CURRENT_INVOICE_ITEMS,
    ADD_CURRENT_INVOICE,
    REMOVE_CURRENT_INVOICE,
    REMOVE_CURRENT_INVOICE_ITEMS,
    DELETE_CURRENT_INVOICE_ITEM_BY_INDEX,
    REMOVE_INVOICE_BY_INDEX,
} from "./invoiceTypes.js";

const initialState = {
    invoices: [],
    currentInvoice: {},
    currentInvoiceItems: [],
};

const invoiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALL_INVOICES:
            return {
                ...state,
                invoices: action.payload,
            };
        case REMOVE_ALL_INVOICES:
            return {
                ...state,
                invoices: [],
            };
        case REMOVE_INVOICE_BY_INDEX:
            return {
                ...state,
                invoices: [
                    // here action.payload is the index of the invoice to be deleted
                    ...state.invoices.slice(0, action.payload),
                    ...state.invoices.slice(action.payload + 1),
                ],
            };
        case ADD_CURRENT_INVOICE:
            return {
                ...state,
                currentInvoice: action.payload,
            };
        case ADD_CURRENT_INVOICE_ITEMS:
            return {
                ...state,
                currentInvoiceItems: action.payload,
            };
        case DELETE_CURRENT_INVOICE_ITEM_BY_INDEX:
            return {
                ...state,
                currentInvoiceItems: [
                    // here action.payload is the index of the item to be deleted
                    ...state.currentInvoiceItems.slice(0, action.payload),
                    ...state.currentInvoiceItems.slice(action.payload + 1),
                ],
            };
        case REMOVE_CURRENT_INVOICE:
            return {
                ...state,
                currentInvoice: {},
            };
        case REMOVE_CURRENT_INVOICE_ITEMS:
            return {
                ...state,
                currentInvoiceItems: [],
            };
        default:
            return state;
    }
};

export default invoiceReducer;
