import React from "react";

export default function Message({ severity, text, className = "" }) {
    const severityClasses = {
        error: "bg-red-100 border-red-400 text-red-700",
        success: "bg-green-100 border-green-400 text-green-700",
        info: "bg-blue-100 border-blue-400 text-blue-700",
        warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    };

    return (
        <div
            className={`${severityClasses[severity]} border px-4 py-3 rounded relative mb-4 ${className}`}
        >
            <span className="block sm:inline">{text}</span>
        </div>
    );
}
