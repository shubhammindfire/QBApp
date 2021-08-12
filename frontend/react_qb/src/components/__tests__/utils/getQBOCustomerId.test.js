import getQBOCustomerId from "../../utils/getQBOCustomerId";

const mockCustomers = [
    {
        id: 1,
        displayName: "mock_display_name",
        qBOId: 1,
    },
    {
        id: 2,
        displayName: "mock_display_name_to_search",
        qBOId: 2,
    },
];
const mockDisplayNameToSearch = "mock_display_name_to_search";
const mockErrorDisplayName = "mock_error_display_name"
describe("getQBOCustomerId function tests", () => {
    test("returns qboCustomerId if customer is found", () => {
        const functionReturn = getQBOCustomerId(
            mockCustomers,
            mockDisplayNameToSearch
        );
        expect(functionReturn).toBeTruthy();
    });
    test("throws error if customer is not found", () => {
        const functionReturn = getQBOCustomerId(
            mockCustomers,
            mockErrorDisplayName
        );
        expect(functionReturn).toBeTruthy();
    });
});
