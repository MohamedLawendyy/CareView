import React from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function AppointmentCard({
    patientId,
    note,
    appointmentDate,
    isUpcoming,
    onCancel,
}) {
    const appointmentDateObj = new Date(appointmentDate);
    const formattedDate = appointmentDateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const formattedTime = appointmentDateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-2">
                    Patient: {patientId}
                </h3>
                <p className="text-gray-600 mb-4">
                    {note || "General Consultation"}
                </p>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                        <Icon
                            icon="fa6-regular:calendar"
                            className="text-purple-500 mr-3"
                        />
                        <span className="text-gray-700">{formattedDate}</span>
                    </div>
                    <div className="flex items-center">
                        <Icon
                            icon="fa6-regular:clock"
                            className="text-purple-500 mr-3"
                        />
                        <span className="text-gray-700">{formattedTime}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isUpcoming
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                        }`}
                    >
                        {isUpcoming ? "Upcoming" : "Completed"}
                    </span>
                    {isUpcoming && (
                        <button
                            onClick={onCancel}
                            className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

AppointmentCard.propTypes = {
    patientId: PropTypes.string.isRequired,
    note: PropTypes.string,
    appointmentDate: PropTypes.string.isRequired,
    isUpcoming: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
};
