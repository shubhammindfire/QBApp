import { ADD_ALL_INVOICES, ADD_ONE_INVOICE } from "./invoiceTypes.js";

export const addAllInvoices = (invoices = []) => {
    return {
        type: ADD_ALL_INVOICES,
        payload: invoices,
    };
};
