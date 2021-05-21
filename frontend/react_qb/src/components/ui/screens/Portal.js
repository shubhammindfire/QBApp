import React from "react";
import Sidebar from "../widgets/notus-react/SideBar";

function Portal() {
    return (
        <div>
            <Sidebar />
            <div className="md:ml-64 mt-16 text-3xl text-center bg-blueGray-100">
                <p>Welcome to the portal</p>
                <p>Move to other tabs to see your data</p>
            </div>
        </div>
    );
}

export default Portal;
