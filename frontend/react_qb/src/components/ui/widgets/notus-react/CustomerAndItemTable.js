import React from "react";

function CustomerAndItemTable(props) {
    const { color = "light", title, data } = props;

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
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* table starts */}
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
                                    {title === "Customers"
                                        ? "Display Name"
                                        : "Name"}
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    {title === "Customers"
                                        ? "Company Name"
                                        : "Type"}
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    {title === "Customers"
                                        ? "Email"
                                        : "Description"}
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    {title === "Customers"
                                        ? "Billing Address"
                                        : "Sales Price"}
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    {title === "Customers"
                                        ? "Phone Number"
                                        : "Cost Price"}
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    {title === "Customers"
                                        ? "Open Balance"
                                        : "Quantity"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>{row("light", data, title)}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function row(color = "light", data, title) {
    const rows = [];

    if (data !== undefined) {
        for (let i = 0; i < data.length; i++) {
            rows.push(
                <tr className="text-md" key={data[i].id}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left flex items-center">
                        {title === "Customers"
                            ? data[i].displayName
                            : data[i].name}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        {title === "Customers"
                            ? data[i].companyName !== "null"
                                ? data[i].companyName
                                : "-"
                            : data[i].type}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        {title === "Customers"
                            ? data[i].email !== "null"
                                ? data[i].email
                                : "-"
                            : data[i].description !== "null"
                            ? data[i].description
                            : "-"}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        {title === "Customers"
                            ? data[i].billingAddress !== "null"
                                ? data[i].billingAddress
                                : "-"
                            : `$ ${data[i].salesPrice.toFixed(2)}`}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        {title === "Customers"
                            ? data[i].phoneNumber !== "null"
                                ? data[i].phoneNumber
                                : "-"
                            : `$ ${data[i].costPrice.toFixed(2)}`}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                        {title === "Customers"
                            ? `$ ${data[i].openBalance.toFixed(2)}`
                            : data[i].quantity}
                    </td>
                </tr>
            );
        }
    }

    return rows;
}

export default CustomerAndItemTable;
