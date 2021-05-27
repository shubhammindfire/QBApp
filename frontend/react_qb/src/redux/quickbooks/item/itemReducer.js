import { ADD_ALL_ITEMS } from "./itemTypes.js";

const initialState = {
    items: [],
};

const itemReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALL_ITEMS:
            return {
                ...state,
                items: action.payload,
            };
        default:
            return state;
    }
};

export default itemReducer;
