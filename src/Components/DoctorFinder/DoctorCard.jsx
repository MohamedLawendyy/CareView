import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

export default function DoctorCard({ doctor, userToken }) {
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [notes, setNotes] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const generateTimeSlots = () => {
        const times = [];
        const startHour = 18;
        const endHour = 22;

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                if (hour === endHour && minute === 30) continue;

                const period = hour >= 12 ? "PM" : "AM";
                const displayHour = hour > 12 ? hour - 12 : hour;
                const displayHourFormatted =
                    displayHour === 0 ? 12 : displayHour;
                const timeString = `${hour}:${minute
                    .toString()
                    .padStart(2, "0")}`;
                const displayTime = `${displayHourFormatted}:${minute
                    .toString()
                    .padStart(2, "0")} ${period}`;

                times.push({
                    value: timeString,
                    display: displayTime,
                });
            }
        }
        return times;
    };

    const timeSlots = generateTimeSlots();

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedTime(""); // Reset time when date changes
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    const formatAppointmentDateTime = (dateString, timeString) => {
        if (!dateString || !timeString) return null;
        const [hours, minutes] = timeString.split(":").map(Number);
        const date = new Date(dateString);
        date.setHours(hours, minutes, 0, 0);
        return date.toISOString();
    };

    const createAppointment = async () => {
        if (!selectedDate) {
            toast.error("Please select a date");
            return;
        }

        if (!selectedTime) {
            toast.error("Please select an appointment time");
            return;
        }

        setIsBooking(true);

        try {
            const appointmentDateTime = formatAppointmentDateTime(
                selectedDate,
                selectedTime
            );

            if (!appointmentDateTime) {
                throw new Error("Invalid date/time format");
            }

            const appointmentData = {
                doctorId: doctor.id,
                appointmentDate: appointmentDateTime,
                ...(notes.trim() && { notes: notes.trim() }),
            };

            await axios.post(
                "https://careview.runasp.net/api/Appointment/CreateAppointments",
                appointmentData,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Appointment booked successfully!", {
                icon: "🎉",
                style: {
                    borderRadius: "10px",
                    background: "#152A38",
                    color: "#fff",
                },
            });

            setSelectedTime("");
            setSelectedDate("");
            setNotes("");
        } catch (error) {
            let errorMessage = "Failed to book appointment";

            if (error.response) {
                if (typeof error.response.data === "string") {
                    errorMessage = error.response.data;
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (Array.isArray(error.response.data?.errors)) {
                    errorMessage = error.response.data.errors.join(", ");
                } else if (error.response.data?.title) {
                    errorMessage = error.response.data.title;
                }
            } else if (error.request) {
                errorMessage = "No response received from server";
            } else {
                errorMessage = error.message;
            }

            toast.error(errorMessage, {
                icon: "⚠️",
                style: {
                    borderRadius: "10px",
                    background: "#152A38",
                    color: "#fff",
                },
            });
        } finally {
            setIsBooking(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    return (
        <div className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border-0 transition-all duration-300 hover:shadow-xl w-full max-w-md">
            {/* Doctor Header */}
            <div
                className="p-6 h-32 relative"
                style={{ backgroundColor: "#152A38" }}
            >
                <div className="absolute inset-0 opacity-5 bg-white"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div
                        className="p-3 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{
                            backgroundColor: "#2F5241",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Icon
                            icon="mdi:doctor"
                            width={24}
                            className="text-white"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl text-white">
                            Dr. {doctor.firstName} {doctor.lastName}
                        </h1>
                        <div className="mt-2 flex items-center">
                            <span
                                className="text-xs px-2 py-1 rounded-full font-medium"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    color: "white",
                                }}
                            >
                                {doctor.specializtion || "General Practitioner"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctor Details*/}
            <div className="p-6 flex-grow">
                <div className="space-y-5">
                    {/* Date Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label
                                className="flex items-center gap-2 font-medium"
                                style={{ color: "#152A38" }}
                            >
                                <Icon
                                    icon="uil:calender"
                                    width={18}
                                    style={{ color: "#2F5241" }}
                                />
                                <span>Appointment Date</span>
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedDate(today);
                                        setIsDatePickerOpen(false);
                                    }}
                                    className={`text-xs px-3 py-1 rounded-md transition-all ${
                                        selectedDate === today
                                            ? "text-white bg-[#2F5241]"
                                            : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedDate(tomorrowFormatted);
                                        setIsDatePickerOpen(false);
                                    }}
                                    className={`text-xs px-3 py-1 rounded-md transition-all ${
                                        selectedDate === tomorrowFormatted
                                            ? "text-white bg-[#2F5241]"
                                            : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    Tomorrow
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all cursor-pointer"
                                style={{
                                    borderColor: "#e5e7eb",
                                    focusRingColor: "#2F5241",
                                }}
                                min={today}
                                disabled={isBooking}
                                onFocus={() => setIsDatePickerOpen(true)}
                                onBlur={() => setIsDatePickerOpen(false)}
                            />
                            <Icon
                                icon={
                                    isDatePickerOpen
                                        ? "mdi:chevron-up"
                                        : "mdi:chevron-down"
                                }
                                className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                                width={18}
                            />
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                        <label
                            className="flex items-center gap-2 font-medium mb-3"
                            style={{ color: "#152A38" }}
                        >
                            <Icon
                                icon="ic:outline-access-time"
                                width={18}
                                style={{ color: "#2F5241" }}
                            />
                            <span>Available Times (6 PM - 10 PM)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot.value}
                                    onClick={() => handleTimeSelect(slot.value)}
                                    disabled={!selectedDate || isBooking}
                                    className={`p-2 text-xs rounded-md border transition-all flex items-center justify-center ${
                                        selectedTime === slot.value
                                            ? "text-white bg-[#2F5241] border-transparent shadow-sm"
                                            : !selectedDate
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#2F5241]"
                                    }`}
                                >
                                    {slot.display}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer with Notes and Book Button */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="mb-4">
                    <label
                        className="flex items-center gap-2 font-medium mb-2"
                        style={{ color: "#152A38" }}
                    >
                        <Icon
                            icon="mdi:note-text-outline"
                            width={18}
                            style={{ color: "#2F5241" }}
                        />
                        <span>Appointment Notes</span>
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                        value={notes}
                        onChange={handleNotesChange}
                        rows={2}
                        className="block w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                        style={{
                            borderColor: "#e5e7eb",
                            focusRingColor: "#2F5241",
                        }}
                        placeholder="Briefly describe your symptoms..."
                        disabled={isBooking}
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Required for better consultation
                    </p>
                </div>

                <button
                    onClick={createAppointment}
                    disabled={
                        !selectedDate ||
                        !selectedTime ||
                        isBooking ||
                        !notes.trim()
                    }
                    className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                        isBooking ||
                        !selectedDate ||
                        !selectedTime ||
                        !notes.trim()
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "text-white bg-[#2F5241] shadow-md hover:bg-[#244433] hover:shadow-lg active:translate-y-0.5"
                    }`}
                >
                    {isBooking ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Securing your slot...
                        </span>
                    ) : (
                        <>
                            <Icon
                                icon="mdi:calendar-check"
                                className="mr-2"
                                width={18}
                            />
                            Confirm Appointment
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
