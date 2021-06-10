import React from "react";
import PropTypes from "prop-types";

function TextField(props) {
    const { label, placeholder, type, onChange } = props;
    return (
        <div>
            <label data-test="textfield-label">{label}</label>
            <input
                data-test="textfield"
                className="block m-auto w-full my-2 px-2 border-gray-400 focus:border-black border-2 leading-10 rounded-md"
                onChange={onChange}
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
}

TextField.propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default TextField;
