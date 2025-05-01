import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../Sidebar/Sidebar.jsx";
import BGImage from "../../assets/images/HeroSectionBG.svg";
import SkeletonImage from "../../assets/images/Skeleton.svg";
import WebsiteBG from "../../assets/images/WebsiteBG.svg";
import { Icon } from "@iconify/react/dist/iconify.js";
import LogoSVG from "../../assets/images/LogoWithName.svg";
import Footer from "../Footer/Footer.jsx";

// Constants
const FEATURES = [
    {
        icon: "mdi:x-ray-box",
        title: "AI-Powered X-ray Analysis",
        description:
            "Upload X-ray images and receive instant AI-driven diagnoses and treatment recommendations.",
    },
    {
        icon: "healthicons:pharmacy-24px",
        title: "Smart Pharmacy Finder",
        description:
            "Find nearby pharmacies by location, medicine availability, 24/7 service, user reviews, and stock updates.",
    },
    {
        icon: "ic:baseline-monitor-heart",
        title: "Post-Treatment Monitoring",
        description:
            "Upload physical therapy videos, track progress, and receive real-time feedback on movement accuracy.",
    },
    {
        icon: "solar:jar-of-pills-bold",
        title: "Personalized Treatment",
        description:
            "AI-driven recommendations tailored to each patient's condition.",
    },
    {
        icon: "tabler:shield-check-filled",
        title: "Secure & Compliant",
        description:
            "We prioritize patient data security, ensuring compliance with medical privacy regulations.",
    },
];

const WHY_CHOOSE_US = [
    {
        icon: "healthicons:artificial-intelligence",
        title: "AI-Powered Diagnoses",
        description: "Instant, accurate medical insights",
    },
    {
        icon: "ic:baseline-monitor-heart",
        title: "Post-Treatment Monitoring",
        description: "AI-driven progress tracking",
    },
    {
        icon: "healthicons:pharmacy-24px",
        title: "Smart Pharmacy Finder",
        description: "Find 24/7 pharmacies with real-time stock updates",
    },
    {
        icon: "tabler:shield-check-filled",
        title: "Secure & Compliant",
        description: "HIPAA & GDPR protected for full privacy",
    },
];

const PARTNERS = ["Partner 1", "Partner 2", "Partner 3"];

// Components
const FeatureCard = ({ icon, title, description }) => (
    <motion.div whileHover={{ y: -5 }} className="flex justify-center h-full">
        <div className="bg-primary rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-150 w-full group h-full flex flex-col">
            <div className="p-6 text-center flex-grow">
                <div className="bg-primary rounded-full mb-4 mx-auto w-32 h-32 flex items-center justify-center group-hover:bg-third transition-all duration-150">
                    <div className="border-4 border-third w-24 h-24 rounded-full flex items-center justify-center group-hover:border-primary transition-all duration-150">
                        <Icon
                            icon={icon}
                            width="60"
                            height="60"
                            className="text-third mx-auto group-hover:text-primary transition-all duration-150"
                            aria-hidden="true"
                        />
                    </div>
                </div>
                <h3 className="text-3xl font-extrabold mb-2 text-third">
                    {title}
                </h3>
                <p className="text-third text-xl mt-3">{description}</p>
            </div>
        </div>
    </motion.div>
);

const SectionHeader = ({ title, subtitle, className = "" }) => (
    <div className={`text-center mb-16 ${className}`}>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h2>
        {subtitle && (
            <p className="text-xl font-bold max-w-3xl mx-auto">{subtitle}</p>
        )}
    </div>
);

const WhyChooseUsCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 h-full"
    >
        <div className="mb-4 flex justify-center">
            <Icon
                icon={icon}
                className="text-5xl text-secondary"
                width="48"
                height="48"
                aria-hidden="true"
            />
        </div>
        <h4 className="text-xl font-semibold mb-2 text-center">{title}</h4>
        <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
);

