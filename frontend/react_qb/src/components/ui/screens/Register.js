import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TextField from "../widgets/TextField";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [realmId, setRealmId] = useState("");

    const [registerError, setRegisterError] = useState(null);

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleRealmIdChange(e) {
        setRealmId(e.target.value);
    }

    function handleRegister(e) {
        e.preventDefault();

        const registerUrl = "http://localhost:8000/api/users";

        axios
            .post(registerUrl, {
                username: username,
                password: password,
                realmId: realmId,
            })
            .then((response) => {
                console.log(response);
                // console.log(response.data);
                if (response.status === 200) {
                    console.log(response.data);
                } else {
                    console.log(
                        `Error : ERROR CODE=${response.status} ERROR MESSAGE=${response.statusText}`
                    );
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log(
                        "error response data = " + error.response.data.message
                    );

                    setRegisterError(error.response.data.message);
                }
                console.error(`Axios Error: ${error}`);
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
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        label="Password"
                        placeholder="Enter password"
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        label="RealmId"
                        placeholder="Enter RealmId"
                        onChange={handleRealmIdChange}
                    />
                    {registerError !== null ? (
                        <p className="text-red-600">{registerError}</p>
                    ) : null}
                    <button type="submit" className="submitBtn bg-blue-600">
                        Register
                    </button>
                </form>
            </div>

            <div>
                Already registered?
                <Link to="/login">
                    <p className="inline text-blue-600"> Login Instead</p>
                </Link>
            </div>
        </div>
    );
}

export default Register;
