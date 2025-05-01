import React from "react";
import LoginPageSVG from "../../assets/images/Login&Signup BG.svg";
import LogoSVG from "../../assets/images/Login&Signup Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
    const navigate = useNavigate();

    // Formik setup with Yup validation
    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters long")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                    "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
                ),
            confirmPassword: Yup.string()
                .required("Confirm password is required")
                .oneOf([Yup.ref("password"), null], "Passwords must match"),
        }),
        onSubmit: async (values) => {
            try {

                const response = await axios.post(
                    "http://localhost:5296/api/Account/ResetPassword",
                    {
                        password: values.password,
                        confirmPassword: values.confirmPassword,
                    }
                );

                // Handle successful password reset
                console.log("Password reset successful!", response.data);
                toast.success("Password reset successfully",{
                    position:"bottom-right",
                    duration: "500"
                })

                console.log("Navigating to login page...");
                navigate("/login");
            } catch (error) {
                console.error(
                    "Password reset failed:",
                    error.response?.data || error.message
                );
                toast.error(error.response.data.message,{
                    position:"bottom-right",
                    duration: "500",
                })
            }
        },
    });

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
                                Reset your password
                            </h2>
                            <h4 className="mt-2 text-xl font-medium textPrimary opacity-40">
                                Enter your new password
                            </h4>
                        </div>
                        {/* Reset Password form */}
                        <form
                            onSubmit={formik.handleSubmit}
                            className="mt-8 space-y-6"
                        >
                            <div className="rounded-md shadow-sm flex flex-col gap-4">
                                {/* Password Field */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium textPrimary mb-4"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        autoComplete="new-password"
                                        className="appearance-none relative block w-full px-4 py-3 border-2 border-borderSec textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 focus:z-10 sm:text-sm"
                                        placeholder="Enter password"
                                    />
                                    {formik.touched.password &&
                                        formik.errors.password && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.password}
                                            </p>
                                        )}
                                </div>
                                {/* Confirm Password Field */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium textPrimary mb-4"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        autoComplete="new-password"
                                        className="appearance-none relative block w-full px-4 py-3 border-2 border-borderSec textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 focus:z-10 sm:text-sm"
                                        placeholder="Confirm password"
                                    />
                                    {formik.touched.confirmPassword &&
                                        formik.errors.confirmPassword && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.confirmPassword}
                                            </p>
                                        )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-third"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column for Image */}
                <div
                    className="flex-1 bg-cover bg-center w-full m-4 rounded-lg hidden lg:block"
                    style={{ backgroundImage: `url(${LoginPageSVG})` }}
                ></div>
            </div>
        </>
    );
}
