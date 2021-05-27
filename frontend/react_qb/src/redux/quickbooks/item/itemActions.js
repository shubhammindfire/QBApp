import { ADD_ALL_ITEMS } from "./itemTypes.js";

export const addAllItems = (items = []) => {
    return {
        type: ADD_ALL_ITEMS,
        payload: items,
    };
};