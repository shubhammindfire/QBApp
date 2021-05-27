import { combineReducers } from "redux";
import localAuthReducer from "./localAuth/localAuthReducer.js";
import invoiceReducer from "./quickbooks/invoice/invoiceReducer.js";
import itemReducer from "./quickbooks/item/itemReducer.js";
import customerReducer from "./quickbooks/customer/customerReducer.js";

const rootReducer = combineReducers({
    localAuthReducer,
    invoiceReducer,
    itemReducer,
    customerReducer,
});

export default rootReducer;
