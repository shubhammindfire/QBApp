import { SET_LOCAL_AUTH_JWT } from "./../../redux/localAuth/localAuthTypes";
import localAuthReducer from "./../../redux/localAuth/localAuthReducer";
import { initialState } from "./../../redux/localAuth/localAuthReducer";

describe("Local Auth Reducer tests", () => {
    it("Should return default state if no type is received", () => {
        const newState = localAuthReducer(undefined, {});
        expect(newState).toEqual(initialState);
    });

    it("Should return mock jwt on SET_LOCAL_AUTH_JWT type", () => {
        const mockJwt = "mock jwt";
        const expectedState = { jwt: mockJwt };

        const newState = localAuthReducer(undefined, {
            type: SET_LOCAL_AUTH_JWT,
            payload: mockJwt,
        });
        expect(newState).toEqual(expectedState);
    });
});
