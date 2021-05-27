import { ADD_ALL_CUSTOMERS } from "./customerTypes.js";

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
        default:
            return state;
    }
};

export default customerReducer;
