import React, { useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

export default function AppointmentCard({
    appointmentId,
    patientId,
    doctorId,
    note = "General Consultation", // Default value here
    appointmentDate,
    isUpcoming,
    isDoctorView,
    status = 0, // Default value here
}) {
    const [isDeleting, setIsDeleting] = useState(false);

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

    const statusText =
        {
            0: "Scheduled",
            1: "Completed",
            2: "Cancelled",
        }[status] || "Unknown";

    const handleDeleteAppointment = async () => {
        try {
            setIsDeleting(true);
            const token = localStorage.getItem("userToken");
            if (!token) {
                toast.error("You need to login first");
                return;
            }

            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            });

            if (!result.isConfirmed) {
                setIsDeleting(false);
                return;
            }

            await axios.delete(
                `https://careview.runasp.net/api/Appointment/DeleteAppointment?appointmentId=${appointmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await Swal.fire({
                title: "Deleted!",
                text: "Appointment has been deleted.",
                icon: "success",
                confirmButtonColor: "#3085d6",
            });

            window.location.reload();
        } catch (err) {
            await Swal.fire({
                title: "Error!",
                text:
                    err.response?.data?.message ||
                    "Failed to delete appointment",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
            console.error("Error deleting appointment:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300 relative">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                        {isDoctorView
                            ? `Patient: ${patientId}`
                            : `Doctor: ${doctorId}`}
                    </h3>
                    <button
                        onClick={handleDeleteAppointment}
                        disabled={isDeleting}
                        className={`p-1 rounded-full ${
                            isDeleting
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                        }`}
                        title="Delete appointment"
                        aria-label="Delete appointment"
                    >
                        {isDeleting ? (
                            <Icon
                                icon="eos-icons:loading"
                                className="text-lg"
                            />
                        ) : (
                            <Icon
                                icon="ic:round-delete"
                                width="24"
                                height="24"
                            />
                        )}
                    </button>
                </div>

                {note && <p className="text-gray-600 mb-4">{note}</p>}

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

                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isUpcoming
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                        }`}
                    >
                        {isUpcoming ? "Upcoming" : "Completed"}
                    </span>

                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {statusText}
                    </span>
                </div>
            </div>
        </div>
    );
}

AppointmentCard.propTypes = {
    appointmentId: PropTypes.string.isRequired,
    patientId: PropTypes.string.isRequired,
    doctorId: PropTypes.string.isRequired,
    note: PropTypes.string, // Note is now optional
    appointmentDate: PropTypes.string.isRequired,
    isUpcoming: PropTypes.bool.isRequired,
    isDoctorView: PropTypes.bool.isRequired,
    status: PropTypes.number,
    isReviewed: PropTypes.bool,
};

AppointmentCard.defaultProps = {
    note: "General Consultation",
    status: 0,
    isReviewed: false,
};
