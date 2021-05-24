import { combineReducers } from "redux";
import localAuthReducer from "./localAuth/localAuthReducer.js";
import invoiceReducer from "./quickbooks/invoice/invoiceReducer.js";

const rootReducer = combineReducers({
    localAuth: localAuthReducer,
    invoice: invoiceReducer,
});

export default rootReducer;
