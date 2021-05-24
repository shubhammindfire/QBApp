import {
    faHistory,
    faTimes,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PORTAL_INVOICES_ROUTE } from "../../../Constants";

function InvoiceDetail(props) {
    const [invoiceTableId, setInvoice] = useState(
        props.location.state !== undefined
            ? props.location.state.invoiceTableId
            : null
    );

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
                        {/* Invoice #{invoice.invoiceNumber} */}
                    </p>
                </div>
                <Link to={PORTAL_INVOICES_ROUTE}>
                    <FontAwesomeIcon icon={faTimes} color="#696969" size="2x" />
                </Link>
            </div>

            <form>
                {/* grid wrapper*/}
                <div className="px-5">
                    {/* row 1 */}
                    <div className="grid xs:grid-cols-1 lg:grid-cols-8">
                        <div className="col-span-2 lg:mr-3">
                            <label for="customer" className="font-bold">
                                Customer
                            </label>
                            <input
                                type="text"
                                className="block rounded xs:w-full"
                                placeholder="Select a customer"
                            />
                        </div>

                        <div className="col-span-2">
                            <label for="customerEmail" className="font-bold">
                                Customer email
                            </label>
                            <input
                                type="text"
                                className="block rounded xs:w-full"
                                placeholder="Enter customer email"
                            />
                        </div>

                        {/* Empty col */}
                        <div className="col-span-2"></div>

                        <div className="col-span-2 text-right">
                            <span className="text-gray-500 font-bold">
                                BALANCE DUE
                            </span>
                            <p className="font-bold text-4xl">
                                {/* ${invoice.balance} */}
                            </p>
                        </div>
                    </div>

                    {/* row 2 */}
                    <div className="grid xs:mt-8 lg:mt-16 xs:grid-cols-1 lg:grid-cols-8">
                        <div className="col-span-2 lg:mr-3">
                            <label for="billingAddress" className="font-bold">
                                Billing Address
                            </label>
                            <textarea
                                name="billing"
                                id="billing"
                                cols="20"
                                rows="3"
                                className="block rounded xs:w-full"
                            ></textarea>
                        </div>

                        <div className="col-span-1">
                            <label for="invoiceDate" className="font-bold">
                                Invoice Date
                            </label>
                            <input
                                type="date"
                                className="block rounded border"
                            />
                        </div>

                        <div className="col-span-1">
                            <label for="dueDate" className="font-bold">
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="block rounded border xs:w-full"
                            />
                        </div>

                        {/* empty col */}
                        <div className="col-span-2"></div>
                    </div>

                    {/* table starts */}
                    <div className="table w-full mt-5 p-4">
                        <table className="table-auto border-collapse w-full p-4">
                            <thead>
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
                            </thead>
                            <tbody className="overflow-x-scroll">
                                <tr className="text-center hover:bg-gray-100">
                                    <td className="border-r-2 border-t-2">1</td>
                                    <td className="border-r-2 border-t-2">
                                        test product
                                    </td>
                                    <td className="border-r-2 border-t-2">
                                        test desc
                                    </td>
                                    <td className="border-r-2 border-t-2">
                                        22
                                    </td>
                                    <td className="border-r-2 border-t-2">
                                        29.88
                                    </td>
                                    <td className="border-r-2 border-t-2">
                                        26
                                    </td>
                                    <td className="border-t-2">
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            color="#696969"
                                        />
                                    </td>
                                </tr>
                                {/* {showItems(invoice.cartItems)} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>

            {/* sticky footer */}
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
        </div>
    );

    function showItems(cartItems) {
        const rows = [];

        if (cartItems !== undefined) {
            for (let i = 0; i < cartItems.length; i++) {
                rows.push(
                    <tr className="text-center hover:bg-gray-100">
                        <td className="border-r-2 border-t-2">{i + 1}</td>
                        <td className="border-r-2 border-t-2">
                            {cartItems[i].itemName}
                        </td>
                        <td className="border-r-2 border-t-2">
                            {cartItems[i].itemDescription}
                        </td>
                        <td className="border-r-2 border-t-2">22</td>
                        <td className="border-r-2 border-t-2">29.88</td>
                        <td className="border-r-2 border-t-2">26</td>
                        <td className="border-t-2">
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                color="#696969"
                            />
                        </td>
                    </tr>
                );
            }
        }
    }
}

export default InvoiceDetail;
