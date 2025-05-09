import React, { useState } from "react";
import "./Signup.css";
import SignupPageSVG from "../../assets/images/Login&Signup BG.svg";
import LogoSVG from "../../assets/images/Login&Signup Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

export default function DoctorSignup() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .required("First name is required")
            .matches(
                /^[A-Za-z]{3,}$/,
                "First name must be at least 3 letters and contain only alphabetic characters."
            ),
        lastName: Yup.string()
            .required("Last name is required")
            .matches(
                /^[A-Za-z]{3,}$/,
                "Last name must be at least 3 letters and contain only alphabetic characters."
            ),
        phoneNumber: Yup.string()
            .required("Phone number is required")
            .matches(
                /^(\+20|0)?1\d{9}$/,
                "Phone number must be a valid Egyptian number (e.g., +201063361951 or 01063361951)."
            ),
        email: Yup.string()
            .required("Email is required")
            .email("Please enter a valid email address."),
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
        specializtion: Yup.string().required("Specialization is required"),
        bio: Yup.string()
            .required("Description is required")
            .max(150, "Description must be 150 characters or less"),
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            specializtion: "",
            bio: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await axios.post(
                    "https://careview.runasp.net/api/Account/RegisterDoctor",
                    {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        phoneNumber: values.phoneNumber,
                        password: values.password,
                        confirmPassword: values.confirmPassword,
                        specializtion: values.specializtion,
                        bio: values.bio,
                    }
                );

                toast.success("Signed up successfully", {
                    position: "bottom-right",
                    duration: 2000,
                });

                navigate("/login");
            } catch (error) {
                console.error(
                    "Signup failed:",
                    error.response?.data || error.message
                );
                const errorMessage =
                    error.response?.data?.message ||
                    (error.response?.data?.errors
                        ? Object.values(error.response.data.errors).join(" ")
                        : "Registration failed");

                toast.error(errorMessage, {
                    position: "bottom-right",
                    duration: 5000,
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex bg-bg">
            {/* Left Column - Decorative Image */}
            <div
                className="flex-1 bg-cover bg-center w-full m-4 rounded-lg hidden lg:block"
                style={{ backgroundImage: `url(${SignupPageSVG})` }}
                aria-hidden="true"
            />

            {/* Right Column - Form Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-3xl w-full space-y-2 p-6 md:p-10 rounded-lg">
                    {/* Logo Section */}
                    <div className="flex justify-start items-center">
                        <img
                            src={LogoSVG}
                            className="w-10 h-10 mr-2"
                            alt="CareView logo"
                        />
                        <h1 className="text-2xl font-bold textPrimary">
                            CareView
                        </h1>
                    </div>

                    {/* Form Header */}
                    <div>
                        <h2 className="mt-5 text-3xl font-bold textPrimary">
                            Create your account
                        </h2>
                    </div>

                    {/* Main Form */}
                    <form
                        className="mt-8 space-y-6"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="rounded-md shadow-sm flex flex-col gap-4">
                            {/* Name Fields */}
                            <div className="flex md:flex-row gap-4 flex-col">
                                {/* First Name Field */}
                                <div className="md:w-1/2 w-full">
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-medium textPrimary mb-2"
                                    >
                                        First name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                                            formik.touched.firstName &&
                                            formik.errors.firstName
                                                ? "border-red-500"
                                                : "border-borderSec"
                                        } textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 transition-all focus:z-10 sm:text-sm`}
                                        placeholder="Youssef"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.firstName &&
                                        formik.errors.firstName && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.firstName}
                                            </p>
                                        )}
                                </div>

                                {/* Last Name Field */}
                                <div className="md:w-1/2 w-full">
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-medium textPrimary mb-2"
                                    >
                                        Last name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                                            formik.touched.lastName &&
                                            formik.errors.lastName
                                                ? "border-red-500"
                                                : "border-borderSec"
                                        } textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 transition-all focus:z-10 sm:text-sm`}
                                        placeholder="Lawendy"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.lastName &&
                                        formik.errors.lastName && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formik.errors.lastName}
                                            </p>
                                        )}
                                </div>
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label
                                    htmlFor="phoneNumber"
                                    className="block text-sm font-medium textPrimary mb-2"
                                >
                                    Phone number
                                </label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    autoComplete="tel"
                                    className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                                        formik.touched.phoneNumber &&
                                        formik.errors.phoneNumber
                                            ? "border-red-500"
                                            : "border-borderSec"
                                    } textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 transition-all focus:z-10 sm:text-sm`}
                                    placeholder="01063361951"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.phoneNumber &&
                                    formik.errors.phoneNumber && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.phoneNumber}
                                        </p>
                                    )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium textPrimary mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                                        formik.touched.email &&
                                        formik.errors.email
                                            ? "border-red-500"
                                            : "border-borderSec"
                                    } textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 transition-all focus:z-10 sm:text-sm`}
                                    placeholder="Example@example.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.email}
                                        </p>
                                    )}
                            </div>

                            {/* Password Field with Toggle */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium textPrimary mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
                                        className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                                            formik.touched.password &&
                                            formik.errors.password
                                                ? "border-red-500"
                                                : "border-borderSec"
                                        } textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 transition-all focus:z-10 sm:text-sm pr-10`}
                                        placeholder="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        <Icon
                                            icon={
                                                showPassword
                                                    ? "bxs:hide"
                                                    : "mdi:show"
                                            }
                                            width="20"
                                            height="20"
                                            className="text-gray-500"
                                        />
                                    </button>
                                </div>
                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.password}
                                        </p>
                                    )}
                            </div>

                            {/* Confirm Password Field with Toggle */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium textPrimary mb-2"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                                            formik.touched.confirmPassword &&
                                            formik.errors.confirmPassword
                                                ? "border-red-500"
                                                : "border-borderSec"
                                        } textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 transition-all focus:z-10 sm:text-sm pr-10`}
                                        placeholder="Re-enter password"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        <Icon
                                            icon={
                                                showConfirmPassword
                                                    ? "bxs:hide"
                                                    : "mdi:show"
                                            }
                                            width="20"
                                            height="20"
                                            className="text-gray-500"
                                        />
                                    </button>
                                </div>
                                {formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.confirmPassword}
                                        </p>
                                    )}
                            </div>

                            {/* Specialization Field */}
                            <div>
                                <label
                                    htmlFor="specializtion"
                                    className="block text-sm font-medium textPrimary mb-2"
                                >
                                    Specialization
                                </label>
                                <input
                                    id="specializtion"
                                    name="specializtion"
                                    type="text"
                                    className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                                        formik.touched.specializtion &&
                                        formik.errors.specializtion
                                            ? "border-red-500"
                                            : "border-borderSec"
                                    } textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 transition-all focus:z-10 sm:text-sm`}
                                    placeholder="Physical therapy"
                                    value={formik.values.specializtion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.specializtion &&
                                    formik.errors.specializtion && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.specializtion}
                                        </p>
                                    )}
                            </div>

                            {/* Bio Field */}
                            <div>
                                <label
                                    htmlFor="bio"
                                    className="block text-sm font-medium textPrimary mb-2"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={3}
                                    className={`appearance-none relative block w-full px-4 py-3 border-2 ${
                                        formik.touched.bio && formik.errors.bio
                                            ? "border-red-500"
                                            : "border-borderSec"
                                    } textPrimary bg-transparent rounded-lg focus:outline-none focus:border-secondary focus:bg-white focus:bg-opacity-40 transition-all focus:z-10 sm:text-sm`}
                                    placeholder="Relieve pain, move better, strengthen yourself"
                                    value={formik.values.bio}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.bio && formik.errors.bio && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {formik.errors.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                    isSubmitting
                                        ? "bg-gray-400"
                                        : "bg-secondary hover:bg-third"
                                } transition-colors`}
                            >
                                {isSubmitting ? "Signing up..." : "Sign up"}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="text-center text-lg font-medium textPrimary">
                        <span className="textPrimary">
                            Have an account?{" "}
                            <Link
                                to="/login"
                                className="textPrimary text_und hover:text-secondary transition-colors"
                            >
                                Login Here
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
