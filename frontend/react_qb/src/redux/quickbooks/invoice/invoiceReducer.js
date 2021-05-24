import { ADD_ALL_INVOICES } from "./invoiceTypes.js";

const initialState = {
    invoices: [],
};

const invoiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALL_INVOICES:
            return {
                ...state,
                invoices: action.payload,
            };
        default:
            return state;
    }
};

export default invoiceReducer;
