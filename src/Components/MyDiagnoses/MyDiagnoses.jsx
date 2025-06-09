import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import AppointmentCard from "./AppointmentCard";
import SessionsCard from "./SessionsCard";

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
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
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
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
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
            avatar: "https://randomuser.me/api/portraits/women/63.jpg",
        },
    ].map((session) => ({
        ...session,
        status: new Date(session.date) > currentDate ? "Upcoming" : "Completed",
    }));

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [activeTab, setActiveTab] = useState("sessions");
    const [sessionsFilter, setSessionsFilter] = useState("all");
    const [appointmentsFilter, setAppointmentsFilter] = useState("all");

    const getRoleFromToken = (token) => {
        try {
            if (!token) return null;
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(atob(base64));
            return payload[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
        } catch (e) {
            console.error("Error parsing token:", e);
            return null;
        }
    };

    const fetchAppointments = async (role) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                toast.error("You need to login first");
                navigate("/login");
                return [];
            }

            const endpoint =
                role === "Doctor"
                    ? "https://careview.runasp.net/api/Appointment/GetAppointmentsForDoctor"
                    : "https://careview.runasp.net/api/Appointment/GetAppointmentsForUser";

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return Array.isArray(response?.data) ? response.data : [];
        } catch (err) {
            console.error("Error fetching appointments:", err);
            if (err.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                navigate("/login");
                return [];
            }
            if (err.response?.status === 404) {
                return [];
            }
            throw err;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("userToken");
                if (!token) {
                    toast.error("You need to login first");
                    navigate("/login");
                    return;
                }

                const role = getRoleFromToken(token);
                if (!role) {
                    throw new Error("Could not determine user role");
                }
                setUserRole(role);

                const appointmentsData = await fetchAppointments(role);
                setAppointments(appointmentsData);
            } catch (err) {
                setError(err.message);
                await Swal.fire({
                    title: "Error!",
                    text: err.message || "Failed to load data",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                });
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    const handleRetry = async () => {
        setError(null);
        setLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                navigate("/login");
                return;
            }

            const role = getRoleFromToken(token);
            if (!role) {
                throw new Error("Could not determine user role");
            }

            const appointmentsData = await fetchAppointments(role);
            setAppointments(appointmentsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = staticSessions.filter((session) => {
        if (sessionsFilter === "all") return true;
        if (sessionsFilter === "upcoming") return session.status === "Upcoming";
        if (sessionsFilter === "completed")
            return session.status === "Completed";
        return true;
    });

    const filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        const isUpcoming = appointmentDate > currentDate;

        if (appointmentsFilter === "all") return true;
        if (appointmentsFilter === "upcoming") return isUpcoming;
        if (appointmentsFilter === "completed") return !isUpcoming;
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Loading your appointments...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <div className="text-center">
                        <Icon
                            icon="mdi:alert-circle-outline"
                            className="w-16 h-16 text-red-500 mx-auto mb-4"
                        />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Error Loading Data
                        </h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleRetry}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userRole) {
        return (
            <div className="flex items-center justify-center h-screen ">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <div className="text-center">
                        <Icon
                            icon="mdi:shield-account-outline"
                            className="w-16 h-16 text-yellow-500 mx-auto mb-4"
                        />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Authentication Required
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Could not determine your user role. Please login
                            again.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isDoctor = userRole === "Doctor";
    const hasAppointments = filteredAppointments.length > 0;
    const hasSessions = filteredSessions.length > 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-8xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        {isDoctor ? "Doctor Dashboard" : "My Diagnoses"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isDoctor
                            ? "Manage your sessions and appointments"
                            : "Track your sessions and appointments"}
                    </p>
                </div>
            </div>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <Icon
                                icon="fa6-solid:calendar"
                                className="w-6 h-6"
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Upcoming Appointments
                            </p>
                            <p className="text-2xl font-semibold text-gray-800">
                                {
                                    appointments.filter(
                                        (a) =>
                                            new Date(a.appointmentDate) >
                                            currentDate
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <Icon icon="fa6-solid:check" className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Completed Sessions
                            </p>
                            <p className="text-2xl font-semibold text-gray-800">
                                {
                                    staticSessions.filter(
                                        (s) => s.status === "Completed"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                            <Icon
                                icon="fa6-solid:user-doctor"
                                className="w-6 h-6"
                            />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">
                                Active {isDoctor ? "Patients" : "Doctors"}
                            </p>
                            <p className="text-2xl font-semibold text-gray-800">
                                {isDoctor
                                    ? [
                                        ...new Set(
                                            appointments.map((a) => a.userId)
                                        ),
                                    ].length
                                    : [
                                        ...new Set(
                                            appointments.map(
                                                (a) => a.doctorId
                                            )
                                        ),
                                    ].length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("sessions")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "sessions"
                                ? "border-third text-third font-semibold"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Icon icon="fa6-solid:stethoscope" className="mr-2" />
                        Sessions
                    </button>
                    <button
                        onClick={() => setActiveTab("appointments")}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "appointments"
                                ? "border-secondary text-secondary font-semibold"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Icon
                            icon="fa6-regular:calendar-check"
                            className="mr-2"
                        />
                        Appointments
                    </button>
                </nav>
            </div>

            {/* Content based on active tab */}
            <div className="mb-12">
                {activeTab === "sessions" && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {isDoctor ? "Your Sessions" : "My Sessions"}
                            </h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSessionsFilter("all")}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        sessionsFilter === "all"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() =>
                                        setSessionsFilter("upcoming")
                                    }
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        sessionsFilter === "upcoming"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() =>
                                        setSessionsFilter("completed")
                                    }
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        sessionsFilter === "completed"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>

                        {!hasSessions ? (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto border border-gray-100">
                                <Icon
                                    icon="fa6-solid:calendar-xmark"
                                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                                />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                    No sessions found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {isDoctor
                                        ? "You don't have any sessions matching this filter."
                                        : "You don't have any sessions matching this filter."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSessions.map((session) => (
                                    <SessionsCard
                                        key={`session-${session.id}`}
                                        {...session}
                                        isDoctorView={isDoctor}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === "appointments" && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {isDoctor
                                    ? "Your Appointments"
                                    : "My Appointments"}
                            </h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setAppointmentsFilter("all")}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        appointmentsFilter === "all"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() =>
                                        setAppointmentsFilter("upcoming")
                                    }
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        appointmentsFilter === "upcoming"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() =>
                                        setAppointmentsFilter("completed")
                                    }
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        appointmentsFilter === "completed"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>

                        {!hasAppointments ? (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto border border-gray-100">
                                <Icon
                                    icon="fa6-regular:calendar"
                                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                                />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                    No appointments found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {isDoctor
                                        ? "You don't have any appointments matching this filter."
                                        : "You don't have any appointments matching this filter."}
                                </p>
                                
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAppointments.map((appointment) => {
                                    const appointmentDate = new Date(
                                        appointment.appointmentDate
                                    );
                                    const isUpcoming =
                                        appointmentDate > currentDate;

                                    return (
                                        <AppointmentCard
                                            key={`appointment-${appointment.appointmentId}`}
                                            appointmentId={
                                                appointment.appointmentId
                                            }
                                            patientId={appointment.userId}
                                            doctorId={appointment.doctorId}
                                            appointmentDate={
                                                appointment.appointmentDate
                                            }
                                            isUpcoming={isUpcoming}
                                            isDoctorView={isDoctor}
                                            status={
                                                appointment.appointmentStatus
                                            }
                                            isReviewed={appointment.isReviewed}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
