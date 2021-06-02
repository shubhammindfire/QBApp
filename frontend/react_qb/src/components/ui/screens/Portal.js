import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import ErrorModal from "../widgets/ErrorModal";
import Sidebar from "../widgets/notus-react/SideBar";
import SuccessModal from "../widgets/SuccessModal";
import {
    FETCH_DATA_FROM_QBO_URL,
    GET_CURRENT_USER,
    LOGIN_ROUTE,
} from "./../../../Constants.js";
import LoadingModal from "./../widgets/LoadingModal.js";
import checkSessionExpired from "./../../utils/checkSessionExpired.js";

function Portal() {
    const jwt = useSelector((state) => state.localAuthReducer.jwt);
    const [showLoading, setShowLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalType, setErrorModalType] = useState("ERROR");

    useEffect(() => {
        if (jwt !== null && checkSessionExpired() === false)
            localStorage.setItem("isQBOConnected", true);
    }, []);

    async function handleFetchDataFromQBO() {
        try {
            setShowLoading(true);
            const currentUser = await axios.get(GET_CURRENT_USER, {
                headers: { Authorization: `Bearer ${jwt}` },
            });

            const response = await axios.get(
                FETCH_DATA_FROM_QBO_URL + `/${await currentUser.data.realmId}`
            );
            if (response.status === 204) {
                setShowLoading(false);
                setShowSuccessModal(true);
            } else {
                setShowLoading(false);
                setShowErrorModal(true);
            }
        } catch (error) {
            setShowLoading(false);
            if (error.response.data.code === 401) {
                setErrorModalType("SESSION_EXPIRED");
            }
            setShowErrorModal(true);
            console.log(`Error: ${error}`);
        }
    }

    return (
        <>
            {/* {jwt === null || checkSessionExpired() === false ? ( */}
            {jwt === null ? (
                // if the user is not logged in or the session expired then redirect to login
                <Redirect to={LOGIN_ROUTE} />
            ) : (
                <div>
                    <Sidebar />
                    <div className="md:ml-64 mt-16 py-4 text-3xl text-center bg-blueGray-100">
                        <p>Welcome to the Quick Books Integration portal</p>
                        <div className="text-base mx-3">
                            <p className="mt-2 lg:mx-52">
                                QuickBooks is an accounting software package
                                developed and marketed by Intuit. QuickBooks
                                products are geared mainly toward small and
                                medium-sized businesses and offer on-premises
                                accounting applications.
                            </p>
                            <div className="m-3 lg:mx-72 text-left">
                                <p>
                                    This application integrates with QuickBooks
                                    and allows the user to do the following:
                                </p>
                                <ul className="ml-4">
                                    <li className="list-disc">
                                        Connect to their account in Quickbooks
                                    </li>
                                    <li className="list-disc">
                                        View their Customers
                                    </li>
                                    <li className="list-disc">
                                        View their Items
                                    </li>
                                    <li className="list-disc">
                                        View, Create, Edit and Delete their
                                        Invoices
                                    </li>
                                </ul>
                            </div>
                            <p className="m-3">
                                All the data and the changes made to them are in
                                sync the QuickBooks Online(QBO) platform
                            </p>
                            {showLoading ? <LoadingModal /> : null}
                            {showSuccessModal ? (
                                <SuccessModal
                                    setShowSuccessModal={setShowSuccessModal}
                                    type="Close"
                                    message="Fetched all data successfully"
                                />
                            ) : null}
                            {showErrorModal ? (
                                <ErrorModal type={errorModalType} />
                            ) : null}
                            <button
                                className="roundedPillBtn bg-green-600 mx-auto"
                                onClick={handleFetchDataFromQBO}
                            >
                                Fetch data from QuickBooks
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Portal;
