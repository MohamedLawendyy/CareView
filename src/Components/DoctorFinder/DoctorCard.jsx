import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function DoctorCard({ doctor }) {
    const [selectedAvailableTime, setselectedAvailableTime] =
        useState(null);

    function handleAppointmentTimeSelect(time) {
        setselectedAvailableTime(time);
    }

    function bookAppointment() {
        console.log(selectedAvailableTime);
    }

    async function createAppointment() {
        try {
            const response = await axios.post(
                "https://careview.runasp.net/api/Appointment/CreateAppointments",
                { doctorId: doctor.id, time: selectedAvailableTime },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`, // 👈 Add the token here
                    },
                }
            );
            setDoctors(response.data); // Make sure to use `response.data`
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch doctors"
            );
        }
    }

    return (
        <>
            <div className="flex flex-col bg-white rounded-xl shadow-lg p-5">
                <div className="">{/* <img src={} alt="" /> */}</div>

                <h1>{doctor.firstName + " " + doctor.lastName}</h1>
                <h2>{doctor.bio}</h2>
                <select
                    onChange={(e) =>
                        handleAppointmentTimeSelect(e.target.value)
                    }
                    name="available-times"
                    id="available-times"
                >
                    {doctor.availableTimes.map((time) => (
                        <option value={time}>{time}</option>
                    ))}
                </select>

                <button
                    onClick={createAppointment}
                    className="bg-secondary text-white p-1 rounded-lg mt-3"
                >
                    Book
                </button>
            </div>
        </>
    );
}
