import React, { useEffect, useState } from "react";
import Sidebar from "../widgets/notus-react/SideBar.js";
import CustomerAndItemTable from "../widgets/notus-react/CustomerAndItemTable.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { GET_ALL_CUSTOMERS } from "../../../Constants.js";
import {
    addAllCustomers,
    removeAllCustomers,
} from "./../../../redux/quickbooks/customer/customerActions.js";
import ErrorModal from "../widgets/ErrorModal.js";

function Customers() {
    const jwt = useSelector((state) => state.localAuthReducer.jwt);
    const customers = useSelector((state) => state.customerReducer.customers);
    const dispatch = useDispatch();
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        axios
            .get(GET_ALL_CUSTOMERS, {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((response) => {
                dispatch(addAllCustomers(response.data));
            })
            .catch((error) => {
                if (error.response.code === 401) {
                    setIsSessionExpired(true);
                }
            });
        // clear the redux state on component did unmount
        return () => {
            dispatch(removeAllCustomers());
        };
    }, [jwt, dispatch]);

    return (
        <>
            {isSessionExpired ? (
                <ErrorModal type="SESSION_EXPIRED" />
            ) : (
                <>
                    <Sidebar />
                    <div className="relative md:ml-64 bg-blueGray-100">
                        <div className="flex flex-wrap mt-4">
                            <div className="w-full mb-12 px-4">
                                <CustomerAndItemTable
                                    title="Customers"
                                    data={customers}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Customers;
