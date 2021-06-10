import {
    ADD_ALL_CUSTOMERS,
    REMOVE_ALL_CUSTOMERS,
} from "../../redux/quickbooks/customer/customerTypes";
import { initialState } from "../../redux/quickbooks/customer/customerReducer";
import customerReducer from "../../redux/quickbooks/customer/customerReducer";

describe("Customer Reducer tests", () => {
    const mockCustomers = [
        { customerName: "mock name1", customerEmail: "mock email1" },
        { customerName: "mock name2", customerEmail: "mock email2" },
        { customerName: "mock name3", customerEmail: "mock email3" },
    ];

    it("Should return default state if no type is received", () => {
        const newState = customerReducer(undefined, {});
        expect(newState).toEqual(initialState);
    });

    it("Should return new all customer state on ADD_ALL_CUSTOMERS type", () => {
        const expectedState = { customers: mockCustomers };

        const newState = customerReducer(undefined, {
            type: ADD_ALL_CUSTOMERS,
            payload: mockCustomers,
        });
        expect(newState).toEqual(expectedState);
    });

    it("Should return new empty customer state on REMOVE_ALL_CUSTOMERS type", () => {
        // this is the mock of the existing state which is expected to be changed to the below `const expectedState`
        const existingState = { customers: mockCustomers };
        const expectedState = { customers: [] };

        const newState = customerReducer(existingState, {
            type: REMOVE_ALL_CUSTOMERS,
        });
        expect(newState).toEqual(expectedState);
    });
});
