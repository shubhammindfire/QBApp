import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { LOGIN_ROUTE } from "../../../Constants";

function ErrorModal(props) {
    const { setShowErrorModal, type = "ERROR" } = props;

    return (
        <div className="w-96 h-40 fixed top-1/3 left-1/3 bg-white border border-black rounded-lg">
            {/* dialog */}
            <div className="relative p-8 w-full max-w-md m-auto flex-col flex">
                <div className="text-lg">
                    <FontAwesomeIcon
                        icon={faExclamationCircle}
                        color="#FFA500"
                        className="mr-2"
                    />
                    {type === "SESSION_EXPIRED"
                        ? "Session Expired, please login again"
                        : "An error Occured, please check the data filled"}
                </div>
                {type === "SESSION_EXPIRED" ? (
                    <Link
                        to={{
                            pathname: LOGIN_ROUTE,
                            state: {
                                isSessionExpired: true,
                            },
                        }}
                    >
                        <p className="submitBtn text-center bg-blue-600">
                            Go to login
                        </p>
                    </Link>
                ) : (
                    <button
                        className="submitBtn text-center bg-blue-600"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowErrorModal(false);
                        }}
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}

export default ErrorModal;
