import {
    faHistory,
    faPlusCircle,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import {
    PORTAL_INVOICES_ROUTE,
    GET_INVOICE_BY_ID,
    GET_ALL_CUSTOMERS,
    GET_ALL_ITEMS,
    BASE_REACT_ROUTE,
    LOGIN_ROUTE,
} from "../../../Constants.js";
import {
    addCurrentInvoiceItems,
    addCurrentInvoice,
    removeCurrentInvoice,
    removeCurrentInvoiceItems,
    deleteCurrentInvoiceItemByIndex,
} from "../../../redux/quickbooks/invoice/invoiceActions.js";
import addNewInvoice from "../../utils/addNewInvoice.js";
import getQBOCustomerId from "../../utils/getQBOCustomerId.js";
import {
    validateCustomerName,
    validateDueDate,
    validateInvoiceDate,
    validateEmptyInvoiceItem,
    validateInvalidInvoiceItem,
    validateInvoiceItemQuantity,
} from "../../utils/validateData.js";
import ErrorModal from "../widgets/ErrorModal.js";
import SuccessModal from "../widgets/SuccessModal.js";
import LoadingModal from "../widgets/LoadingModal.js";
import InvoiceItemInInvoiceTable from "../widgets/InvoiceItemInInvoiceTable.js";
import editInvoice from "../../utils/editInvoice.js";

function InvoiceDetail(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const reduxState = useSelector((state) => ({
        currentInvoiceItems: state.invoiceReducer.currentInvoiceItems,
        currentInvoice: state.invoiceReducer.currentInvoice,
    }));

    const jwt = useSelector((state) => state.localAuthReducer.jwt);

    const invoiceTableId =
        props.location.state !== undefined
            ? props.location.state.invoiceTableId
            : null;

    const operation =
        props.location.state !== undefined
            ? props.location.state.operation
            : "View";

    // this is a json object of invoice
    const [stateInvoice, setStateInvoice] = useState({});
    // this is an array of json objects of invoiceItems
    const [stateInvoiceItems, setStateInvoiceItems] = useState([]);
    // this is an array of json objects of customers
    const [customers, setCustomers] = useState([]);
    // this is an array of json objects of items
    const [items, setItems] = useState([]);

    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [balance, setBalance] = useState(0.0);
    const [billingAddress, setBillingAddress] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [totalAmount, setTotalAmount] = useState(0.0);
    const [amountReceived, setAmountReceived] = useState(0.0);

    const [customerNameError, setCustomerNameError] = useState(null);
    const [invoiceDateError, setInvoiceDateError] = useState(null);
    const [dueDateError, setDueDateError] = useState(null);
    const [totalAmountError, setTotalAmountError] = useState(null);
    const [invoiceItemsError, setInvoiceItemsError] = useState(null);

    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    let customerNameListAsString = [];

    useEffect(() => {
        // if the operation is create then the invoice won't be available
        // therefore no need for GET_INVOICE_BY_ID api call
        if (operation !== "Create") {
            axios
                .get(GET_INVOICE_BY_ID + `/${invoiceTableId}`, {
                    headers: { Authorization: `Bearer ${jwt}` },
                })
                .then((response) => {
                    dispatch(addCurrentInvoice(response.data.invoice));
                    setStateInvoice(response.data.invoice);
                    dispatch(
                        addCurrentInvoiceItems(response.data.invoiceItems)
                    );
                    setStateInvoiceItems(response.data.invoiceItems);

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
                })
                .catch((error) => {
                    // TODO: pending write catch for this api call
                });
        }

        axios
            .get(GET_ALL_CUSTOMERS, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                setCustomers(response.data);
            });

        axios
            .get(GET_ALL_ITEMS, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                setItems(response.data);
            });
    }, []);

    function handleChange(e, attribute) {
        e.preventDefault();
        let currentInvoice = reduxState.currentInvoice;

        if (attribute === "customerName") {
            setCustomerNameError(null);
            setCustomerName(e.target.value);
            currentInvoice.customerName = e.target.value;
            if (customerNameListAsString.includes(e.target.value)) {
                for (let j = 0; j < customers.length; j++) {
                    if (customers[j].displayName === e.target.value) {
                        setCustomerEmail(customers[j].email);
                        setBillingAddress(customers[j].billingAddress);
                        currentInvoice.customerEmail = customers[j].email;
                        currentInvoice.billingAddress =
                            customers[j].billingAddress;
                        break;
                    }
                }
            }
        } else if (attribute === "customerEmail") {
            setCustomerEmail(e.target.value);
            currentInvoice.customerEmail = e.target.value;
        } else if (attribute === "billingAddress") {
            setBillingAddress(e.target.value);
            currentInvoice.billingAddress = e.target.value;
        } else if (attribute === "invoiceDate") {
            setInvoiceDateError("");
            setInvoiceDate(e.target.value);
            currentInvoice.invoiceDate = e.target.value;
        } else if (attribute === "dueDate") {
            setDueDateError("");
            setDueDate(e.target.value);
            currentInvoice.dueDate = e.target.value;
        }

        setStateInvoice(currentInvoice);
        dispatch(addCurrentInvoice(currentInvoice));
    }

    function validateAll() {
        if (customerName === "") {
            setCustomerNameError("Please enter a customer name");
            return false;
        } else if (
            validateCustomerName(customerName, customerNameListAsString) ===
            false
        ) {
            setCustomerNameError(
                "Please select customer name from the list provided"
            );
            return false;
        } else if (invoiceDate === "") {
            setInvoiceDateError("Please enter an invoice date");
            return false;
        } else if (
            operation === "Create" &&
            validateInvoiceDate(invoiceDate) === false
        ) {
            setInvoiceDateError("Please select a proper invoice date");
            return false;
        } else if (dueDate === "") {
            setDueDateError("Please enter a due date");
            return false;
        } else if (validateDueDate(invoiceDate, dueDate) === false) {
            setDueDateError("Please select a proper due date");
            return false;
        } else if (totalAmount <= 0.0) {
            setTotalAmountError(
                "Please select items to increase total amount above zero"
            );
            return false;
        } else if (
            validateEmptyInvoiceItem(reduxState.currentInvoiceItems) === false
        ) {
            setInvoiceItemsError("Please fill item name for every item added");
            return false;
        } else if (
            validateInvalidInvoiceItem(
                reduxState.currentInvoiceItems,
                items
            ) === false
        ) {
            setInvoiceItemsError(
                "Please select item name from the list provided"
            );
            return false;
        } else if (
            validateInvoiceItemQuantity(reduxState.currentInvoiceItems) ===
            false
        ) {
            setInvoiceItemsError("Please fill quantity for every item added");
            return false;
        } else {
            return true;
        }
    }

    console.log("STATE INVOICES RESPONSE: " + JSON.stringify(stateInvoice));
    console.log("STATE INVOICES ID RESPONSE: " + stateInvoice.id);
    console.log(
        "INVOICES ITEMS RESPONSE: " +
            JSON.stringify(reduxState.currentInvoiceItems)
    );
    async function handleSaveAndClose(e) {
        e.preventDefault();
        setInvoiceItemsError(null);
        if (validateAll() === true) {
            let isSuccess = false;
            setShowLoadingModal(true);
            if (operation === "Create") {
                isSuccess = await addNewInvoice(
                    jwt,
                    invoiceDate,
                    dueDate,
                    getQBOCustomerId(customers, customerName),
                    totalAmount,
                    balance,
                    reduxState.currentInvoiceItems
                );
            } else if (operation === "Edit") {
                isSuccess = await editInvoice(
                    jwt,
                    stateInvoice.id,
                    invoiceDate,
                    dueDate,
                    getQBOCustomerId(customers, customerName),
                    totalAmount,
                    balance,
                    reduxState.currentInvoiceItems
                );
            }

            if (isSuccess) {
                setShowLoadingModal(false);
                setShowSuccessModal(true);
                setTimeout(function () {
                    // using history to move to PORTAL_INVOICES_ROUTE without page refresh
                    history.push(PORTAL_INVOICES_ROUTE);
                }, 2000);
            } else {
                setShowLoadingModal(false);
                setShowErrorModal(true);
            }
        }
    }

    function handleAddItem(e) {
        e.preventDefault();
        reduxState.currentInvoiceItems.push({
            id: null,
            itemTableId: null,
            quantity: null,
            rate: null,
            invoiceTableId: null,
            createdAt: null,
            updatedAt: null,
            userId: null,
            itemName: null,
            itemDescription: null,
            itemAmount: null,
        });
        setStateInvoiceItems(reduxState.currentInvoiceItems);
        console.log(
            `state invoice items in handleAddItem() = ${JSON.stringify(
                stateInvoiceItems
            )}`
        );
        dispatch(addCurrentInvoiceItems(reduxState.currentInvoiceItems));
    }

    function getCustomerNameList() {
        let customerNameList = [];

        if (customers !== undefined) {
            for (let i = 0; i < customers.length; i++) {
                customerNameList.push(
                    <option value={customers[i].displayName} />
                );
                customerNameListAsString.push(customers[i].displayName);
            }
        }
        return customerNameList;
    }

    return (
        <>
            {jwt === null ? (
                // if the user is not logged in then redirect to login
                <Redirect to={LOGIN_ROUTE} />
            ) : (
                <div className="bg-blueGray-100">
                    {/* top heading */}
                    <div className="flex justify-between p-3">
                        <div>
                            <FontAwesomeIcon
                                icon={faHistory}
                                color="#696969"
                                size="2x"
                            />
                            <p className="inline font-bold ml-2 text-gray-800 text-3xl">
                                Invoice{" "}
                                {operation !== "Create"
                                    ? `#${stateInvoice.invoiceNumber}`
                                    : null}
                            </p>
                        </div>
                        <Link to={PORTAL_INVOICES_ROUTE}>
                            <FontAwesomeIcon
                                icon={faTimes}
                                color="#696969"
                                size="2x"
                            />
                        </Link>
                    </div>

                    {showLoadingModal ? <LoadingModal /> : null}
                    {showSuccessModal ? (
                        <SuccessModal
                            setShowSuccessModal={setShowSuccessModal}
                            type="SaveAndClose"
                            message="Invoice created Successfully"
                        />
                    ) : showErrorModal ? (
                        <ErrorModal
                            setShowErrorModal={setShowErrorModal}
                            type="CREATE_OR_EDIT_INVOICE_ERROR"
                            message="An error occured, please check the data filled. This might be due to invalid invoice date or due date OR invoice date and due date may be given before the start date of one or all of the items listed."
                        />
                    ) : null}
                    {/* the margin below is used because the footer hides the data at the bottom */}
                    <form className="mb-64">
                        {/* grid wrapper*/}
                        <div className="px-5">
                            {/* row 1 */}
                            <div className="grid xs:grid-cols-1 lg:grid-cols-8">
                                <div className="col-span-2 lg:mr-3">
                                    <label
                                        htmlFor="customer"
                                        className="font-bold"
                                    >
                                        Customer
                                    </label>
                                    <div>
                                        <input
                                            list="customerNames"
                                            className="inline rounded p-2 border border-black xs:w-full"
                                            placeholder="Select a customer"
                                            value={customerName}
                                            onChange={(e) =>
                                                handleChange(e, "customerName")
                                            }
                                            disabled={
                                                operation === "View"
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <datalist id="customerNames">
                                            {getCustomerNameList()}
                                        </datalist>
                                        <p className="text-red-600">
                                            {customerNameError}
                                        </p>
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
                                        // disabled={operation === "View" ? true : false}
                                        disabled
                                    />
                                </div>
                                {/* Empty col */}
                                <div className="col-span-2"></div>
                                {/* if balance is zero then show that payment status is "paid", else show the balance due amount */}
                                {operation === "View" ? (
                                    <div className="col-span-2 text-right">
                                        <span className="text-gray-500 font-bold">
                                            PAYMENT STATUS
                                        </span>
                                        <p className="font-bold text-4xl">
                                            PAID
                                        </p>
                                    </div>
                                ) : (
                                    <div className="col-span-2 text-right">
                                        <span className="text-gray-500 font-bold">
                                            BALANCE DUE
                                        </span>
                                        <p className="font-bold text-4xl">
                                            ${balance.toFixed(2)}
                                        </p>
                                        {operation === "Edit" ? (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setAmountReceived(
                                                        totalAmount
                                                    );
                                                    setBalance(0);
                                                }}
                                                className="roundedPillDarkBorderedBtn mt-2 text-sm bg-transparent right-0 hover:bg-white"
                                            >
                                                Receive total payment
                                            </button>
                                        ) : null}
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
                                        onChange={(e) =>
                                            handleChange(e, "billingAddress")
                                        }
                                        // disabled={operation === "View" ? true : false}
                                        disabled
                                    ></textarea>
                                </div>

                                <div className="col-span-1">
                                    <label
                                        htmlFor="invoiceDate"
                                        className="font-bold"
                                    >
                                        Invoice Date
                                    </label>
                                    <input
                                        type="date"
                                        className="block rounded border"
                                        value={invoiceDate}
                                        onChange={(e) =>
                                            handleChange(e, "invoiceDate")
                                        }
                                        disabled={
                                            operation === "View" ? true : false
                                        }
                                    />
                                    <p className="text-red-600">
                                        {invoiceDateError}
                                    </p>
                                </div>

                                <div className="col-span-1">
                                    <label
                                        htmlFor="dueDate"
                                        className="font-bold"
                                    >
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        className="block rounded border xs:w-full"
                                        value={dueDate}
                                        onChange={(e) =>
                                            handleChange(e, "dueDate")
                                        }
                                        disabled={
                                            operation === "View" ? true : false
                                        }
                                    />
                                    <p className="text-red-600">
                                        {dueDateError}
                                    </p>
                                </div>

                                {/* empty col */}
                                <div className="col-span-2"></div>
                            </div>
                            <p className="text-red-600">{totalAmountError}</p>
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
                                    <tbody>
                                        {showItems(
                                            stateInvoiceItems,
                                            reduxState.currentInvoiceItems
                                        )}
                                    </tbody>
                                </table>
                                <p className="text-red-600">
                                    {invoiceItemsError}
                                </p>
                                {operation === "View" ? null : (
                                    <button
                                        title="Add an item"
                                        onClick={(e) => handleAddItem(e)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlusCircle}
                                            color="#228B22"
                                            size="2x"
                                        />
                                    </button>
                                )}
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
                                            {operation === "View"
                                                ? totalAmount.toFixed(2)
                                                : amountReceived.toFixed(2)}
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

                    {operation === "View" ? (
                        <div className="bg-gray-800 text-white fixed left-0 bottom-0 justify-between px-2  h-16 w-full">
                            <Link
                                to={PORTAL_INVOICES_ROUTE}
                                className="roundedPillBtn bg-green-700 rounded-pill float-right hover:bg-green-500"
                            >
                                Close
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-gray-800 text-white fixed left-0 bottom-0 justify-between px-2  h-16 w-full flex flex-row">
                            <div
                                id="footer-left"
                                className="flex flex-row mb-2"
                            >
                                <Link
                                    to={PORTAL_INVOICES_ROUTE}
                                    className="roundedPillBorderedBtn bg-transparent rounded-pill mr-2 hover:bg-white hover:text-black"
                                >
                                    Cancel
                                </Link>
                            </div>

                            <div
                                id="footer-right"
                                className="flex flex-row mb-2"
                            >
                                <Link
                                    to={PORTAL_INVOICES_ROUTE}
                                    className="roundedPillBtn bg-green-700 rounded-pill hover:bg-green-500"
                                    onClick={(e) => handleSaveAndClose(e)}
                                >
                                    Save and Close
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    function showItems(stateInvoiceItems, reduxInvoiceItems) {
        let rows = [];

        // type can be "View", "Edit" or "Create"
        function updateStateInvoiceItems(type, newInvoiceItem, index) {
            console.log("called updateStateInvoiceItems on callback");

            reduxInvoiceItems[index] = newInvoiceItem;
            updateAmount(reduxInvoiceItems);
            setStateInvoiceItems(reduxInvoiceItems);
            dispatch(addCurrentInvoiceItems(reduxInvoiceItems));
        }

        function deleteStateInvoiceItem(index) {
            console.log("called deleteStateInvoiceItem on callback");

            let tempInvoiceItems = [
                ...stateInvoiceItems.slice(0, index),
                ...stateInvoiceItems.slice(index + 1),
            ];
            setStateInvoiceItems([
                ...stateInvoiceItems.slice(0, index),
                ...stateInvoiceItems.slice(index + 1),
            ]);
            updateAmount(tempInvoiceItems);
            dispatch(deleteCurrentInvoiceItemByIndex(index));
        }

        // this function calculates and updates the amount and balance
        function updateAmount(reduxInvoiceItems) {
            let total = 0.0;
            reduxInvoiceItems.forEach((reduxInvoiceItem) => {
                total += reduxInvoiceItem.itemAmount;
            });
            setTotalAmountError(null);
            setTotalAmount(total);
            setBalance(total);
            if (operation === "Create") setBalance(total);
        }

        if (stateInvoiceItems !== undefined) {
            console.log(
                `state invoice items in showItems() = ${JSON.stringify(
                    stateInvoiceItems
                )}`
            );
            for (let i = 0; i < stateInvoiceItems.length; i++) {
                rows.push(
                    <InvoiceItemInInvoiceTable
                        invoiceItem={stateInvoiceItems[i]}
                        items={items}
                        operation={operation}
                        index={i}
                        updateItemsCallback={updateStateInvoiceItems}
                        deleteItemCallback={deleteStateInvoiceItem}
                        key={stateInvoiceItems[i].id}
                    />
                );
            }
        }
        return rows;
    }
}

export default InvoiceDetail;
