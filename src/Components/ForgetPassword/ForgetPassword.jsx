import React, { useContext, useState } from "react";
import ForgetPassSVG from "../../assets/images/Login&Signup BG.svg";
import LogoSVG from "../../assets/images/Login&Signup Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";

export default function ForgetPassword() {
    const { setCheckMail } = useContext(AuthContext); // Use setCheckMail from context
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = {};

        // Validate email
        if (!email.trim()) {
            validationErrors.email = "Email is required.";
        } else if (!emailRegex.test(email)) {
            validationErrors.email = "Please enter a valid email address.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            console.log("Form submitted successfully!", { email });
            navigate("/checkmail");
        }
    };

    return (
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
                            Forget your password!
                        </h2>
                    </div>
                    {/* Forget Password form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm flex flex-col gap-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium textPrimary mb-4"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setCheckMail(e.target.value); // Update checkMail in context
                                    }}
                                    required
                                    placeholder="Example@example.com"
                                    className="appearance-none relative block w-full px-4 py-3 border-2 border-borderSec textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 focus:z-10 sm:text-sm"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-third"
                            >
                                Continue
                            </button>
                        </div>
                    </form>
                    <div className="text-center text-lg font-medium textPrimary">
                        <span className="textPrimary">
                            Remember your password?{" "}
                            <Link
                                to={"/login"}
                                className="textPrimary text_und ms-1"
                            >
                                Login Here
                            </Link>
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
    );
}
