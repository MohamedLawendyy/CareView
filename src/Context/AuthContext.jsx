// src/Context/AuthContext.jsx
import React, { createContext, useState } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// AuthContextProvider component
const AuthContextProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [checkMail, setCheckMail] = useState(""); // Make sure you have checkMail and setCheckMail here

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <AuthContext.Provider
            value={{
                isSidebarOpen,
                toggleSidebar,
                user,
                setUser,
                checkMail,
                setCheckMail,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider; // Default export the provider
