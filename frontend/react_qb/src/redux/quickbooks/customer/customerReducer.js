import { ADD_ALL_CUSTOMERS, REMOVE_ALL_CUSTOMERS } from "./customerTypes.js";

const initialState = {
    customers: [],
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALL_CUSTOMERS:
            return {
                ...state,
                customers: action.payload,
            };
        case REMOVE_ALL_CUSTOMERS:
            return {
                ...state,
                customers: [],
            };
        default:
            return state;
    }
};

export default customerReducer;
