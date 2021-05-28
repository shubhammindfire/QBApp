import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { BASE_REACT_ROUTE, PORTAL_INVOICES_ROUTE } from "../../../Constants";

function SuccessModal(props) {
    const { setShowSuccessModal, type } = props;

    return (
        <div className="w-96 h-40 fixed top-1/3 left-1/3 bg-white border border-black rounded-lg">
            {/* dialog */}
            <div className="relative p-8 w-full max-w-md m-auto flex-col flex">
                <div className="text-lg">
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        color="#228B22"
                        className="mr-2"
                    />
                    Invoice Created Successfully
                </div>
                <button
                    className="submitBtn text-center bg-blue-600"
                    onClick={(e) => {
                        e.preventDefault();
                        if (type === "Save") setShowSuccessModal(false);
                        else if (type === "Save&Close") {
                            setShowSuccessModal(false);
                        }
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default SuccessModal;
