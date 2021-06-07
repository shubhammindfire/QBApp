import React, { useState } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import TextField from "../widgets/TextField";
import { useSelector, useDispatch } from "react-redux";
import { setLocalAuthJwt } from "./../../../redux/localAuth/localAuthActions.js";
import {
    LOGIN_URL,
    CONNECT_TO_QBO_URL,
    REGISTER_ROUTE,
    PORTAL_ROUTE,
} from "./../../../Constants.js";
import checkSessionExpired from "./../../utils/checkSessionExpired.js";

function Login(props) {
    if (localStorage.getItem("isQBOConnected") === undefined)
        localStorage.setItem("isQBOConnected", false);
    // converting 'true' or 'false' from local storage to true or false
    const isQBOConnected = localStorage.getItem("isQBOConnected") === "true";

    const isSessionExpired =
        props.location.state !== undefined
            ? props.location.state.isSessionExpired
            : false;
    const jwt = useSelector((state) => state.localAuthReducer.jwt);
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

        axios
            .get(CONNECT_TO_QBO_URL, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                if (response.status === 200) {
                    window.location.href = response.data.authUrl;
                } else {
                }
            });
    }

    function handleLogin(e) {
        e.preventDefault();

        axios
            .post(LOGIN_URL, {
                username: username,
                password: password,
            })
            .then((response) => {
                if (response.status === 200) {
                    dispatch(setLocalAuthJwt(response.data));
                    const ttl = 3600000; // time for expiry in milliseconds
                    const itemToLocalStorage = {
                        value: response.data,
                        expiry: new Date().getTime() + ttl,
                    };
                    localStorage.setItem(
                        "session-jwt",
                        JSON.stringify(itemToLocalStorage)
                    );
                } else {
                    setLoginError(response.message);
                }
            })
            .catch((error) => {
                if (error.response) {
                    setLoginError(error.response.data.message);
                }
            });
    }

    return (
        <>
            {isQBOConnected === true &&
            jwt !== null &&
            checkSessionExpired() === false ? (
                // if the user is logged in and session is not expired then redirect to portal
                <Redirect to={PORTAL_ROUTE} />
            ) : (
                <div className="flex flex-col justify-center items-center">
                    {isSessionExpired ? (
                        <p className="text-red-600">
                            Session Expired Login again
                        </p>
                    ) : null}
                    <p className="mt-4 text-4xl">Login</p>
                    <div className="rounded w-96 m-4 bg-gray-50 shadow-lg p-6 align-middle">
                        <form onSubmit={handleLogin}>
                            <TextField
                                label="Username"
                                placeholder="Enter username"
                                type="text"
                                onChange={handleUsernameChange}
                            />
                            <TextField
                                label="Password"
                                placeholder="Enter password"
                                type="password"
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

                            {jwt !== null ? (
                                <p className="text-green-600">
                                    Login successfull, now connect to Quickbooks
                                </p>
                            ) : null}
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
                        <Link to={REGISTER_ROUTE}>
                            <p className="inline text-blue-600">
                                {" "}
                                Register Instead
                            </p>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}

export default Login;
