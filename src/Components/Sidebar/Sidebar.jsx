import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import LogoSVG from "../../assets/images/Login&Signup Logo.svg";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["home", "features", "about", "contact"];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.getBoundingClientRect().top <= 100) {
                    setActiveSection(section);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div
            className={`bg-primary text-textPrimary ${
                isSidebarOpen ? "w-64" : "w-20"
            } py-7 px-2 fixed inset-y-0 left-0 transition-all duration-300 ease-in-out flex flex-col z-50`}
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
            </div>

            {/* Sidebar Links */}
            <nav className="space-y-2 flex-1">
                {["home", "features", "about", "contact"].map((section) => (
                    <div key={section} className="relative h-12">
                        <button
                            onClick={() => handleClick(section)}
                            className={`w-full text-left flex items-center h-full ${
                                isSidebarOpen ? "pl-4 pr-4" : "pl-4 pr-0"
                            } font-medium rounded-lg transition-colors duration-300 relative overflow-hidden ${
                                activeSection === section
                                    ? "bg-secondary"
                                    : "hover:bg-gray-700/30"
                            }`}
                        >
                            <div className="w-6 flex-shrink-0 flex justify-start">
                                <Icon
                                    icon={
                                        section === "home"
                                            ? "tabler:home-filled"
                                            : section === "features"
                                            ? "solar:stars-bold-duotone"
                                            : section === "about"
                                            ? "clarity:group-solid"
                                            : "fluent:call-12-filled"
                                    }
                                    width="24"
                                    height="24"
                                    className={`transition-colors duration-200 ${
                                        activeSection === section
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
                                    activeSection === section
                                        ? "text-white font-semibold"
                                        : "text-third hover:text-secondary"
                                }`}
                            >
                                {section === "home"
                                    ? "Home"
                                    : section === "features"
                                    ? "Features"
                                    : section === "about"
                                    ? "About Us"
                                    : "Contact"}
                            </span>

                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                    {section === "home"
                                        ? "Home"
                                        : section === "features"
                                        ? "Features"
                                        : section === "about"
                                        ? "About Us"
                                        : "Contact"}
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </nav>
        </div>
    );
}
