import { SET_LOCAL_AUTH_JWT } from "./localAuthTypes.js";

export const initialState = {
    jwt: null,
};

const localAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOCAL_AUTH_JWT:
            return {
                ...state,
                jwt: action.payload,
            };
        default:
            return state;
    }
};

export default localAuthReducer;
