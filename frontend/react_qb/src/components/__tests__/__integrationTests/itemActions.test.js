import { testStore } from "../../utils/testUtils";
import {
    addAllItems,
    removeAllItems,
} from "../../../redux/quickbooks/item/itemActions";

const store = testStore();
const mockItems = [
    { itemName: "mock name1", itemPrice: 22.99 },
    { itemName: "mock name2", itemPrice: 12.72 },
    { itemName: "mock name3", itemPrice: 11.03 },
];
describe("addAllItems action", () => {
    test("Store is updated correctly", () => {
        const expectedState = mockItems;

        // check for the state to be initially empty
        const oldState = store.getState().itemReducer;
        expect(oldState.items).toStrictEqual([]);

        // dispatch the action
        store.dispatch(addAllItems(mockItems));
        const newState = store.getState().itemReducer;
        // check if the state is updated or not
        expect(newState.items).toBe(expectedState);
    });
});

describe("removeAllItems action", () => {
    test("Store is updated correctly", () => {
        const expectedState = [];

        // check for the state to be initially filled
        const oldState = store.getState().itemReducer;
        expect(oldState.items).toStrictEqual(mockItems);

        // dispatch the action
        store.dispatch(removeAllItems());
        const newState = store.getState().itemReducer;
        // check if the state is updated or not
        expect(newState.items).toStrictEqual(expectedState);
    });
});
