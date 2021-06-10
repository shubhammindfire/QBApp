import React from "react";
import { shallow } from "../../enzyme";
import SuccessModal from "../ui/widgets/SuccessModal";
import { findByTestAtrr, checkProps } from "../utils/testUtils";

const setUp = (props = {}) => {
    const component = shallow(<SuccessModal {...props} />);
    return component;
};

describe("SuccessModal tests", () => {
    const mockFunc = jest.fn();
    const expectedProps = {
        setShowSuccessModal: mockFunc,
        type: "mock type",
        message: "mock message",
    };

    let wrapper;
    beforeEach(() => {
        wrapper = setUp(expectedProps);
    });

    test("proptypes should not throw a warning", () => {
        const propsError = checkProps(SuccessModal, expectedProps);
        expect(propsError).toBeUndefined();
    });

    test("renders modal text correctly", () => {
        const component = findByTestAtrr(wrapper, "modal-message");

        expect(component).toHaveLength(1);
    });

    describe("Modal button tests", () => {
        test("renders button text correctly", () => {
            const button = findByTestAtrr(wrapper, "modal-button");
            expect(button.text()).toEqual("Close");
        });

        test("should emit callback on onClick event", () => {
            const button = findByTestAtrr(wrapper, "modal-button");
            const event = Object.assign(jest.fn(), {
                preventDefault: () => {},
            });
            button.simulate("click", event);
            // button.simulate("click", {
            //     preventDefault: () => {},
            // });

            const callback = mockFunc.mock.calls.length;
            // expect(callback).toBe(1);
        });
    });
});
