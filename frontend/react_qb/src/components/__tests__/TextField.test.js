import React from "react";
import { shallow } from "../../enzyme";
import TextField from "../ui/widgets/TextField";
import { findByTestAtrr, checkProps } from "../utils/testUtils";

const setUp = (props = {}) => {
    const component = shallow(<TextField {...props} />);
    return component;
};

describe("TextField tests", () => {
    const mockFunc = jest.fn();
    const expectedProps = {
        label: "mock label",
        placeholder: "mock placeholder",
        type: "mock type",
        onChange: mockFunc,
    };

    let wrapper;
    beforeEach(() => {
        wrapper = setUp(expectedProps);
    });

    test("proptypes should not throw a warning", () => {
        const propsError = checkProps(TextField, expectedProps);
        expect(propsError).toBeUndefined();
    });

    test("renders label text correctly", () => {
        const component = findByTestAtrr(wrapper, "textfield-label");

        expect(component).toHaveLength(1);
        expect(component.text()).toEqual("mock label");
    });

    test("renders textfield correctly", () => {
        const component = findByTestAtrr(wrapper, "textfield");

        expect(component).toHaveLength(1);
    });

    test("should emit callback on onChange event", () => {
        const button = findByTestAtrr(wrapper, "textfield");
        button.simulate("change");
        const callback = mockFunc.mock.calls.length;
        expect(callback).toBe(1);
    });
});
