import React from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function RecentChats({
    doctorName,
    specialization,
    notes,
    timeAgo,
    unreadCount,
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary transition-all duration-300">
            <div className="p-5">
                <div className="flex items-start mb-4">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Icon
                            icon="fa6-solid:user-doctor"
                            className="text-green-600 text-xl"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg text-gray-800">
                                Dr. {doctorName}
                            </h3>
                            <span className="text-xs text-gray-500">
                                {timeAgo}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                            {specialization} Consultation
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-gray-700 line-clamp-2">{notes}</p>
                </div>

                <div className="flex justify-between items-center">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Unread messages: {unreadCount}
                    </span>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                        Continue Chat
                    </button>
                </div>
            </div>
        </div>
    );
}

RecentChats.propTypes = {
    doctorName: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    timeAgo: PropTypes.string.isRequired,
    unreadCount: PropTypes.number.isRequired,
};
