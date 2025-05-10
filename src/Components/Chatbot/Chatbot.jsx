import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
// import axios from 'axios'; // Uncomment when using APIs

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your CareView virtual assistant.", sender: "bot" },
        {
            text: "I can help with medical information, appointments, and health questions.",
            sender: "bot",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const toggleChatbot = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(scrollToBottom, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    /* 
    // UNCOMMENT THIS WHEN USING API
    const fetchBotResponse = async (userMessage) => {
        try {
            const response = await axios.post('https://your-dotnet-api-endpoint.com/api/chatbot', {
                message: userMessage,
                // Include any additional context if needed
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication headers if required
                }
            });
            return response.data.response;
        } catch (error) {
            console.error('Error fetching bot response:', error);
            return "Sorry, I'm having trouble connecting to the server. Please try again later.";
        }
    };
    */

    const handleSend = () => {
        if (inputValue.trim()) {
            // Add user message immediately
            const newMessage = { text: inputValue, sender: "user" };
            setMessages([...messages, newMessage]);
            setInputValue("");
            setIsBotTyping(true);

            /* 
            // UNCOMMENT THIS WHEN USING API
            fetchBotResponse(inputValue).then(botResponse => {
                setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
                setIsBotTyping(false);
            }).catch(error => {
                setMessages(prev => [...prev, { 
                    text: "Sorry, I encountered an error. Please try again.", 
                    sender: "bot" 
                }]);
                setIsBotTyping(false);
            });
            */

            // COMMENT THIS DOWN CODE WHEN USING API
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        text: "Thanks for your message! How else can I help?",
                        sender: "bot",
                    },
                ]);
                setIsBotTyping(false);
            }, 1500);
            // COMMENT THIS ABOVE CODE WHEN USING API
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-32 right-6 z-40 w-96 h-[32rem] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200">
                    {/* Header */}
                    <div className="bg-third text-white p-4 flex justify-between items-center">
                        <h2 className="font-bold">CareView Assistant</h2>
                        <button
                            onClick={toggleChatbot}
                            className="text-white hover:text-gray-200"
                        >
                            <Icon
                                icon="iconamoon:close-bold"
                                width="24"
                                height="24"
                            />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div
                        className="flex-1 overflow-y-auto p-4 relative"
                        ref={chatContainerRef}
                    >
                        <div className="space-y-2 pr-2">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.sender === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <p
                                        className={`p-3 rounded-lg max-w-[80%] ${
                                            message.sender === "user"
                                                ? "bg-third text-white"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        {message.text}
                                    </p>
                                </div>
                            ))}
                            {isBotTyping && (
                                <div className="flex justify-start">
                                    <div className="p-3 rounded-lg bg-gray-100 max-w-[80%] flex space-x-1">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                            style={{ animationDelay: "0.4s" }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-white p-4 border-t">
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
                                disabled={isBotTyping}
                                className="bg-third hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Icon icon="mdi:send" width="20" height="20" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            CareView AI assistant - Providing medical
                            information only
                        </p>
                    </div>
                </div>
            )}
            <button
                onClick={toggleChatbot}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-third text-white shadow-lg hover:bg-secondary transition-all duration-300 flex items-center justify-center ${
                    isOpen ? "transform rotate-45" : ""
                }`}
            >
                <Icon icon="mingcute:ai-fill" width="32" height="32" />
            </button>
        </>
    );
};

export default Chatbot;
