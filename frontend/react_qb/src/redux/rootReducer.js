import { combineReducers } from "redux";
import localAuthReducer from "./localAuth/localAuthReducer.js";

const rootReducer = combineReducers({
    localAuth: localAuthReducer,
});

export default rootReducer;
