import React from "react";
import { shallow } from "../../enzyme.js";
import NoPageFound from "../ui/screens/NoPageFound";
import { findByTestAtrr } from "../utils/testUtils.js";

describe("NoPageFound tests", () => {
    test("renders no page found test", () => {
        const wrapper = shallow(<NoPageFound />);

        const component = findByTestAtrr(wrapper, "no-page-found-div");

        expect(component).toHaveLength(1);
        expect(component.text()).toEqual("No Page Found");
    });
});
