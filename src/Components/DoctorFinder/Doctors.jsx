import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DoctorCard from "./DoctorCard";
import { Icon } from "@iconify/react";

export default function Doctors() {
    const [doctors, setDoctors] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const userToken = localStorage.getItem("userToken");

    async function getDoctors() {
        try {
            setIsLoading(true);
            const response = await axios.get(
                "https://careview.runasp.net/api/Account/doctors",
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setDoctors(response.data);
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to fetch doctors"
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getDoctors();
    }, []);

    return (
        <div
            className="flex flex-col container mx-auto px-4 py-8 max-w-8xl"
            style={{ backgroundColor: "#E4E5DB" }}
        >
            <div className="text-center mb-8">
                <h1
                    className="text-3xl font-bold mb-2"
                    style={{ color: "#152A38" }}
                >
                    Find Your Doctor
                </h1>
                <p className="" style={{ color: "#2F5241" }}>
                    Book an appointment with our specialist doctors
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2"
                        style={{ borderColor: "#152A38" }}
                    ></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {doctors && doctors.length > 0 ? (
                        doctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="w-full transition-transform hover:scale-[1.02]"
                            >
                                <DoctorCard
                                    doctor={doctor}
                                    userToken={userToken}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Icon
                                icon="mdi:doctor"
                                className="mx-auto text-4xl mb-4"
                                style={{ color: "#2F5241" }}
                            />
                            <h3
                                className="text-xl font-medium"
                                style={{ color: "#152A38" }}
                            >
                                No doctors available
                            </h3>
                            <p className="mt-2" style={{ color: "#2F5241" }}>
                                Please check back later
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
