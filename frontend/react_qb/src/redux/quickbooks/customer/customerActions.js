import { ADD_ALL_CUSTOMERS, REMOVE_ALL_CUSTOMERS } from "./customerTypes.js";

export const addAllCustomers = (customers = []) => {
    return {
        type: ADD_ALL_CUSTOMERS,
        payload: customers,
    };
};

export const removeAllCustomers = () => {
    return {
        type: REMOVE_ALL_CUSTOMERS,
    };
};
