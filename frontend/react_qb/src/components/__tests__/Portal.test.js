import React from "react";
import { shallow, mount } from "../../enzyme.js";
import Portal from "../ui/screens/Portal.js";
import { findByTestAtrr, testStore } from "../utils/testUtils.js";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";

const store = testStore();
describe("Portal tests", () => {
    test("renders portal without error", () => {
        const wrapper = mount(
            <Provider store={store}>
                <Portal />
            </Provider>
        );

	console.log(`debug = ${wrapper.debug()}`);
        const component = findByTestAtrr(wrapper, "portal-div");
        expect(component).toHaveLength(0);
        // expect(component.text()).toEqual("No Page Found");

        // const {container} = render(<Portal />);
        // console.log(container);
    });
});
