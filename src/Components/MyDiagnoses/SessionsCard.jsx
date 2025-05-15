import React from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function SessionsCard({
    doctorName,
    date,
    time,
    duration,
    specialization,
    reason,
    notes,
    status,
}) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <Icon
                            icon="fa6-solid:user-doctor"
                            className="text-blue-600 text-xl"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                            Dr. {doctorName}
                        </h3>
                        <p className="text-gray-600">
                            {specialization} Session
                        </p>
                    </div>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                    <Icon icon="fa6-regular:calendar" className="mr-2" />
                    <span>{new Date(date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                    <Icon icon="fa6-regular:clock" className="mr-2" />
                    <span>{time}</span>
                </div>
                <div className="space-y-2 mb-3">
                    <p className="text-sm font-medium text-gray-700">
                        Reason: {reason}
                    </p>
                    <p className="text-sm text-gray-600">
                        Duration: {duration}
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                    >
                        {status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

SessionsCard.propTypes = {
    doctorName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    notes: PropTypes.string,
    status: PropTypes.string.isRequired,
};
