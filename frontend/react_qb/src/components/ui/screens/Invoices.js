import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../widgets/notus-react/SideBar.js";
import InvoiceTable from "../widgets/notus-react/InvoiceTable.js";
import { GET_ALL_INVOICES, PORTAL_ROUTE } from "./../../../Constants.js";
import { useDispatch, useSelector } from "react-redux";
import {
    addAllInvoices,
    removeAllInvoices,
    removeCurrentInvoiceItems,
    removeCurrentInvoice,
} from "./../../../redux/quickbooks/invoice/invoiceActions.js";
import ErrorModal from "../widgets/ErrorModal.js";
import { Link } from "react-router-dom";

function Invoices() {
    const jwt = useSelector((state) => state.localAuthReducer.jwt);
    const invoices = useSelector((state) => state.invoiceReducer.invoices);
    const dispatch = useDispatch();
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        axios
            .get(GET_ALL_INVOICES, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                console.log(response);
                dispatch(addAllInvoices(response.data));

                // clear the current invoice and current cartItems states in redux
                dispatch(removeCurrentInvoice());
                dispatch(removeCurrentInvoiceItems());
            })
            .catch((error) => {
                if (error.response.data.code === 401) {
                    setIsSessionExpired(true);
                }
            });
        // clearing all redux state related to invoice on component did unmount
        return () => {
            dispatch(removeAllInvoices());
        };
    }, []);

    return (
        <>
            {isSessionExpired ? (
                <ErrorModal type="SESSION_EXPIRED" />
            ) : (
                <>
                    <Sidebar />
                    <div className="relative md:ml-64 bg-blueGray-100 py-10">
                        {invoices === null || invoices === "" ? (
                            <div className="text-center">
                                <p className="mb-4 text-lg">
                                    No invoice data available. Please ensure to
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
                            <InvoiceTable
                                title="Invoices"
                                invoices={invoices}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default Invoices;
