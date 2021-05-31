import {
    ADD_ALL_INVOICES,
    REMOVE_ALL_INVOICES,
    ADD_CURRENT_CART_ITEMS,
    ADD_CURRENT_INVOICE,
    REMOVE_CURRENT_INVOICE,
    REMOVE_CURRENT_CART_ITEMS,
    DELETE_CURRENT_CART_ITEM_BY_INDEX,
} from "./invoiceTypes.js";

const initialState = {
    invoices: [],
    currentInvoice: {},
    currentCartItems: [],
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
        case ADD_CURRENT_INVOICE:
            return {
                ...state,
                currentInvoice: action.payload,
            };
        case ADD_CURRENT_CART_ITEMS:
            return {
                ...state,
                currentCartItems: action.payload,
            };
        case DELETE_CURRENT_CART_ITEM_BY_INDEX:
            return {
                ...state,
                currentCartItems: [
                    // here action.payload is the index of the item to be deleted
                    ...state.currentCartItems.slice(0, action.payload),
                    ...state.currentCartItems.slice(action.payload + 1),
                ],
            };
        case REMOVE_CURRENT_INVOICE:
            return {
                ...state,
                currentInvoice: {},
            };
        case REMOVE_CURRENT_CART_ITEMS:
            return {
                ...state,
                currentCartItems: [],
            };
        default:
            return state;
    }
};

export default invoiceReducer;
