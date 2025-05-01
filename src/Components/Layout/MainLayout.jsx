// src/Components/Layout/MainLayout.jsx
import React, { useState } from "react";
import UserSidebar from "../UserSidebar/UserSidebar.jsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-bg w-full">
            {/* Sidebar */}
            <UserSidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Content Area */}
            <main
                className={`flex-1 min-h-screen transition-all duration-300 overflow-x-hidden ${
                    isSidebarOpen ? "ml-64" : "ml-20"
                }`}
            >
                <div className="w-full max-w-[1800px] mx-auto">
                    <Outlet></Outlet>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
