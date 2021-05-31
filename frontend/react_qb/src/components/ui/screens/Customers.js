import React, { useEffect, useState } from "react";
import Sidebar from "../widgets/notus-react/SideBar.js";
import CustomerAndItemTable from "../widgets/notus-react/CustomerAndItemTable.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { GET_ALL_CUSTOMERS, PORTAL_ROUTE } from "../../../Constants.js";
import {
    addAllCustomers,
    removeAllCustomers,
} from "./../../../redux/quickbooks/customer/customerActions.js";
import ErrorModal from "../widgets/ErrorModal.js";
import { Link } from "react-router-dom";

function Customers() {
    const jwt = useSelector((state) => state.localAuthReducer.jwt);
    const customers = useSelector((state) => state.customerReducer.customers);
    const dispatch = useDispatch();
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        axios
            .get(GET_ALL_CUSTOMERS, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                dispatch(addAllCustomers(response.data));
            })
            .catch((error) => {
                if (error.response.data.code === 401) {
                    setIsSessionExpired(true);
                }
            });
        // clear the redux state on component did unmount
        return () => {
            dispatch(removeAllCustomers());
        };
    }, [jwt, dispatch]);

    return (
        <>
            {isSessionExpired ? (
                <ErrorModal type="SESSION_EXPIRED" />
            ) : (
                <>
                    <Sidebar />
                    <div className="relative md:ml-64 bg-blueGray-100 py-10">
                        {customers === null || customers === "" ? (
                            <div className="text-center">
                                <p className="mb-4 text-lg">
                                    No customer data available. Please ensure to
                                    click on "Fetch data from QuickBooks" button
                                    in the portal home page.
                                </p>
                                <Link
                                    to={PORTAL_ROUTE}
                                    className="rounded-full bg-green-600 text-white px-4 py-2"
                                >
                                    Go to Portal Home page
                                </Link>
                            </div>
                        ) : (
                            <CustomerAndItemTable
                                title="Customers"
                                data={customers}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default Customers;