export default function LandPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        description: "",
    });

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
        // Add your form submission logic here
    };

    return (
        <div className="flex min-h-screen bg-bg">
            {/* Sidebar */}
            <div
                className={`transition-all duration-300 ${
                    isSidebarOpen ? "w-10" : "w-20"
                }`}
            >
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 bg-WebsiteBG bg-contain transition-all duration-300 ${
                    isSidebarOpen ? "ml-52" : "ml-0"
                }`}
            >
                {/* Home Section */}
                <section id="home" className="mb-8 mt-0 p-8">
                    {/* Hero Section */}
                    <div className="bg-secondary text-bg p-12 rounded-lg relative overflow-hidden lg:overflow-visible min-h-[50vh] flex items-start">
                        {/* Background Image */}
                        <img
                            src={BGImage}
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                            alt="background"
                            loading="lazy"
                            width={1920}
                            height={1080}
                        />

                        {/* Skeleton Image Floating on the Right */}
                        <div className="absolute right-0 top-0 lg:h-[150%] opacity-[20%] lg:opacity-100 flex items-center translate-y-[10%]">
                            <img
                                src={SkeletonImage}
                                className="h-full w-auto"
                                alt="Skeleton"
                                loading="lazy"
                                width={600}
                                height={800}
                            />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10">
                            {/* Main Heading */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 lg:mb-12 w-full lg:w-2/3">
                                Welcome to CareView: The Future of Smart
                                Healthcare
                            </h1>

                            {/* Subheading */}
                            <p className="mb-12 lg:mb-28 text-lg md:text-xl lg:text-2xl font-medium w-full lg:w-2/3">
                                An intelligent medical platform designed to
                                assist doctors and patients in diagnosing,
                                recommending treatments, and monitoring
                                recovery.
                            </p>

                            {/* Call to Action */}
                            <p className="text-xl font-bold mb-20">
                                Ready to experience the future of medical AI?
                                <span className="block">
                                    Login now and transform the way healthcare
                                    is delivered!
                                </span>
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Login Button */}
                                <Link
                                    to="/login"
                                    className="bg-bg text-secondary px-8 py-4 sm:px-20 sm:py-5 rounded-lg font-bold text-lg sm:text-xl text-center"
                                    aria-label="Login to CareView"
                                >
                                    Login
                                </Link>

                                {/* Sign Up Button */}
                                <Link
                                    to="/signup"
                                    className="bg-transparent text-bg border-bg border-2 rounded-lg px-8 py-4 sm:px-20 sm:py-5 font-bold text-lg sm:text-xl hover:bg-bg hover:text-secondary transition duration-300 text-center"
                                    aria-label="Sign up for CareView"
                                >
                                    Sign Up
                                </Link>
                            </div>

                            {/* Footer Note */}
                            <p className="mt-28 text-lg font-light">
                                Powered by AI
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="relative pt-8 pb-20">
                    <div className="px-8 my-8">
                        <SectionHeader
                            title="Our Powerful Features"
                            subtitle="Discover how CareView revolutionizes healthcare with AI-powered solutions"
                            className="text-third"
                        />

                        {/* First Row (2 cards + empty space) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 mb-8">
                            {/* Card 1 */}
                            <div className="md:col-span-1">
                                <FeatureCard {...FEATURES[0]} />
                            </div>

                            {/* Card 2 */}
                            <div className="md:col-span-1">
                                <FeatureCard {...FEATURES[1]} />
                            </div>

                            {/* Empty space for skeleton leg */}
                            <div className="hidden md:block md:col-span-1"></div>
                        </div>

                        {/* Second Row (3 cards) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                            {FEATURES.slice(2).map((feature, index) => (
                                <div key={index} className="md:col-span-1">
                                    <FeatureCard {...feature} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="mb-8 mt-0 p-8">
                    <div className="bg-secondary text-bg p-12 rounded-lg relative overflow-hidden min-h-[50vh]">
                        <img
                            src={BGImage}
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                            alt="background"
                            loading="lazy"
                            width={1920}
                            height={1080}
                        />
                        <div className="relative z-10 max-w-6xl mx-auto">
                            {/* Who We Are */}
                            <SectionHeader
                                title="Who We Are"
                                subtitle="Revolutionizing healthcare with AI-powered X-ray diagnostics, personalized hospital & pharmacy recommendations, and seamless post-treatment monitoring."
                                className="text-white"
                            />

                            {/* Our Mission */}
                            <div className="mb-16 p-8 bg-white bg-opacity-90 rounded-xl backdrop-blur-sm">
                                <h3 className="text-3xl font-bold mb-6 text-center text-secondary">
                                    Our Mission
                                </h3>
                                <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center">
                                    Empowering doctors and patients with
                                    cutting-edge AI tools for faster, more
                                    accurate diagnoses and highly personalized
                                    treatment guidance.
                                </p>
                            </div>

                            {/* Why Choose Us? */}
                            <div className="mb-16">
                                <h3 className="text-3xl font-bold mb-8 text-center text-white">
                                    Why Choose Us?
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {WHY_CHOOSE_US.map((item, index) => (
                                        <WhyChooseUsCard
                                            key={index}
                                            {...item}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Our Partners */}
                            <div className="text-center">
                                <h3 className="text-3xl font-bold mb-8 text-white">
                                    Our Partners
                                </h3>
                                <p className="text-lg text-gray-100 mb-8">
                                    Trusted by top healthcare institutions.
                                </p>
                                <div className="flex flex-wrap justify-center gap-8">
                                    {PARTNERS.map((partner, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.05 }}
                                            className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg w-40 h-24 flex items-center justify-center shadow-md"
                                        >
                                            <span className="font-bold text-gray-700">
                                                {partner}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section
                    id="contact"
                    className="mb-8 p-8 w-full lg:w-3/4 mx-auto"
                >
                    <SectionHeader
                        title="Contact Us"
                        subtitle="We're here to help with any questions"
                        className="text-secondary"
                    />

                    <div className="mx-auto flex flex-col md:flex-row gap-8 items-center">
                        {/* Logo on Left (shown on medium+ screens) */}
                        <div className="hidden md:block">
                            <img
                                src={LogoSVG}
                                className="w-48 h-48"
                                alt="Company Logo"
                                loading="lazy"
                                width={192}
                                height={192}
                            />
                        </div>

                        {/* Contact Form */}
                        <div className="flex-1 bg-primary p-8 rounded-xl shadow-md">
                            <form onSubmit={handleSubmit}>
                                {/* Name Field */}
                                <div className="mb-6">
                                    <label
                                        htmlFor="name"
                                        className="block text-base font-bold text-secondary mb-2"
                                    >
                                        Enter Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-third focus:outline-none transition-all text-primary"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="mb-6">
                                    <label
                                        htmlFor="email"
                                        className="block text-base font-bold text-secondary mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-third focus:outline-none transition-all text-primary"
                                        placeholder="example@company.com"
                                        required
                                    />
                                </div>

                                {/* Description Field */}
                                <div className="mb-8">
                                    <label
                                        htmlFor="description"
                                        className="block text-base font-bold text-secondary mb-2"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-third focus:outline-none transition-all text-primary"
                                        placeholder="Tell us how we can help you"
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-third transition-colors"
                                    aria-label="Submit contact form"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
