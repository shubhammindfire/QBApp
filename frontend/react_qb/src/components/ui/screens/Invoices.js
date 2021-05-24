import React, { useEffect } from "react";
import axios from "axios";
import Sidebar from "../widgets/notus-react/SideBar.js";
import Table from "../widgets/notus-react/Table.js";
import { GET_ALL_INVOICES } from "./../../../Constants.js";
import { useDispatch, useSelector } from "react-redux";
import { addAllInvoices } from "./../../../redux/quickbooks/invoice/invoiceActions.js";

function Invoices() {
    const jwt = useSelector((state) => state.localAuth.jwt);
    const invoices = useSelector((state) => state.invoice.invoices);
    const dispatch = useDispatch();

    useEffect(() => {
        axios
            .get(GET_ALL_INVOICES, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                console.log(response);
                dispatch(addAllInvoices(response.data));
            });
    }, []);

    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100">
                <div className="flex flex-wrap mt-4">
                    <div className="w-full mb-12 px-4">
                        <Table title="Invoices" invoices={invoices} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Invoices;
