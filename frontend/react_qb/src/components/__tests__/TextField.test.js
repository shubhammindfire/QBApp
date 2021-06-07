import React from "react";
import { shallow } from "../../enzyme";
import TextField from "../ui/widgets/TextField";
import { findByTestAtrr } from "../utils/testUtils";

describe("TextField tests", () => {
    test("renders label text correctly", () => {
        const wrapper = shallow(
            <TextField
                label="mock label"
                placeholder="mock placeholder"
                type="mock type"
                onChange={jest.fn()}
            />
        );
        const component = findByTestAtrr(wrapper, "textfield-label");

        expect(component).toHaveLength(1);
        expect(component.text()).toEqual("mock label");
    });
});
