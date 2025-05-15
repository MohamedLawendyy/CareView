import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppointmentCard from "./AppointmentCard";
import SessionsCard from "./SessionsCard";
import RecentChats from "./RecentChats";

export default function MyDignoses() {
    const navigate = useNavigate();
    const currentDate = new Date();

    // Static data for sessions
    const staticSessions = [
        {
            id: 1,
            doctorName: "Sarah Johnson",
            date: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() - 2
            ).toISOString(),
            time: "10:00 AM",
            duration: "45 mins",
            specialization: "Psychiatrist",
            reason: "Anxiety follow-up",
            notes: "Patient reported reduced anxiety symptoms since last session.",
        },
        {
            id: 2,
            doctorName: "Michael Chen",
            date: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 2
            ).toISOString(),
            time: "2:30 PM",
            duration: "30 mins",
            specialization: "Clinical Psychologist",
            reason: "Initial consultation",
            notes: "New patient intake session scheduled.",
        },
        {
            id: 3,
            doctorName: "Emily Rodriguez",
            date: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 5
            ).toISOString(),
            time: "11:15 AM",
            duration: "60 mins",
            specialization: "Therapist",
            reason: "Cognitive behavioral therapy",
            notes: "Continuing CBT techniques for depression management.",
        },
    ].map((session) => ({
        ...session,
        status: new Date(session.date) > currentDate ? "Upcoming" : "Completed",
    }));

    const staticChats = [
        {
            id: 1,
            doctorName: "Sarah Johnson",
            specialization: "Psychiatrist",
            notes: "Patient reported reduced anxiety symptoms since last session.",
            timeAgo: "2h ago",
            unreadCount: 1,
        },
        {
            id: 2,
            doctorName: "Michael Chen",
            specialization: "Clinical Psychologist",
            notes: "New patient intake session scheduled.",
            timeAgo: "1d ago",
            unreadCount: 2,
        },
        {
            id: 3,
            doctorName: "Emily Rodriguez",
            specialization: "Therapist",
            notes: "Continuing CBT techniques for depression management.",
            timeAgo: "3d ago",
            unreadCount: 3,
        },
    ];

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, [navigate]);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                navigate("/login");
                return;
            }

            setLoading(true);
            const response = await axios.get(
                "https://careview.runasp.net/api/Appointment/GetAppointmentsForDoctor",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 404) {
                setAppointments([]);
                toast.info("No appointments found");
            } else {
                setError(err.message);
                toast.error("Failed to load appointments");
            }
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const token = localStorage.getItem("userToken");
            await axios.delete(
                `https://careview.runasp.net/api/Appointment/DeleteAppointment?appointmentId=${appointmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Appointment cancelled successfully");
            fetchAppointments();
        } catch (err) {
            toast.error("Failed to cancel appointment");
            console.error("Error cancelling appointment:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Failed to load data. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Sessions Section */}
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <Icon
                        icon="fa6-solid:stethoscope"
                        className="mr-3 text-blue-600"
                    />
                    Physical Therapy Sessions
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staticSessions.map((session) => (
                        <SessionsCard
                            key={`session-${session.id}`}
                            doctorName={session.doctorName}
                            date={session.date}
                            time={session.time}
                            duration={session.duration}
                            specialization={session.specialization}
                            reason={session.reason}
                            notes={session.notes}
                            status={session.status}
                        />
                    ))}
                </div>
            </div>

            {/* Appointments Section */}
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <Icon
                        icon="fa6-regular:calendar-check"
                        className="mr-3 text-purple-600"
                    />
                    Upcoming Appointments
                </h1>
                {appointments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <Icon
                                icon="fa6-regular:calendar"
                                className="w-16 h-16 mx-auto text-gray-400"
                            />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                No appointments scheduled
                            </h3>
                            <p className="mt-2 text-gray-500">
                                You don't have any upcoming appointments. Book a
                                session to get started.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments.map((appointment) => {
                            const appointmentDate = new Date(
                                appointment.appointmentDate
                            );
                            const isUpcoming = appointmentDate > currentDate;

                            return (
                                <AppointmentCard
                                    key={`appointment-${appointment.appointmentId}`}
                                    patientId={appointment.userId}
                                    note={appointment.note}
                                    appointmentDate={
                                        appointment.appointmentDate
                                    }
                                    isUpcoming={isUpcoming}
                                    onCancel={() =>
                                        handleCancelAppointment(
                                            appointment.appointmentId
                                        )
                                    }
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Chats Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <Icon
                        icon="fa6-regular:comments"
                        className="mr-3 text-green-600"
                    />
                    Recent Chats
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staticChats.map((chat) => (
                        <RecentChats
                            key={`chat-${chat.id}`}
                            doctorName={chat.doctorName}
                            specialization={chat.specialization}
                            notes={chat.notes}
                            timeAgo={chat.timeAgo}
                            unreadCount={chat.unreadCount}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
