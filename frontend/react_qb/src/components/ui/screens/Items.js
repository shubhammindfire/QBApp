import React, { useEffect, useState } from "react";
import Sidebar from "../widgets/notus-react/SideBar.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
    GET_ALL_ITEMS,
    LOGIN_ROUTE,
    PORTAL_ROUTE,
} from "../../../Constants.js";
import {
    addAllItems,
    removeAllItems,
} from "./../../../redux/quickbooks/item/itemActions.js";
import CustomerAndItemTable from "../widgets/notus-react/CustomerAndItemTable.js";
import ErrorModal from "../widgets/ErrorModal.js";
import { Link, Redirect } from "react-router-dom";

function Items() {
    const jwt = useSelector((state) => state.localAuthReducer.jwt);
    const items = useSelector((state) => state.itemReducer.items);
    const dispatch = useDispatch();
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        axios
            .get(GET_ALL_ITEMS, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                dispatch(addAllItems(response.data));
            })
            .catch((error) => {
                if (error.response.data.code === 401) {
                    setIsSessionExpired(true);
                }
            });
        // clear the redux state on component did unmount
        return () => {
            dispatch(removeAllItems());
        };
    }, [jwt, dispatch]);

    return (
        <>
            {jwt === null ? (
                // if the user is not logged in then redirect to login
                <Redirect to={LOGIN_ROUTE} />
            ) : isSessionExpired ? (
                <ErrorModal type="SESSION_EXPIRED" />
            ) : (
                <>
                    <Sidebar />
                    <div className="relative md:ml-64 bg-blueGray-100 py-10">
                        {items === null || items === "" ? (
                            <div className="text-center">
                                <p className="mb-4 text-lg">
                                    No item data available. Please ensure to
                                    click on "Fetch data from QuickBooks" button
                                    in the portal home page.
                                </p>
                                <Link
                                    to={PORTAL_ROUTE}
                                    className="rounded-full bg-green-600 text-white px-4 py-2"
                                >
                                    Go to Portal Home page
                                </Link>
                            </div>
                        ) : (
                            <CustomerAndItemTable title="Items" data={items} />
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default Items;
