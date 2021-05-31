import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../widgets/notus-react/SideBar.js";
import InvoiceTable from "../widgets/notus-react/InvoiceTable.js";
import { GET_ALL_INVOICES } from "./../../../Constants.js";
import { useDispatch, useSelector } from "react-redux";
import {
    addAllInvoices,
    removeAllInvoices,
    removeCurrentCartItems,
    removeCurrentInvoice,
} from "./../../../redux/quickbooks/invoice/invoiceActions.js";
import ErrorModal from "../widgets/ErrorModal.js";

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
                dispatch(removeCurrentCartItems());
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
                    <div className="relative md:ml-64 bg-blueGray-100">
                        <div className="flex flex-wrap mt-4">
                            <div className="w-full mb-12 px-4">
                                <InvoiceTable
                                    title="Invoices"
                                    invoices={invoices}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Invoices;
