import React from "react";

export default function PostTreatment() {
    return (
        <div className="flex h-screen w-full">
            {/* Left section - 2/3 of the screen */}
            <div className="flex-[2] bg-gray-100 border-r border-gray-200 p-5">
                Left Content (2/3)
            </div>

            {/* Right section - 1/3 of the screen */}
            <div className="flex-1 bg-primary p-5">Right Content (1/3)</div>
        </div>
    );
}
