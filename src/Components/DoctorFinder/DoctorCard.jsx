import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function DoctorCard({ doctor, userToken, setDoctors }) {
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [notes, setNotes] = useState("");
    const [isBooking, setIsBooking] = useState(false);

    // Generate time slots from 6 PM to 10 PM in 30-minute increments (in 12-hour format)
    const generateTimeSlots = () => {
        const times = [];
        const startHour = 18; // 6 PM in 24-hour format
        const endHour = 22; // 10 PM in 24-hour format

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

    function handleTimeSelect(time) {
        setSelectedTime(time);
    }

    function handleDateChange(e) {
        setSelectedDate(e.target.value);
    }

    function handleNotesChange(e) {
        setNotes(e.target.value);
    }

    function formatAppointmentDateTime(dateString, timeString) {
        if (!dateString || !timeString) return null;

        // Split the time string into hours and minutes
        const [hours, minutes] = timeString.split(":").map(Number);

        // Create a Date object from the selected date
        const date = new Date(dateString);

        // Set the hours and minutes from the selected time
        date.setHours(hours, minutes, 0, 0);

        // Convert to ISO string (this will be in UTC)
        return date.toISOString();
    }

    async function createAppointment() {
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
            // Format the date and time into ISO format
            const appointmentDateTime = formatAppointmentDateTime(
                selectedDate,
                selectedTime
            );

            const appointmentData = {
                doctorId: doctor.id,
                appointmentDate: appointmentDateTime,
                notes: notes || null,
            };

            const response = await axios.post(
                "https://careview.runasp.net/api/Appointment/CreateAppointments",
                appointmentData,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Appointment booked successfully!");
            setSelectedTime("");
            setSelectedDate("");
            setNotes("");

            // If you need to update the parent component's state:
            // setDoctors(prev => [...prev]); // Or whatever update logic you need
        } catch (error) {
            console.error("Appointment error:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.errors?.join(", ") ||
                "Failed to book appointment";
            toast.error(errorMessage);
        } finally {
            setIsBooking(false);
        }
    }

    return (
        <div className="flex flex-col bg-white rounded-xl shadow-lg p-5 gap-2 w-full max-w-md">
            <h1 className="font-bold text-lg">
                {doctor.firstName + " " + doctor.lastName}
            </h1>
            <h2 className="text-gray-600">{doctor.bio}</h2>

            <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Appointment Date
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    min={new Date().toISOString().split("T")[0]} // Set min date to today
                    disabled={isBooking}
                />
            </div>

            <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Appointment Time (6 PM - 10 PM)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                        <button
                            key={slot.value}
                            onClick={() => handleTimeSelect(slot.value)}
                            className={`p-1 text-sm rounded-md border transition-colors ${
                                selectedTime === slot.value
                                    ? "bg-secondary text-white border-secondary"
                                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                            }`}
                            disabled={isBooking || !selectedDate}
                        >
                            {slot.display}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                >
                    Notes (Optional)
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Any additional notes for the doctor"
                    value={notes}
                    onChange={handleNotesChange}
                    disabled={isBooking}
                />
            </div>

            <button
                onClick={createAppointment}
                className={`bg-secondary text-white p-2 rounded-lg mt-4 transition-colors ${
                    isBooking
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-secondary-dark"
                }`}
                disabled={!selectedDate || !selectedTime || isBooking}
            >
                {isBooking ? "Booking..." : "Book Appointment"}
            </button>
        </div>
    );
}
