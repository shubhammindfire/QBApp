import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faExclamationCircle,
    faEye,
    faPen,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Link } from "react-router-dom";
import { PORTAL_INVOICE_DETAIL_ROUTE } from "../../../../Constants";

function Table(props) {
    const { color = "light", title, invoices } = props;

    return (
        <>
            <div
                className={
                    "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
                    (color === "light"
                        ? "bg-white"
                        : "bg-lightBlue-900 text-white")
                }
            >
                <div className="relative w-full p-5 max-w-full flex justify-between">
                    <h3
                        className={
                            "font-semibold text-xl " +
                            (color === "light"
                                ? "text-blueGray-700"
                                : "text-white")
                        }
                    >
                        {title}
                    </h3>
                    <Link
                        to={{
                            pathname: PORTAL_INVOICE_DETAIL_ROUTE,
                            state: {
                                operation: "Create",
                            },
                        }}
                        className="rounded-full bg-green-600 text-white px-4 py-2"
                    >
                        Create Invoice
                    </Link>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Date
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    No.
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Customer
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Amount
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Status
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>{row("light", invoices)}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function row(color = "light", invoices) {
    const rows = [];

    if (invoices !== undefined) {
        for (let i = 0; i < invoices.length; i++) {
            let isOverdue = false;
            const dueDateString = invoices[i].dueDate;
            const dueDateEpoch = new Date(dueDateString).getTime();
            const currentDateEpoch = new Date().getTime();

            const epochDiff = currentDateEpoch - dueDateEpoch;

            let diffInDays = Math.floor(
                Math.abs(epochDiff) / 1000 / 60 / 60 / 24
            );

            if (invoices[i].balance !== 0.0) {
                // if epochDiff is +ve then overdue else not overdue
                if (epochDiff > 0) {
                    isOverdue = true;
                } else {
                    isOverdue = false;
                }
            }

            rows.push(
                <tr className="text-md" key={invoices[i].invoiceNumber}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center">
                        {/* splitting the data received to get the desired format */}
                        {invoices[i].invoiceDate.split("T")[0]}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        {invoices[i].invoiceNumber}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        {invoices[i].customerName}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        ${invoices[i].amount}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        {invoices[i].balance === 0.0 ? null : isOverdue ? (
                            <FontAwesomeIcon
                                icon={faExclamationCircle}
                                color="#FFA500"
                                className="mr-2"
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                color="#228B22"
                                className="mr-2"
                            />
                        )}

                        {invoices[i].balance === 0.0
                            ? "Deposited"
                            : isOverdue
                            ? `Overdue ${diffInDays} days`
                            : `Due in ${diffInDays} days`}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        {invoices[i].balance === 0.0 ? (
                            <Link
                                to={{
                                    pathname: PORTAL_INVOICE_DETAIL_ROUTE,
                                    state: {
                                        invoiceTableId: invoices[i].id,
                                        operation: "View",
                                    },
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faEye}
                                    color="#32A6E9"
                                    className="mr-2"
                                />
                                View
                            </Link>
                        ) : (
                            // TODO: pending finish work for editing an invoice
                            <Link
                                to={{
                                    pathname: PORTAL_INVOICE_DETAIL_ROUTE,
                                    state: {
                                        invoiceTableId: invoices[i].id,
                                        operation: "Edit",
                                    },
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faPen}
                                    color="#32A6E9"
                                    className="mr-2"
                                />
                                Edit
                            </Link>
                        )}
                    </td>
                </tr>
            );
        }
    }

    return rows;
}

export default Table;
