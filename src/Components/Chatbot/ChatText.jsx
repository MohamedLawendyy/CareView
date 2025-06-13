import React, { useState, useEffect } from "react";
// import axios from 'axios'; // Uncomment when using APIs

const ChatText = ({ scrollToBottom }) => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your CareView virtual assistant.", sender: "bot" },
        {
            text: "I can help with medical information, appointments, and health questions.",
            sender: "bot",
        },
    ]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleSend = () => {
        if (inputValue.trim()) {
            const newMessage = { text: inputValue, sender: "user" };
            setMessages([...messages, newMessage]);
            setInputValue("");
            
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        text: "I'm a demo bot. In a real app, I'd respond to your message.",
                        sender: "bot",
                    },
                ]);
            }, 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-2">
                How can I help you today?
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
                {messages.map((message, index) => (
                    <p
                        key={index}
                        className={`p-3 rounded-lg max-w-[80%] ${
                            message.sender === "user"
                                ? "ml-auto bg-third text-white"
                                : "bg-gray-100"
                        }`}
                    >
                        {message.text}
                    </p>
                ))}
            </div>

            <div className="sticky bottom-0 bg-white pt-2 pb-1">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your health question..."
                        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-third hover:bg-third-dark text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Send
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    CareView AI assistant - Providing medical information only
                </p>
            </div>
        </div>
    );
};

export default ChatText;
