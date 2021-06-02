/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";
import {
    PORTAL_ROUTE,
    PORTAL_CUSTOMERS_ROUTE,
    PORTAL_ITEMS_ROUTE,
    PORTAL_INVOICES_ROUTE,
    BASE_REACT_ROUTE,
    LOGIN_ROUTE,
} from "./../../../../Constants.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faExclamation,
    faIcons,
    faList,
    faPowerOff,
    faTimes,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setLocalAuthJwt } from "../../../../redux/localAuth/localAuthActions.js";

export default function Sidebar() {
    const dispatch = useDispatch();
    const [collapseShow, setCollapseShow] = React.useState("hidden");
    return (
        <>
            <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                    {/* Toggler */}
                    <button
                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        type="button"
                        onClick={() =>
                            setCollapseShow("bg-white m-2 py-3 px-6")
                        }
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {/* Brand */}
                    <Link
                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                        to={PORTAL_ROUTE}
                    >
                        QBO Integration
                    </Link>
                    {/* Collapse */}
                    <div
                        className={
                            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                            collapseShow
                        }
                    >
                        {/* Collapse header */}
                        <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <Link
                                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                                        to="/"
                                    >
                                        QBO Integration
                                    </Link>
                                </div>
                                <div className="w-6/12 flex justify-end">
                                    <button
                                        type="button"
                                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                        onClick={() =>
                                            setCollapseShow("hidden")
                                        }
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Heading */}
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                            QBO Pages
                        </h6>
                        {/* Navigation */}

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                            <li className="items-center">
                                <Link
                                    className={
                                        "text-xs uppercase py-3 font-bold block " +
                                        (window.location.href.indexOf(
                                            PORTAL_CUSTOMERS_ROUTE
                                        ) !== -1
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500")
                                    }
                                    to={PORTAL_CUSTOMERS_ROUTE}
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="mr-3"
                                    />
                                    Customers
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={
                                        "text-xs uppercase py-3 font-bold block " +
                                        (window.location.href.indexOf(
                                            PORTAL_ITEMS_ROUTE
                                        ) !== -1
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500")
                                    }
                                    to={PORTAL_ITEMS_ROUTE}
                                >
                                    <FontAwesomeIcon
                                        icon={faIcons}
                                        className="mr-3"
                                    />
                                    Items
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={
                                        "text-xs uppercase py-3 font-bold block " +
                                        (window.location.href.indexOf(
                                            PORTAL_INVOICES_ROUTE
                                        ) !== -1
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500")
                                    }
                                    to={PORTAL_INVOICES_ROUTE}
                                >
                                    <FontAwesomeIcon
                                        icon={faList}
                                        className="mr-3"
                                    />
                                    Invoices
                                </Link>
                            </li>
                        </ul>

                        {/* Divider */}
                        <hr className="my-4 md:min-w-full" />

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                            <li className="items-center">
                                <Link
                                    className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                                    to={LOGIN_ROUTE}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(setLocalAuthJwt(null));
                                        localStorage.removeItem("session-jwt");
                                        localStorage.removeItem(
                                            "isQBOConnected"
                                        );
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faPowerOff}
                                        className="mr-3"
                                        color="#FF0000"
                                    />
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
