import { ADD_ALL_ITEMS, REMOVE_ALL_ITEMS } from "./itemTypes.js";

export const initialState = {
    items: [],
};

const itemReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALL_ITEMS:
            return {
                ...state,
                items: action.payload,
            };
        case REMOVE_ALL_ITEMS:
            return {
                ...state,
                items: [],
            };
        default:
            return state;
    }
};

export default itemReducer;
