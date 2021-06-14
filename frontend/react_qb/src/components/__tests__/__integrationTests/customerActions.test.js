import { testStore } from "../../utils/testUtils";
import {
    addAllCustomers,
    removeAllCustomers,
} from "../../../redux/quickbooks/customer/customerActions";

const store = testStore();
const mockCustomers = [
    { customerName: "mock name1", customerEmail: "mock email1" },
    { customerName: "mock name2", customerEmail: "mock email2" },
    { customerName: "mock name3", customerEmail: "mock email3" },
];
describe("addAllCustomers action", () => {
    test("Store is updated correctly", () => {
        const expectedState = mockCustomers;

        // check for the state to be initially empty
        const oldState = store.getState().customerReducer;
        expect(oldState.customers).toStrictEqual([]);

        // dispatch the action
        store.dispatch(addAllCustomers(mockCustomers));
        const newState = store.getState().customerReducer;
        // check if the state is updated or not
        expect(newState.customers).toBe(expectedState);
    });
});

describe("removeAllCustomers action", () => {
    test("Store is updated correctly", () => {
        const expectedState = [];

        // check for the state to be initially filled
        const oldState = store.getState().customerReducer;
        expect(oldState.customers).toStrictEqual(mockCustomers);

        // dispatch the action
        store.dispatch(removeAllCustomers());
        const newState = store.getState().customerReducer;
        // check if the state is updated or not
        expect(newState.customers).toStrictEqual(expectedState);
    });
});
