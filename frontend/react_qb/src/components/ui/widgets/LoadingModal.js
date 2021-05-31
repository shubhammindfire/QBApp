import React from "react";
import Loader from "react-loader-spinner";

function LoadingModal() {
    return (
        <div className="w-96 h-40 fixed top-1/3 left-1/2 bg-gray-400 rounded-lg">
            {/* dialog */}
            <div className="relative p-8 w-full max-w-md m-auto flex-col flex">
                <p className="text-white text-lg">Please wait..</p>
                <Loader type="Watch" color="#FFFFFF" height={80} width={80} />
            </div>
        </div>
    );
}

export default LoadingModal;
