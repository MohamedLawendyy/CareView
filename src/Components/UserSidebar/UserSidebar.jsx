import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoSVG from "../../assets/images/Login&Signup Logo.svg";

export default function UserSidebar({ isSidebarOpen, toggleSidebar }) {
    const [activeSection, setActiveSection] = useState("Home");
    const [hoveredSection, setHoveredSection] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();  // Use location to track current route

    const mainSections = [
        { name: "Home", icon: "tabler:home-filled", path: "/home" },
        { name: "My Diagnoses", icon: "tabler:clipboard-text-filled", path: "/my-diagnoses" },
        { name: "Pharmacy", icon: "healthicons:pharmacy-24px", path: "/pharmacy" },
        { name: "Post Treatment", icon: "ic:baseline-monitor-heart", path: "/post-treatment" },
        { name: "Help & Support", icon: "mdi:help-circle", path: "/help-support" },
        { name: "Settings", icon: "mdi:cog", path: "/settings" },
    ];

    const bottomSections = [
        {
            name: "Logout",
            icon: "majesticons:logout",
            textColor: "text-red-600",
            iconColor: "text-red-600",
            isLogout: true,
            alignLeft: true,
        },
        {
            name: "Upload Your X-Ray",
            icon: "ic:round-upload",
            outline: "outline-4 outline-dashed outline-black",
            bgColor: "bg-third",
            iconColor: "text-white",
            isUpload: true,
            iconSize: 32,
            containerSizeClosed: "h-12 w-12",
        },
    ];

    const handleLogout = () => {
        // Show confirmation dialog
        if (!window.confirm("Are you sure you want to log out?")) {
            return;
        }

        // Clear authentication data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");

        // Clear any state management (if using context/redux)
        // dispatch({ type: "LOGOUT" });

        // Show success toast
        toast.success("Logged out successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        // Navigate to landing page after a short delay
        setTimeout(() => {
            navigate("/LandPage");
        }, 500);
    };

    const handleNavigation = (sectionName) => {
        const routes = {
            Home: "/home",
            "My Diagnoses": "/my-diagnoses",
            Pharmacy: "/pharmacy",
            "Post Treatment": "/post-treatment",
            "Help & Support": "/help-support",
            Settings: "/settings",
        };

        if (sectionName === "Logout") {
            handleLogout();
            return;
        }

        if (routes[sectionName]) {
            navigate(routes[sectionName]);
            setActiveSection(sectionName);
        }
    };

    useEffect(() => {
        // Update active section based on current route
        const currentPath = location.pathname;

        const matchedSection = mainSections.find(
            (section) => section.path === currentPath
        );

        if (matchedSection) {
            setActiveSection(matchedSection.name);
        }
    }, [location.pathname]);  // Runs when the location changes

    return (
        <div
            className={`bg-primary text-textPrimary ${isSidebarOpen ? "w-64" : "w-20"} py-7 px-2 fixed inset-y-0 left-0 transition-all duration-300 ease-in-out flex flex-col z-50`}
        >
            {/* Logo and Toggle Section */}
            <div className="relative px-4 mb-12">
                <div className="flex items-center">
                    <img src={LogoSVG} className="w-8 h-8" alt="logo" />
                    <span
                        className={`text-xl font-extrabold text-secondary ml-2 transition-all duration-300 ${
                            isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
                        }`}
                    >
                        CareView
                    </span>
                </div>

                <button
                    onClick={toggleSidebar}
                    className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-secondary border-2 border-primary text-white hover:bg-secondary/90 transition-all duration-200 shadow-md z-10"
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

                {!isSidebarOpen && (
                    <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Toggle Sidebar
                    </div>
                )}
            </div>

            {/* Main Navigation Links */}
            <nav className="space-y-2 flex-1">
                {mainSections.map((section) => (
                    <div
                        key={section.name}
                        className="relative h-12"
                        onMouseEnter={() => setHoveredSection(section.name)}
                        onMouseLeave={() => setHoveredSection(null)}
                    >
                        <button
                            onClick={() => handleNavigation(section.name)}
                            className={`w-full text-left flex items-center h-full ${
                                isSidebarOpen ? "pl-4 pr-4" : "pl-4 pr-0"
                            } font-medium rounded-lg transition-colors duration-300 relative overflow-hidden ${
                                activeSection === section.name
                                    ? "bg-secondary"
                                    : "hover:bg-gray-700/30"
                            }`}
                        >
                            <div className="w-6 flex-shrink-0 flex justify-start">
                                <Icon
                                    icon={section.icon}
                                    width="24"
                                    height="24"
                                    className={`transition-colors duration-200 ${
                                        activeSection === section.name
                                            ? "text-white"
                                            : "text-third"
                                    }`}
                                />
                            </div>

                            <span
                                className={`transition-all duration-300 ${
                                    isSidebarOpen
                                        ? "ml-4 opacity-100 w-auto"
                                        : "ml-0 opacity-0 w-0"
                                } ${
                                    activeSection === section.name
                                        ? "text-white font-semibold"
                                        : "text-third hover:text-secondary"
                                }`}
                            >
                                {section.name}
                            </span>

                            {!isSidebarOpen && (
                                <div
                                    className={`absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 transition-opacity duration-200 whitespace-nowrap ${
                                        hoveredSection === section.name
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                >
                                    {section.name}
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </nav>

            {/* Bottom Sections - Upload X-Ray and Logout */}
            <div className="mt-auto pb-4 space-y-4">
                {bottomSections.map((section) => (
                    <div
                        key={section.name}
                        className={`relative ${
                            section.isUpload
                                ? isSidebarOpen
                                    ? "h-40 origin-top-left transition-all duration-300"
                                    : `${section.containerSizeClosed} origin-top-left transition-all duration-300`
                                : "h-12"
                        } ${
                            section.isUpload && !isSidebarOpen ? "mx-auto" : ""
                        }`}
                    >
                        <button
                            onClick={() => handleNavigation(section.name)}
                            className={`flex w-full ${
                                section.alignLeft
                                    ? "items-center"
                                    : isSidebarOpen && section.isUpload
                                    ? "flex-col items-center justify-center"
                                    : "items-center justify-center"
                            } h-full ${
                                isSidebarOpen
                                    ? "px-4"
                                    : section.alignLeft
                                    ? "pl-4 pr-0"
                                    : "px-0"
                            } font-medium rounded-lg transition-all duration-300 relative ${
                                section.outline || ""
                            } ${section.bgColor || ""}`}
                        >
                            <div
                                className={`flex items-center ${
                                    section.alignLeft
                                        ? "justify-start"
                                        : "justify-center"
                                } ${
                                    section.isUpload && isSidebarOpen
                                        ? "mb-4"
                                        : ""
                                }`}
                            >
                                <Icon
                                    icon={section.icon}
                                    width={section.iconSize || 24}
                                    height={section.iconSize || 24}
                                    className={`${section.iconColor} transition-colors duration-200`}
                                />
                            </div>

                            {isSidebarOpen || !section.isUpload ? (
                                <span
                                    className={`transition-all duration-300 ${
                                        section.alignLeft
                                            ? "ml-4"
                                            : isSidebarOpen && section.isUpload
                                            ? "mt-0"
                                            : ""
                                    } ${
                                        isSidebarOpen
                                            ? section.isUpload
                                                ? "text-center font-semibold text-lg text-white"
                                                : `${section.textColor} font-bold`
                                            : "ml-0 opacity-0 w-0"
                                    }`}
                                >
                                    {section.name}
                                </span>
                            ) : null}

                            {!isSidebarOpen && !section.isLogout && (
                                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 transition-opacity duration-200 whitespace-nowrap">
                                    {section.name}
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
