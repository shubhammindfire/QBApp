import React from "react";
import { mount } from "../../enzyme.js";
import Portal from "../ui/screens/Portal.js";
import { findByTestAtrr, testStore } from "../utils/testUtils.js";
import { Provider } from "react-redux";
import { setLocalAuthJwt } from "./../../redux/localAuth/localAuthActions";
import { BrowserRouter as Router } from "react-router-dom";

let store;
describe("Portal tests", () => {
    describe("When jwt is null", () => {
        store = testStore();
        test("redirects to login if jwt is null", () => {
            const wrapper = mount(
                <Provider store={store}>
                    <Router>
                        <Portal />
                    </Router>
                </Provider>
            );

            const component = findByTestAtrr(wrapper, "redirect-to-login");
            expect(component).toHaveLength(1);
        });
    });

    describe("When jwt is not null", () => {
        let wrapper;
        beforeEach(() => {
            store = testStore();
            store.dispatch(setLocalAuthJwt("mockjwt"));
            wrapper = mount(
                <Provider store={store}>
                    <Router>
                        <Portal />
                    </Router>
                </Provider>
            );
        });

        test("renders portal if jwt is not null", () => {
            const component = findByTestAtrr(wrapper, "portal-div");
            expect(component).toHaveLength(1);
        });

        test("renders Fetch Data From Quickbooks button", () => {
            const component = findByTestAtrr(
                wrapper,
                "fetch-data-from-qb-button"
            );
            expect(component).toHaveLength(1);
        });
    });
});
