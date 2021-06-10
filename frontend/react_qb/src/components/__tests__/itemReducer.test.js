import {
    ADD_ALL_ITEMS,
    REMOVE_ALL_ITEMS,
} from "../../redux/quickbooks/item/itemTypes";
import { initialState } from "../../redux/quickbooks/item/itemReducer";
import itemReducer from "../../redux/quickbooks/item/itemReducer";

describe("Item Reducer tests", () => {
    const mockItems = [
        { itemName: "mock name1", itemPrice: 22.4 },
        { itemName: "mock name2", itemPrice: 34.0 },
        { itemName: "mock name3", itemPrice: 55.69 },
    ];

    it("Should return default state if no type is received", () => {
        const newState = itemReducer(undefined, {});
        expect(newState).toEqual(initialState);
    });

    it("Should return new all item state on ADD_ALL_ITEMS type", () => {
        const expectedState = { items: mockItems };

        const newState = itemReducer(undefined, {
            type: ADD_ALL_ITEMS,
            payload: mockItems,
        });
        expect(newState).toEqual(expectedState);
    });

    it("Should return new empty item state on REMOVE_ALL_ITEMS type", () => {
        // this is the mock of the existing state which is expected to be changed to the below `const expectedState`
        const existingState = { items: mockItems };
        const expectedState = { items: [] };

        const newState = itemReducer(existingState, {
            type: REMOVE_ALL_ITEMS,
        });
        expect(newState).toEqual(expectedState);
    });
});
