// src/Components/Layout/MainLayout.jsx
import React, { useState } from "react";
import UserSidebar from "../UserSidebar/UserSidebar.jsx";
import { Outlet } from "react-router-dom";
import Notifications from "../Notifications/Notifications.jsx";
import Chatbot from "../Chatbot/Chatbot.jsx";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return <>

        <div className="fixed -top-2.5 right-0 m-5 z-50">
            <Notifications />
        </div>
        <Chatbot />

        <div className="flex min-h-screen bg-bg w-full">
            {/* Sidebar */}
            <UserSidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Content Area */}
            <main
                className={`flex-1 min-h-screen transition-all duration-300 overflow-x-hidden ${isSidebarOpen ? "ml-64" : "ml-20"
                    }`}
            >
                <div className="w-full max-w-full mx-auto">
                    <Outlet></Outlet>
                </div>
            </main>
        </div>
    </>
};

export default MainLayout;
