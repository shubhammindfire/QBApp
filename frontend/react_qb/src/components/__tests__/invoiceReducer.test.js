import {
    ADD_ALL_INVOICES,
    REMOVE_ALL_INVOICES,
    REMOVE_INVOICE_BY_INDEX,
    ADD_CURRENT_INVOICE,
    ADD_CURRENT_INVOICE_ITEMS,
    DELETE_CURRENT_INVOICE_ITEM_BY_INDEX,
    REMOVE_CURRENT_INVOICE,
    REMOVE_CURRENT_INVOICE_ITEMS,
} from "../../redux/quickbooks/invoice/invoiceTypes";
import { initialState } from "../../redux/quickbooks/invoice/invoiceReducer";
import invoiceReducer from "../../redux/quickbooks/invoice/invoiceReducer";

const mockInvoices = [
    { invoiceId: 1, invoiceAmount: 22.42 },
    { invoiceId: 2, invoiceAmount: 34.0 },
    { invoiceId: 3, invoiceAmount: 55.69 },
];

const mockCurrentInvoice = { invoiceId: 1, invoiceAmount: 22.42 };
const mockCurrentInvoiceItems = [
    { invoiceItemId: 1, invoiceItemName: "mock invoice item 1" },
    { invoiceItemId: 2, invoiceItemName: "mock invoice item 2" },
    { invoiceItemId: 3, invoiceItemName: "mock invoice item 3" },
];

describe("Invoice Reducer tests", () => {
    it("Should return default state if no type is received", () => {
        const newState = invoiceReducer(undefined, {});
        expect(newState).toEqual(initialState);
    });

    it("Should return new all invoice state on ADD_ALL_INVOICES type", () => {
        const existingState = {
            invoices: [],
            currentInvoice: mockCurrentInvoice,
            currentInvoiceItems: mockCurrentInvoiceItems,
        };
        const expectedState = { ...existingState, invoices: mockInvoices };

        const newState = invoiceReducer(existingState, {
            type: ADD_ALL_INVOICES,
            payload: mockInvoices,
        });
        expect(newState).toEqual(expectedState);
    });

    it("Should return new empty invoice state on REMOVE_ALL_INVOICES type", () => {
        const existingState = {
            invoices: mockInvoices,
            currentInvoice: mockCurrentInvoice,
            currentInvoiceItems: mockCurrentInvoiceItems,
        };
        const expectedState = { ...existingState, invoices: [] };

        const newState = invoiceReducer(existingState, {
            type: REMOVE_ALL_INVOICES,
        });
        expect(newState).toEqual(expectedState);
    });

    it("Should remove an invoice by it's index on REMOVE_INVOICE_BY_INDEX type", () => {
        const mockIndex = 0;
        const existingState = {
            invoices: mockInvoices,
            currentInvoice: mockCurrentInvoice,
            currentInvoiceItems: mockCurrentInvoiceItems,
        };
        const expectedState = {
            ...existingState,
            invoices: [
                { invoiceId: 2, invoiceAmount: 34.0 },
                { invoiceId: 3, invoiceAmount: 55.69 },
            ],
        };

        const newState = invoiceReducer(existingState, {
            type: REMOVE_INVOICE_BY_INDEX,
            payload: mockIndex,
        });
        expect(newState).toEqual(expectedState);
    });

    it("Should return a new state with new currentInvoice on ADD_CURRENT_INVOICE type", () => {
        const existingState = {
            invoices: mockInvoices,
            currentInvoice: {},
            currentInvoiceItems: mockCurrentInvoiceItems,
        };
        const expectedState = {
            ...existingState,
            currentInvoice: mockCurrentInvoice,
        };

        const newState = invoiceReducer(existingState, {
            type: ADD_CURRENT_INVOICE,
            payload: mockCurrentInvoice,
        });
        expect(newState).toEqual(expectedState);
    });

    it("Should return a new state with new currentInvoiceItems on ADD_CURRENT_INVOICE_ITEMS type", () => {
        const existingState = {
            invoices: mockInvoices,
            currentInvoice: mockCurrentInvoice,
            currentInvoiceItems: [],
        };
        const expectedState = {
            ...existingState,
            currentInvoiceItems: mockCurrentInvoiceItems,
        };

        const newState = invoiceReducer(existingState, {
            type: ADD_CURRENT_INVOICE_ITEMS,
            payload: mockCurrentInvoiceItems,
        });
        expect(newState).toEqual(expectedState);
    });

    it("Should remove an invoiceItems by it's index on DELETE_INVOICE_ITEM_BY_INDEX type", () => {
        const mockIndex = 1;
        const existingState = {
            invoices: mockInvoices,
            currentInvoice: mockCurrentInvoice,
            currentInvoiceItems: mockCurrentInvoiceItems,
        };
        const expectedState = {
            ...existingState,
            currentInvoiceItems: [
                { invoiceItemId: 1, invoiceItemName: "mock invoice item 1" },
                { invoiceItemId: 3, invoiceItemName: "mock invoice item 3" },
            ],
        };

        const newState = invoiceReducer(existingState, {
            type: DELETE_CURRENT_INVOICE_ITEM_BY_INDEX,
            payload: mockIndex,
        });
        expect(newState).toEqual(expectedState);
    });

    it("Should return new empty currentInvoice state on REMOVE_CURRENT_INVOICE type", () => {
        const existingState = {
            invoices: mockInvoices,
            currentInvoice: mockCurrentInvoice,
            currentInvoiceItems: mockCurrentInvoiceItems,
        };
        const expectedState = { ...existingState, currentInvoice: {} };

        const newState = invoiceReducer(existingState, {
            type: REMOVE_CURRENT_INVOICE,
        });
        expect(newState).toEqual(expectedState);
    });

    it("Should return new empty currentInvoiceItems state on REMOVE_CURRENT_INVOICE_ITEMS type", () => {
        const existingState = {
            invoices: mockInvoices,
            currentInvoice: mockCurrentInvoice,
            currentInvoiceItems: mockCurrentInvoiceItems,
        };
        const expectedState = { ...existingState, currentInvoiceItems: [] };

        const newState = invoiceReducer(existingState, {
            type: REMOVE_CURRENT_INVOICE_ITEMS,
        });
        expect(newState).toEqual(expectedState);
    });
});
