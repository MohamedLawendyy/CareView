import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const ChatbotButton = ({ onClick, isOpen }) => {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-third text-white shadow-lg hover:bg-secondary transition-all duration-300 flex items-center justify-center ${
                isOpen ? "transform rotate-45" : ""
            }`}
            aria-label="Chatbot"
        >
            <Icon icon="mingcute:ai-fill" width="32" height="32" />
        </button>
    );
};

export default ChatbotButton;
