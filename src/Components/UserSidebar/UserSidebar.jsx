import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoSVG from "../../assets/images/Login&Signup Logo.svg";

export default function UserSidebar({ isSidebarOpen, toggleSidebar }) {
    const [activeSection, setActiveSection] = useState("Home");
    const [hoveredItem, setHoveredItem] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

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
    const role = getRoleFromToken(
        localStorage.getItem("userToken")
    )?.toLowerCase();

    const navItems = [
        {
            name: "Home",
            icon: "tabler:home-filled",
            path: "/home",
            doctor: true,
        },
        {
            name: "My Diagnoses",
            icon: "tabler:clipboard-text-filled",
            path: "/my-diagnoses",
            doctor: true,
        },
        {
            name: "Doctor finder",
            icon: "fluent:doctor-24-filled",
            path: "/doctor-finder",
        },
        {
            name: "Pharmacy",
            icon: "healthicons:pharmacy-24px",
            path: "/pharmacy",
        },
        {
            name: "Post Treatment",
            icon: "ic:baseline-monitor-heart",
            path: "/post-treatment",
        },
        { name: "History", icon: "tabler:clock-filled", path: "/history" },
    ];

    const bottomItems = [
        {
            name: "Logout",
            icon: "majesticons:logout",
            path: "#logout",
            textColor: "text-red-600",
            iconColor: "text-red-600",
        },
    ];

    const handleLogout = () => {
        if (!window.confirm("Are you sure you want to log out?")) return;

        toast.success("Logged out successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        setTimeout(() => navigate("/LandPage"), 0);

        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
    };

    const handleItemClick = (item) => {
        if (item.name === "Logout") {
            handleLogout();
            return;
        }
        navigate(item.path);
        setActiveSection(item.name);
    };

    useEffect(() => {
        const currentItem = navItems.find(
            (item) => item.path === location.pathname
        );
        if (currentItem) setActiveSection(currentItem.name);
    }, [location.pathname]);

    return (
        <div
            className={`bg-primary text-textPrimary ${
                isSidebarOpen ? "w-64 px-2" : "w-0 lg:w-20 items-center lg:px-2"
            } h-screen py-7  fixed top-0 left-0 transition-all duration-300 flex flex-col z-50`}
        >
            {/* Logo and Toggle */}
            <div className="relative px-4 mb-8">
                <div className="flex items-center">
                    <img
                        src={LogoSVG}
                        className="w-8 h-8"
                        alt="CareView Logo"
                    />
                    {isSidebarOpen && (
                        <span className="text-xl font-extrabold text-secondary ml-2">
                            CareView
                        </span>
                    )}
                </div>

                <button
                    onClick={toggleSidebar}
                    className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-secondary border-2 border-primary text-white hover:bg-secondary/90 transition-all shadow-md z-10"
                    aria-label={
                        isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"
                    }
                >
                    <Icon
                        icon={
                            isSidebarOpen
                                ? "mdi:chevron-left"
                                : "mdi:chevron-right"
                        }
                        width="18"
                        height="18"
                    />
                </button>
            </div>

            {/* Main Navigation */}
            <nav
                className={`flex-1 space-y-2 overflow-y-auto overflow-x-hidden ${
                    isSidebarOpen ? "" : "hidden lg:block"
                } `}
            >
                {navItems.map((item) => (
                    <div
                        key={item.name}
                        className={`relative h-12 ${
                            role
                                ? role == "client"
                                    ? "block"
                                    : item.doctor == true
                                    ? "block"
                                    : "hidden"
                                : "hidden"
                        } `}
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <button
                            onClick={() => handleItemClick(item)}
                            className={`w-full flex items-center h-full ${
                                isSidebarOpen ? "px-4" : "px-3"
                            } rounded-lg transition-colors ${
                                activeSection === item.name
                                    ? "bg-secondary text-white"
                                    : "hover:bg-gray-700/30 text-third"
                            }`}
                        >
                            <Icon
                                icon={item.icon}
                                width="24"
                                height="24"
                                className={
                                    activeSection === item.name
                                        ? "text-white"
                                        : "text-third"
                                }
                            />

                            {isSidebarOpen && (
                                <span className="ml-4 font-medium">
                                    {item.name}
                                </span>
                            )}

                            {!isSidebarOpen && hoveredItem === item.name && (
                                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
                                    {item.name}
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto pt-4 space-y-2 border-t border-gray-700">
                {bottomItems.map((item) => (
                    <div
                        key={item.name}
                        className="relative h-12"
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <button
                            onClick={() => handleItemClick(item)}
                            className={`w-full flex items-center h-full ${
                                isSidebarOpen ? "px-4" : "px-3"
                            } rounded-lg transition-colors ${
                                item.textColor || "text-third"
                            } hover:bg-gray-700/30`}
                        >
                            <Icon
                                icon={item.icon}
                                width="24"
                                height="24"
                                className={item.iconColor || "text-third"}
                            />

                            {isSidebarOpen && (
                                <span
                                    className={`ml-4 font-medium ${
                                        item.textColor || "text-third"
                                    }`}
                                >
                                    {item.name}
                                </span>
                            )}

                            {!isSidebarOpen && hoveredItem === item.name && (
                                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
                                    {item.name}
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
