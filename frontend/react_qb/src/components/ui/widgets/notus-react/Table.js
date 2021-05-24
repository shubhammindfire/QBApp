import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

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
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3
                                className={
                                    "font-semibold text-lg " +
                                    (color === "light"
                                        ? "text-blueGray-700"
                                        : "text-white")
                                }
                            >
                                {title}
                            </h3>
                        </div>
                    </div>
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
                                ></th>
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
                <tr className="text-md">
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
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-right"></td>
                </tr>
            );
        }
    }

    return rows;
}

export default Table;
