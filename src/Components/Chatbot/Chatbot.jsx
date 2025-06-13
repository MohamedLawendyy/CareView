import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";

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

    async function SendMessage(userMessage) {
        try {
            const response = await axios.post(
                "https://careview.runasp.net/api/Chat/ask-bot",
                {
                    user_input: userMessage,
                    conversation_history: [
                        {
                            user: "string",
                            bot: "string",
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "userToken"
                        )}`,
                    },
                }
            );
            return response.data.bot_response;
        } catch (error) {
            console.error("Error fetching bot response:", error);
            return "Sorry, I'm having trouble connecting to the server. Please try again later.";
        }
    }

    async function handleSend() {
        if (inputValue.trim()) {
            const newMessage = { text: inputValue, sender: "user" };
            setMessages([...messages, newMessage]);
            setInputValue("");
            setIsBotTyping(true);

            SendMessage(inputValue)
                .then((botResponse) => {
                    setMessages((prev) => [
                        ...prev,
                        { text: botResponse, sender: "bot" },
                    ]);
                    setIsBotTyping(false);
                })
                .catch((error) => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            text: "Sorry, I encountered an error. Please try again.",
                            sender: "bot",
                        },
                    ]);
                    setIsBotTyping(false);
                });
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    const formatBotMessage = (text) => {
        // Split into sections based on double newlines
        const sections = text.split("\n\n");

        return sections.map((section, sectionIndex) => {
            // Handle reference section
            if (section.startsWith("Reference:")) {
                return (
                    <div
                        key={`ref-${sectionIndex}`}
                        className="mt-3 text-xs italic text-gray-600"
                    >
                        {section.replace(/\*/g, "")}
                    </div>
                );
            }

            // Handle recommendation sections
            if (section.includes("recommend:") || section.startsWith("- ")) {
                const lines = section.split("\n").filter((line) => line.trim());
                return (
                    <div key={`rec-${sectionIndex}`} className="space-y-2">
                        {lines.map((line, lineIndex) => {
                            if (line.startsWith("- ")) {
                                const [title, ...descParts] = line.split(":");
                                const description = descParts.join(":").trim();
                                return (
                                    <div
                                        key={`line-${lineIndex}`}
                                        className="pl-2"
                                    >
                                        <div className="font-medium">
                                            • {title.substring(2).trim()}
                                        </div>
                                        {description && (
                                            <div className="ml-4 mt-1 text-gray-700">
                                                {description}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <p
                                    key={`intro-${lineIndex}`}
                                    className="font-medium"
                                >
                                    {line}
                                </p>
                            );
                        })}
                    </div>
                );
            }

            // Default text formatting
            return (
                <p key={`text-${sectionIndex}`} className="my-2">
                    {section
                        .split("**")
                        .map((segment, i) =>
                            i % 2 === 1 ? (
                                <strong key={i}>{segment}</strong>
                            ) : (
                                segment
                            )
                        )}
                </p>
            );
        });
    };

    const formatMessage = (text, sender) => {
        if (sender === "bot") {
            return (
                <div className="text-sm break-words">
                    {formatBotMessage(text)}
                </div>
            );
        }

        // User message formatting
        return (
            <div className="text-sm break-words">
                {text.split("\n").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                        {line.split(" ").map((word, wordIndex) =>
                            /\bhttps?:\/\/[^\s]+/.test(word) ? (
                                <a
                                    key={wordIndex}
                                    href={word}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:underline"
                                >
                                    {word}
                                </a>
                            ) : (
                                <span key={wordIndex}> {word} </span>
                            )
                        )}
                        {lineIndex < text.split("\n").length - 1 && <br />}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-40 w-96 h-[32rem] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200">
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
                                    <div
                                        className={`p-3 rounded-lg max-w-[80%] ${
                                            message.sender === "user"
                                                ? "bg-third text-white"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        {formatMessage(
                                            message.text,
                                            message.sender
                                        )}
                                    </div>
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
                                onClick={() => handleSend()}
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
