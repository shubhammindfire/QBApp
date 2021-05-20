import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TextField from "../widgets/TextField";
import { useSelector, useDispatch } from "react-redux";
import { setLocalAuthJwt } from "./../../../redux/localAuth/localAuthActions.js";

function Login() {
    const jwt = useSelector((state) => state.localAuth.jwt);
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);

    function handleUsernameChange(e) {
        setUsername(e.target.value);
        setLoginError(null);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setLoginError(null);
    }

    function handleQBOConnect(e) {
        e.preventDefault();

        const connectToQBOUrl = "http://localhost:8000/qb/connect";

        axios
            .get(connectToQBOUrl, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    console.log(response.data.authUrl);
                    window.location.href = response.data.authUrl;
                    // axios.get(response.data.authUrl);
                } else {
                    console.log(
                        `Error : ERROR CODE=${response.status} ERROR MESSAGE=${response.statusText}`
                    );
                }
            });
    }

    function handleLogin(e) {
        e.preventDefault();

        const loginUrl = "http://localhost:8000/api/login";
        axios
            .post(loginUrl, {
                username: username,
                password: password,
            })
            .then((response) => {
                if (response.status === 200) {
                    dispatch(setLocalAuthJwt(response.data));
                    localStorage.setItem('session-jwt',JSON.stringify(response.data));
                } else {
                    setLoginError(response.message);
                    console.log(
                        `Error : ERROR CODE=${response.status} ERROR MESSAGE=${response.message}`
                    );
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log(
                        "error response data = " + error.response.data.message
                    );

                    setLoginError(error.response.data.message);
                }
                console.error(`Axios Error: ${error}`);
            });
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <p className="mt-4 text-4xl">Login</p>
            <div className="rounded w-96 m-4 bg-gray-50 shadow-lg p-6 align-middle">
                <form onSubmit={handleLogin}>
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
                    {loginError !== null ? (
                        <p className="text-red-600">{loginError}</p>
                    ) : null}
                    <button
                        type="submit"
                        className={
                            jwt === null || jwt === ""
                                ? "submitBtn bg-blue-600"
                                : "submitBtn bg-blue-200"
                        }
                        disabled={jwt !== null && jwt !== ""}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={handleQBOConnect}
                        className={
                            jwt === null || jwt === ""
                                ? "submitBtn bg-blue-200"
                                : "submitBtn bg-blue-600"
                        }
                        disabled={jwt === null || jwt === ""}
                    >
                        Connect to QuickBooks
                    </button>
                </form>
            </div>
            <div>
                Not a registered user?
                <Link to="/register">
                    <p className="inline text-blue-600"> Register Instead</p>
                </Link>
            </div>
        </div>
    );
}

export default Login;
