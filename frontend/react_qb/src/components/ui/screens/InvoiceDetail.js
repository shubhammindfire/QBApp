import {
    faHistory,
    faTimes,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    PORTAL_INVOICES_ROUTE,
    GET_INVOICE_BY_ID,
} from "../../../Constants.js";

function InvoiceDetail(props) {
    const jwt = useSelector((state) => state.localAuth.jwt);
    const [invoiceTableId] = useState(
        props.location.state !== undefined
            ? props.location.state.invoiceTableId
            : null
    );

    // this is a json object of invoice
    const [invoice, setInvoice] = useState([]);
    // this is an array of json objects of cartItems
    const [cartItems, setCartItems] = useState([]);

    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [balance, setBalance] = useState(0.0);
    const [billingAddress, setBillingAddress] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [totalAmount, setTotalAmount] = useState(0.0);

    useEffect(() => {
        axios
            .get(GET_INVOICE_BY_ID + `/${invoiceTableId}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                // TODO: remove this
                console.log(JSON.stringify(response.data.invoice));
                console.log(JSON.stringify(response.data.cartItems));

                setInvoice(response.data.invoice);
                setCartItems(response.data.cartItems);
                setCustomerName(response.data.invoice.customerName);
                setCustomerEmail(response.data.invoice.customerEmail);
                setBalance(response.data.invoice.balance);
                setTotalAmount(response.data.invoice.amount);
                setBillingAddress(response.data.invoice.billingAddress);
                const rawInvoiceDate = response.data.invoice.invoiceDate;
                const formattedInvoiceDate = rawInvoiceDate.split("T")[0];
                setInvoiceDate(formattedInvoiceDate);
                const rawDueDate = response.data.invoice.dueDate;
                const formattedDueDate = rawDueDate.split("T")[0];
                setDueDate(formattedDueDate);
            });
    }, []);

    function handleCustomerNameChange(e) {
        e.preventDefault();

        setCustomerName(e.target.value);
    }

    function handleCustomerEmailChange(e) {
        e.preventDefault();

        setCustomerEmail(e.target.value);
    }

    function handleBillingAddressChange(e) {
        e.preventDefault();

        setBillingAddress(e.target.value);
    }

    function handleInvoiceDateChange(e) {
        e.preventDefault();

        setInvoiceDate(e.target.value);
    }

    function handleDueDateChange(e) {
        e.preventDefault();

        setDueDate(e.target.value);
    }

    function handleCancel() {
        // TODO: pending
    }

    function handleClear() {
        // TODO: pending
    }

    function handleSave() {
        // TODO: pending
    }

    function handleSaveAndClose() {
        // TODO: pending
    }

    return (
        <div>
            {/* top heading */}
            <div className="flex justify-between p-3">
                <div>
                    <FontAwesomeIcon
                        icon={faHistory}
                        color="#696969"
                        size="2x"
                    />
                    <p className="inline font-bold ml-2 text-gray-800 text-3xl">
                        Invoice #{invoice.invoiceNumber}
                    </p>
                </div>
                <Link to={PORTAL_INVOICES_ROUTE}>
                    <FontAwesomeIcon icon={faTimes} color="#696969" size="2x" />
                </Link>
            </div>

            {/* the margin below is used because the footer hides the data at the bottom */}
            <form className="mb-64">
                {/* grid wrapper*/}
                <div className="px-5">
                    {/* row 1 */}
                    <div className="grid xs:grid-cols-1 lg:grid-cols-8">
                        <div className="col-span-2 lg:mr-3">
                            <label htmlFor="customer" className="font-bold">
                                Customer
                            </label>
                            <div>
                                <input
                                    list="customerNames"
                                    className="inline rounded p-2 border border-black xs:w-full"
                                    placeholder="Select a customer"
                                    value={customerName}
                                    onChange={handleCustomerNameChange}
                                    disabled={balance === 0.0 ? true : false}
                                />
                                <datalist id="customerNames">
                                    {/* TODO: fetch this list of custoemers */}
                                    <option value="Edge" />
                                    <option value="Firefox" />
                                    <option value="Chrome" />
                                    <option value="Opera" />
                                    <option value="Safari" />
                                </datalist>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="customerEmail"
                                className="font-bold"
                            >
                                Customer email
                            </label>
                            <input
                                type="text"
                                className="block rounded xs:w-full"
                                placeholder="Enter customer email"
                                value={customerEmail}
                                onChange={handleCustomerEmailChange}
                                disabled={balance === 0.0 ? true : false}
                            />
                        </div>
                        {/* Empty col */}
                        <div className="col-span-2"></div>
                        {/* if balance is zero then show that payment status is "paid", else show the balance due amount */}
                        {balance === 0.0 ? (
                            <div className="col-span-2 text-right">
                                <span className="text-gray-500 font-bold">
                                    PAYMENT STATUS
                                </span>
                                <p className="font-bold text-4xl">PAID</p>
                            </div>
                        ) : (
                            <div className="col-span-2 text-right">
                                <span className="text-gray-500 font-bold">
                                    BALANCE DUE
                                </span>
                                <p className="font-bold text-4xl">${balance}</p>
                            </div>
                        )}
                    </div>

                    {/* row 2 */}
                    <div className="grid xs:mt-8 lg:mt-16 xs:grid-cols-1 lg:grid-cols-8">
                        <div className="col-span-2 lg:mr-3">
                            <label
                                htmlFor="billingAddress"
                                className="font-bold"
                            >
                                Billing Address
                            </label>
                            <textarea
                                name="billing"
                                id="billing"
                                cols="20"
                                rows="3"
                                className="block rounded xs:w-full"
                                value={billingAddress}
                                onChange={handleBillingAddressChange}
                                disabled={balance === 0.0 ? true : false}
                            ></textarea>
                        </div>

                        <div className="col-span-1">
                            <label htmlFor="invoiceDate" className="font-bold">
                                Invoice Date
                            </label>
                            <input
                                type="date"
                                className="block rounded border"
                                value={invoiceDate}
                                onChange={handleInvoiceDateChange}
                                disabled={balance === 0.0 ? true : false}
                            />
                        </div>

                        <div className="col-span-1">
                            <label htmlFor="dueDate" className="font-bold">
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="block rounded border xs:w-full"
                                value={dueDate}
                                onChange={handleDueDateChange}
                                disabled={balance === 0.0 ? true : false}
                            />
                        </div>

                        {/* empty col */}
                        <div className="col-span-2"></div>
                    </div>

                    {/* table starts */}
                    <div className="table w-full mt-5 p-4">
                        <table className="table-auto border-collapse w-full p-4">
                            <thead>
                                <tr>
                                    <th className="p-3 font-bold uppercase border-r-2 lg:table-cell">
                                        #
                                    </th>
                                    <th className="p-3 font-bold uppercase border-r-2 lg:table-cell">
                                        PRODUCT/SERVICE
                                    </th>
                                    <th className="p-3 font-bold uppercase border-r-2 lg:table-cell">
                                        DESCRIPTION
                                    </th>
                                    <th className="p-3 font-bold uppercase border-r-2 lg:table-cell">
                                        QTY
                                    </th>
                                    <th className="p-3 font-bold uppercase border-r-2 lg:table-cell">
                                        RATE
                                    </th>
                                    <th className="p-3 font-bold uppercase border-r-2 lg:table-cell">
                                        AMOUNT
                                    </th>
                                    <th className="p-3 font-bold uppercase lg:table-cell"></th>
                                </tr>
                            </thead>
                            <tbody>{showItems(cartItems)}</tbody>
                        </table>
                    </div>
                    {/* table ends */}
                    {/* amount description table starts */}
                    <table className="float-right font-bold text-xl w-96 text-right">
                        <tbody>
                            <tr>
                                <td>Total</td>
                                <td>${totalAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Amount Received</td>
                                <td>
                                    $
                                    {balance === 0.0
                                        ? totalAmount.toFixed(2)
                                        : 0.0}
                                </td>
                            </tr>
                            <tr>
                                <td>Balance due</td>
                                <td>${balance.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    {/* amount description table ends */}
                </div>
            </form>

            {/* sticky footer */}

            {balance === 0.0 ? (
                <div className="bg-gray-800 text-white fixed left-0 bottom-0 justify-between px-2  h-16 w-full">
                    <Link
                        to={PORTAL_INVOICES_ROUTE}
                        className="roundedPillBtn bg-green-700 rounded-pill float-right hover:bg-green-500"
                        onClick={handleSaveAndClose}
                    >
                        Close
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-800 text-white fixed left-0 bottom-0 justify-between px-2  h-16 w-full flex flex-row">
                    <div id="footer-left" className="flex flex-row mb-2">
                        <button
                            type="button"
                            className="roundedPillBorderedBtn bg-transparent rounded-pill mr-2 hover:bg-white hover:text-black"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="roundedPillBorderedBtn bg-transparent rounded-pill hover:bg-white hover:text-black"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>

                    <div id="footer-right" className="flex flex-row mb-2">
                        <button
                            type="button"
                            className="xs:hidden md:inline roundedPillBorderedBtn bg-transparent rounded-pill mr-2 hover:bg-white hover:text-black"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="roundedPillBtn bg-green-700 rounded-pill hover:bg-green-500"
                            onClick={handleSaveAndClose}
                        >
                            Save and close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    function showItems(cartItems) {
        let rows = [];

        if (cartItems !== undefined) {
            for (let i = 0; i < cartItems.length; i++) {
                rows.push(
                    <tr
                        className="text-center hover:bg-gray-100"
                        key={cartItems.id}
                    >
                        <td className="border-r-2 border-t-2">{i + 1}</td>
                        <td className="border-r-2 border-t-2">
                            <input
                                list="cartItemNames"
                                className="inline p-2 border border-black xs:w-full"
                                placeholder="Select an item"
                                value={cartItems[i].itemName}
                                disabled={balance === 0.0 ? true : false}
                            />
                            <datalist id="cartItemNames">
                                {/* TODO: fetch this list of cart items */}
                                <option value="Edge" />
                                <option value="Firefox" />
                                <option value="Chrome" />
                                <option value="Opera" />
                                <option value="Safari" />
                            </datalist>
                        </td>
                        <td className="border-r-2 border-t-2">
                            <input
                                type="text"
                                className="block xs:w-full"
                                value={cartItems[i].itemDescription}
                                disabled={balance === 0.0 ? true : false}
                            />
                        </td>
                        <td className="border-r-2 border-t-2">
                            <input
                                type="text"
                                className="block xs:w-full"
                                value={cartItems[i].quantity}
                                disabled={balance === 0.0 ? true : false}
                            />
                        </td>
                        <td className="border-r-2 border-t-2">
                            <input
                                type="text"
                                className="block xs:w-full"
                                value={cartItems[i].rate}
                                disabled={balance === 0.0 ? true : false}
                            />
                        </td>
                        <td className="border-r-2 border-t-2">
                            {cartItems[i].itemAmount}
                        </td>
                        <td className="border-t-2">
                            <button disabled={balance === 0.0 ? true : false}>
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    color="#696969"
                                />
                            </button>
                        </td>
                    </tr>
                );
            }
        }
        return rows;
    }
}

export default InvoiceDetail;
