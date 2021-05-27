import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import TextField from "../widgets/TextField";
import { REGISTER_URL, LOGIN_ROUTE } from "./../../../Constants.js";

function Register() {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [realmId, setRealmId] = useState("");

    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [realmIdError, setRealmIdError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    function handleUsernameChange(e) {
        setUsernameError(null);
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
        setPasswordError(null);
        setPassword(e.target.value);
    }

    function handleRealmIdChange(e) {
        setRealmIdError(null);
        setRealmId(e.target.value);
    }

    function handleRegister(e) {
        e.preventDefault();

        axios
            .post(REGISTER_URL, {
                username: username,
                password: password,
                realmId: realmId,
            })
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    // console.log("user created successfully");
                    setSuccessMessage("User registered successfully");
                    // delay and then route to /login after successfull register
                    setTimeout(() => {
                        history.push({ LOGIN_ROUTE });
                    }, 1500);
                } else {
                    // console.log(
                    //     `Error : ERROR CODE=${response.status} ERROR MESSAGE=${response.statusText}`
                    // );
                }
            })
            .catch((error) => {
                if (error.response) {
                    // console.log(
                    //     "error response data = " +
                    //         error.response.data.violations
                    // );

                    const violations = error.response.data.violations;

                    violations.forEach((violation) => {
                        if (violation["propertyPath"] === "username")
                            setUsernameError(violation["message"]);
                        if (violation.propertyPath === "password")
                            setPasswordError(violation["message"]);
                        if (violation.propertyPath === "realmId")
                            setRealmIdError(violation["message"]);
                    });
                }
                // console.error(`Axios Error: ${error}`);
            });
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <p className="mt-4 text-4xl">Register</p>
            <div className="rounded w-96 m-4 bg-gray-50 shadow-lg p-6 align-middle">
                <form onSubmit={handleRegister}>
                    <TextField
                        label="Username"
                        placeholder="Enter username"
                        type="text"
                        onChange={handleUsernameChange}
                    />
                    {usernameError !== null ? (
                        <p className="text-red-600">{usernameError}</p>
                    ) : null}
                    <TextField
                        label="Password"
                        placeholder="Enter password"
                        type="password"
                        onChange={handlePasswordChange}
                    />
                    {passwordError !== null ? (
                        <p className="text-red-600">{passwordError}</p>
                    ) : null}
                    <TextField
                        label="RealmId"
                        placeholder="Enter RealmId"
                        type="text"
                        onChange={handleRealmIdChange}
                    />
                    {realmIdError !== null ? (
                        <p className="text-red-600">{realmIdError}</p>
                    ) : null}
                    <button type="submit" className="submitBtn bg-blue-600">
                        Register
                    </button>
                    {successMessage !== null ? (
                        <p className="text-green-600 text-center my-2">
                            {successMessage}
                        </p>
                    ) : null}
                </form>
            </div>

            <div>
                Already registered?
                <Link to={LOGIN_ROUTE}>
                    <p className="inline text-blue-600"> Login Instead</p>
                </Link>
            </div>
        </div>
    );
}

export default Register;
