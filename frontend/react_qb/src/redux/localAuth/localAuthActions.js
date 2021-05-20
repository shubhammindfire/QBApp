import { SET_LOCAL_AUTH_JWT } from "./localAuthTypes.js";

export const setLocalAuthJwt = (jwt = "") => {
    return {
        type: SET_LOCAL_AUTH_JWT,
        payload: jwt,
    };
};
