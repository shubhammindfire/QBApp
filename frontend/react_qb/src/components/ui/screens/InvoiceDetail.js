import {
    faHistory,
    faPlusCircle,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
    PORTAL_INVOICES_ROUTE,
    GET_INVOICE_BY_ID,
    GET_ALL_CUSTOMERS,
    GET_ALL_ITEMS,
    BASE_REACT_ROUTE,
} from "../../../Constants.js";
import {
    addCurrentCartItems,
    addCurrentInvoice,
    removeCurrentInvoice,
    removeCurrentCartItems,
    deleteCurrentCartItemByIndex,
} from "../../../redux/quickbooks/invoice/invoiceActions.js";
import addNewInvoice from "../../utils/addNewInvoice.js";
import getQBOCustomerId from "../../utils/getQBOCustomerId.js";
import {
    validateCustomerName,
    validateDueDate,
    validateInvoiceDate,
    validateEmptyCartItem,
    validateInvalidCartItem,
    validateCartItemQuantity,
} from "../../utils/validateData.js";
import ErrorModal from "../widgets/ErrorModal.js";
import SuccessModal from "../widgets/SuccessModal.js";
import CartItemInInvoiceTable from "./../widgets/CartItemInInvoiceTable.js";

function InvoiceDetail(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    // const reduxInvoice = useSelector(
    //     (state) => state.invoiceReducer.currentInvoice
    // );
    // const reduxState.currentCartItems = useSelector(
    //     (state) => state.invoice.currentCartItems
    // );

    // const reduxState.currentCartItems = useSelector(
    //     (state) => state.invoice
    // );
    const reduxState = useSelector((state) => ({
        currentCartItems: state.invoiceReducer.currentCartItems,
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
    // this is an array of json objects of cartItems
    const [stateCartItems, setStateCartItems] = useState([]);
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

    const [customerNameError, setCustomerNameError] = useState(null);
    const [invoiceDateError, setInvoiceDateError] = useState(null);
    const [dueDateError, setDueDateError] = useState(null);
    const [totalAmountError, setTotalAmountError] = useState(null);
    const [cartItemsError, setCartItemsError] = useState(null);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successModalType, setSuccessModalType] = useState("Save");
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
                    dispatch(addCurrentCartItems(response.data.cartItems));
                    setStateCartItems(response.data.cartItems);

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
                        // j = items.length; //this is to end the loop like break
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
        } else if (validateInvoiceDate(invoiceDate) === false) {
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
            validateEmptyCartItem(reduxState.currentCartItems) === false
        ) {
            setCartItemsError("Please fill item name for every item added");
            return false;
        } else if (
            validateInvalidCartItem(reduxState.currentCartItems, items) ===
            false
        ) {
            setCartItemsError("Please select item name from the list provided");
            return false;
        } else if (
            validateCartItemQuantity(reduxState.currentCartItems) === false
        ) {
            setCartItemsError("Please fill quantity for every item added");
            return false;
        } else {
            return true;
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        setCartItemsError(null);
        if (validateAll() === true) {
            const isSuccess = await addNewInvoice(
                jwt,
                invoiceDate,
                dueDate,
                getQBOCustomerId(customers, customerName),
                totalAmount,
                balance,
                reduxState.currentCartItems
            );
            if (isSuccess) {
                setSuccessModalType("Save");
                setShowSuccessModal(true);
            } else setShowErrorModal(true);
        }
    }

    async function handleSaveAndClose(e) {
        e.preventDefault();
        setCartItemsError(null);
        if (validateAll() === true) {
            const isSuccess = await addNewInvoice(
                jwt,
                invoiceDate,
                dueDate,
                getQBOCustomerId(customers, customerName),
                totalAmount,
                balance,
                reduxState.currentCartItems
            );
            if (isSuccess) {
                setSuccessModalType("Save&Close");
                setShowSuccessModal(true);
                setTimeout(function () {
                    // using history to move to PORTAL_INVOICES_ROUTE without page refresh
                    history.push(PORTAL_INVOICES_ROUTE);
                }, 2000);
            } else setShowErrorModal(true);
        }
    }

    function handleAddItem(e) {
        e.preventDefault();
        reduxState.currentCartItems.push({
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
        setStateCartItems(reduxState.currentCartItems);
        console.log(
            `state cart items in handleAddItem() = ${JSON.stringify(
                stateCartItems
            )}`
        );
        dispatch(addCurrentCartItems(reduxState.currentCartItems));
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
                        Invoice{" "}
                        {operation !== "Create"
                            ? `#${stateInvoice.invoiceNumber}`
                            : null}
                    </p>
                </div>
                <Link to={PORTAL_INVOICES_ROUTE}>
                    <FontAwesomeIcon icon={faTimes} color="#696969" size="2x" />
                </Link>
            </div>

            {showSuccessModal ? (
                <SuccessModal
                    setShowSuccessModal={setShowSuccessModal}
                    type={successModalType}
                />
            ) : showErrorModal ? (
                <ErrorModal />
            ) : null}
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
                                    onChange={(e) =>
                                        handleChange(e, "customerName")
                                    }
                                    disabled={
                                        operation === "View" ? true : false
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
                                <p className="font-bold text-4xl">PAID</p>
                            </div>
                        ) : (
                            <div className="col-span-2 text-right">
                                <span className="text-gray-500 font-bold">
                                    BALANCE DUE
                                </span>
                                <p className="font-bold text-4xl">
                                    ${balance.toFixed(2)}
                                </p>
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
                            <label htmlFor="invoiceDate" className="font-bold">
                                Invoice Date
                            </label>
                            <input
                                type="date"
                                className="block rounded border"
                                value={invoiceDate}
                                onChange={(e) => handleChange(e, "invoiceDate")}
                                disabled={operation === "View" ? true : false}
                            />
                            <p className="text-red-600">{invoiceDateError}</p>
                        </div>

                        <div className="col-span-1">
                            <label htmlFor="dueDate" className="font-bold">
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="block rounded border xs:w-full"
                                value={dueDate}
                                onChange={(e) => handleChange(e, "dueDate")}
                                disabled={operation === "View" ? true : false}
                            />
                            <p className="text-red-600">{dueDateError}</p>
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
                                    stateCartItems,
                                    reduxState.currentCartItems
                                )}
                            </tbody>
                        </table>
                        <p className="text-red-600">{cartItemsError}</p>
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

            {operation === "View" ? (
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
                        <Link
                            to={PORTAL_INVOICES_ROUTE}
                            className="roundedPillBorderedBtn bg-transparent rounded-pill mr-2 hover:bg-white hover:text-black"
                        >
                            Cancel
                        </Link>
                    </div>

                    <div id="footer-right" className="flex flex-row mb-2">
                        <button
                            type="button"
                            className="xs:hidden md:inline roundedPillBorderedBtn bg-transparent rounded-pill mr-2 hover:bg-white hover:text-black"
                            onClick={(e) => handleSave(e)}
                        >
                            Save
                        </button>
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
    );

    function showItems(stateCartItems, reduxCartItems) {
        let rows = [];

        // type can be "View", "Edit" or "Create"
        function updateStateCartItems(type, newCartItem, index) {
            console.log("called updateStateCartItems on callback");
            // stateCartItems[index] = newCartItem;
            // setStateCartItems(stateCartItems);
            // dispatch(addCurrentCartItems(stateCartItems));

            // cartItems[index] = newCartItem;
            // dispatch(addCurrentCartItems(cartItems));

            reduxCartItems[index] = newCartItem;
            updateAmount(reduxCartItems);
            setStateCartItems(reduxCartItems);
            dispatch(addCurrentCartItems(reduxCartItems));
        }

        function deleteStateCartItem(index) {
            console.log("called deleteStateCartItem on callback");

            let tempCartItems = [
                ...stateCartItems.slice(0, index),
                ...stateCartItems.slice(index + 1),
            ];
            setStateCartItems([
                ...stateCartItems.slice(0, index),
                ...stateCartItems.slice(index + 1),
            ]);
            updateAmount(tempCartItems);
            dispatch(deleteCurrentCartItemByIndex(index));
        }

        // this function calculates and updates the amount and balance
        function updateAmount(reduxCartItems) {
            let total = 0.0;
            reduxCartItems.forEach((reduxCartItem) => {
                total += reduxCartItem.itemAmount;
            });
            setTotalAmountError(null);
            setTotalAmount(total);
            if (operation === "Create") setBalance(total);
        }

        if (stateCartItems !== undefined) {
            console.log(
                `state cart items in showItems() = ${JSON.stringify(
                    stateCartItems
                )}`
            );
            for (let i = 0; i < stateCartItems.length; i++) {
                rows.push(
                    <CartItemInInvoiceTable
                        cartItem={stateCartItems[i]}
                        items={items}
                        operation={operation}
                        index={i}
                        updateItemsCallback={updateStateCartItems}
                        deleteItemCallback={deleteStateCartItem}
                        key={stateCartItems[i].id}
                    />
                    // <tr
                    //     className="text-center hover:bg-gray-100"
                    //     key={cartItems[0].id}
                    // >
                    //     <td className="border-r-2 border-t-2">{i + 1}</td>
                    //     <td className="border-r-2 border-t-2">
                    //         <input
                    //             list="cartItemNames"
                    //             className="inline p-2 border border-black xs:w-full"
                    //             placeholder="Select an item"
                    //             // value={cartItems[i].itemName}
                    //             value=""
                    //             // value={itemName}
                    //             disabled={operation === "View" ? true : false}
                    //             onChange={(e) => handleChange(e, "itemName")}
                    //         />
                    //         <datalist id="cartItemNames">
                    //             {getItemNameList()}
                    //         </datalist>
                    //     </td>
                    //     <td className="border-r-2 border-t-2">
                    //         <input
                    //             type="text"
                    //             className="block xs:w-full"
                    //             value={cartItems[i].itemDescription}
                    //             disabled={operation === "View" ? true : false}
                    //         />
                    //     </td>
                    //     <td className="border-r-2 border-t-2">
                    //         <input
                    //             type="text"
                    //             className="block xs:w-full"
                    //             value={cartItems[i].quantity}
                    //             disabled={operation === "View" ? true : false}
                    //         />
                    //     </td>
                    //     <td className="border-r-2 border-t-2">
                    //         <input
                    //             type="text"
                    //             className="block xs:w-full"
                    //             value={cartItems[i].rate}
                    //             disabled={operation === "View" ? true : false}
                    //         />
                    //     </td>
                    //     <td className="border-r-2 border-t-2">
                    //         {cartItems[i].itemAmount}
                    //     </td>
                    //     <td className="border-t-2">
                    //         <button disabled={operation === "View" ? true : false}>
                    //             <FontAwesomeIcon
                    //                 icon={faTrashAlt}
                    //                 color="#696969"
                    //             />
                    //         </button>
                    //     </td>
                    // </tr>
                );
            }
        }
        return rows;
    }
}

export default InvoiceDetail;
