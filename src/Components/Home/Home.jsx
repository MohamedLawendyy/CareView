// src/Components/Home/Home.jsx
import React from "react";
import BGImage from "../../assets/images/HeroSectionBG.svg";
import SkeletonImage from "../../assets/images/Skeleton.svg";
import Footer from "../Footer/Footer.jsx";

export default function Home() {
    return (
        <div className="w-full">
            {/* Home Section */}
            <section id="home" className="mb-8 p-8 min-h-screen w-full">
                {/* Hero Section */}
                <div className="bg-secondary text-bg p-12 rounded-lg relative overflow-hidden lg:overflow-visible min-h-[50vh] flex items-start w-full">
                    <img
                        src={BGImage}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                        alt="background"
                    />

                    <div className="absolute right-0 top-0 lg:h-[150%] opacity-[20%] lg:opacity-100 flex items-center translate-y-[10%]">
                        <img
                            src={SkeletonImage}
                            className="h-full w-auto"
                            alt="Skeleton"
                        />
                    </div>

                    <div className="relative z-10 w-full max-w-4xl">
                        <h1 className="text-5xl font-bold mb-12">
                            Welcome to CareView: The Future of Smart Healthcare
                        </h1>
                        <p className="mb-20 text-2xl font-medium">
                            An intelligent medical platform designed to assist
                            doctors and patients in diagnosing, recommending
                            treatments, and monitoring recovery
                        </p>
                        <p className="mt-10 text-lg font-light">
                            Powered by AI
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
