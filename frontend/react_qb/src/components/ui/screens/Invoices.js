import React from "react";
import Sidebar from "../widgets/notus-react/SideBar.js";
import Table from "../widgets/notus-react/Table.js";

function Invoices() {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100">
                <div className="flex flex-wrap mt-4">
                    <div className="w-full mb-12 px-4">
                        <Table title="Invoices" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Invoices;
