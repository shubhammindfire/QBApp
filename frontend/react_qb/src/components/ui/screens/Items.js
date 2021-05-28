import React, { useEffect, useState } from "react";
import Sidebar from "../widgets/notus-react/SideBar.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { GET_ALL_ITEMS } from "../../../Constants.js";
import { addAllItems } from "./../../../redux/quickbooks/item/itemActions.js";
import CustomerAndItemTable from "../widgets/notus-react/CustomerAndItemTable.js";
import ErrorModal from "../widgets/ErrorModal.js";

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
                                    title="Items"
                                    data={items}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Items;
