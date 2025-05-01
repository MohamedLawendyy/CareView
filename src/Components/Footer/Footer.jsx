import React from "react";
import FooterLogo from "../../assets/images/Logo image.svg";
import { Icon } from "@iconify/react";

export default function Footer () {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <footer className="bg-primary text-secondary py-8 w-full">
            <div className="max-w-6xl mx-auto px-4">
                {/* Logo and Social */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center">
                        <img
                            src={FooterLogo}
                            className="h-16"
                            alt="CareView Logo"
                        />
                        <span className="text-2xl font-bold text-secondary">
                            CareView
                        </span>
                    </div>
                </div>

                {/* Navigation Links with Hover Underline */}
                <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 mb-8">
                    <button
                        onClick={() => scrollToSection("home")}
                        className="text-secondary hover:text-third transition-colors text-lg font-bold relative group"
                    >
                        Home
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-third transition-all duration-300 group-hover:w-full"></span>
                    </button>

                    <button
                        onClick={() => scrollToSection("features")}
                        className="text-secondary hover:text-third transition-colors text-lg font-bold relative group"
                    >
                        Features
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-third transition-all duration-300 group-hover:w-full"></span>
                    </button>

                    <button
                        onClick={() => scrollToSection("about")}
                        className="text-secondary hover:text-third transition-colors text-lg font-bold relative group"
                    >
                        About us
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-third transition-all duration-300 group-hover:w-full"></span>
                    </button>

                    <button
                        onClick={() => scrollToSection("contact")}
                        className="text-secondary hover:text-third transition-colors text-lg font-bold relative group"
                    >
                        Contact Us
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-third transition-all duration-300 group-hover:w-full"></span>
                    </button>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-4 mb-8">
                    <a
                        href="#"
                        className="w-16 h-16 bg-bg rounded-full flex items-center justify-center hover:text-third transition-colors"
                    >
                        <Icon
                            icon="fe:facebook"
                            width="32"
                            height="32"
                            className="text-4xl"
                        />
                    </a>
                    <a
                        href="#"
                        className="w-16 h-16 bg-bg rounded-full flex items-center justify-center hover:text-third transition-colors"
                    >
                        <Icon
                            icon="ant-design:instagram-filled"
                            width="32"
                            height="32"
                            className="text-4xl"
                        />
                    </a>
                    <a
                        href="#"
                        className="w-16 h-16 bg-bg rounded-full flex items-center justify-center hover:text-third transition-colors"
                    >
                        <Icon
                            icon="prime:twitter"
                            width="32"
                            height="32"
                            className="text-4xl"
                        />
                    </a>
                    <a
                        href="#"
                        className="w-16 h-16 bg-bg rounded-full flex items-center justify-center hover:text-third transition-colors"
                    >
                        <Icon
                            icon="mdi:linkedin"
                            width="32"
                            height="32"
                            className="text-4xl"
                        />
                    </a>
                </div>

                {/* Copyright Text */}
                <div className="text-center text-md text-secondary">
                    <p>
                        © 2024 CareView. All rights reserved The content of this
                        website is for healthcare and medical purposes only.
                    </p>
                </div>
            </div>
        </footer>
    );
};
