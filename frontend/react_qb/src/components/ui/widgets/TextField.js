import React from "react";

function TextField(props) {
    const { label, placeholder, type, onChange } = props;
    return (
        <div>
            <label>{label}</label>
            <input
                className="block m-auto w-full my-2 px-2 border-gray-400 focus:border-black border-2 leading-10 rounded-md"
                onChange={onChange}
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
}

export default TextField;
