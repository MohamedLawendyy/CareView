import React, { useContext } from "react";
import ForgetPassSVG from "../../assets/images/Login&Signup BG.svg";
import LogoSVG from "../../assets/images/Login&Signup Logo.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function CheckYourMail() {
    const {checkMail} = useContext(AuthContext);
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Get the email from location state (passed from ForgetPassword page)
    const location = useLocation();
    const email = location.state?.email || "youremail@example.com"; // Fallback email

    // Handle "Continue" button click
    const handleContinue = () => {
        // Navigate to the login page or another appropriate page
        navigate("/resetpassword");
    };

    // Handle "Resend Link" button click
    const handleResendLink = () => {
        // Add logic to resend the password reset link
        console.log("Resending password reset link to:", email);
        // Optionally, show a success message or handle errors
    };

    return (
        <>
            <div className="min-h-screen flex bg-bg">
                {/* Left Column for Content */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-3xl w-full space-y-8 p-10 rounded-lg">
                        {/* CareView logo */}
                        <div className="flex justify-start items-center">
                            <img
                                src={LogoSVG}
                                className="w-10 h-10 mr-2"
                                alt="logo"
                            />
                            <h1 className="text-2xl font-bold textPrimary">
                                CareView
                            </h1>
                        </div>
                        {/* Header */}
                        <div>
                            <h2 className="mt-6 text-3xl font-extrabold textPrimary">
                                Password reset link sent to{" "}
                                <div className="text-2xl font-bold textPrimary lowercase">
                                    {checkMail}
                                </div>
                            </h2>
                        </div>
                        {/* Continue Button */}
                        <div>
                            <button
                                type="button" // Use type="button" to prevent form submission
                                onClick={handleContinue}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-third"
                            >
                                Continue
                            </button>
                        </div>
                        {/* Resend Link Section */}
                        <div className="text-center text-lg font-medium textPrimary">
                            <span className="textPrimary">
                                Didn't receive the email?{" "}
                                <button
                                    onClick={handleResendLink}
                                    className="textPrimary text_und ms-1 focus:outline-none"
                                >
                                    Resend the link
                                </button>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column for Image */}
                <div
                    className="flex-1 bg-cover bg-center w-full m-4 rounded-lg hidden lg:block"
                    style={{ backgroundImage: `url(${ForgetPassSVG})` }}
                ></div>
            </div>
        </>
    );
}
