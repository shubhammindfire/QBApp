import { checkPropTypes } from "prop-types";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import rootReducer from "./../../redux/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";

export const findByTestAtrr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
};

export const checkProps = (component, expectedProps) => {
    const propsErr = checkPropTypes(
        component.propTypes,
        expectedProps,
        "props",
        component.name
    );
    return propsErr;
};

export const testStore = (initialState) => {
    return createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(logger))
    );
    // const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
    // return createStoreWithMiddleware(rootReducer, initialState);
};
