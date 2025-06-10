import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PaymentHistory from "./PaymentHistory";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

export default function History() {
    const token = localStorage.getItem("userToken");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [paymentPage, setPaymentPage] = useState(1);
    const itemsPerPage = 5; // Set to 5 items per page

    const {
        data: payments = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["userPayments"],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    "https://careview.runasp.net/api/Payment/GetPaymentsForUser",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                return response.data;
            } catch (error) {
                if (
                    error.response?.status === 404 ||
                    error.response?.status === 403
                ) {
                    return [];
                }
                if (error.response?.status === 401) {
                    navigate("/login");
                    return [];
                }
                throw error;
            }
        },
        retry: (failureCount, error) => {
            if (
                error.response?.status === 403 ||
                error.response?.status === 404
            ) {
                return false;
            }
            return failureCount < 3;
        },
    });

    const paymentPages = Math.ceil(payments.length / itemsPerPage);
    const paginatedPayments = payments.slice(
        (paymentPage - 1) * itemsPerPage,
        paymentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        setPaymentPage(Math.max(1, Math.min(paymentPages, newPage)));
    };

    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center min-h-full gap-4">
            <div className="relative">
                <Icon
                    icon="eos-icons:loading"
                    className="text-5xl text-primary animate-spin"
                />
                <Icon
                    icon="mdi:receipt-text"
                    className="text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                />
            </div>
            <p className="text-lg font-medium text-gray-600 animate-pulse">
                Gathering your history...
            </p>
        </div>
    );

    if (error) {
        if (error.response?.status === 403) {
            return (
                <div className="text-center py-12">
                    <div className="bg-red-50 inline-flex p-4 rounded-full mb-4">
                        <Icon
                            icon="mdi:shield-lock-outline"
                            className="text-4xl text-red-500"
                        />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Access Restricted
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                        You don't have permission to view payment history.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Icon icon="mdi:home" />
                        Return to Home
                    </button>
                </div>
            );
        }

        return (
            <div className="text-center py-12">
                <div className="bg-red-50 inline-flex p-4 rounded-full mb-4">
                    <Icon
                        icon="mdi:alert-circle"
                        className="text-4xl text-red-500"
                    />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Loading Failed
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                    {error.message}
                </p>
                <button
                    onClick={() => queryClient.refetchQueries(["userPayments"])}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 mx-auto"
                >
                    <Icon icon="mdi:reload" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-8xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">
                        Payment History
                    </h1>
                    <p className="text-textPrimary mt-1">
                        Review your payment transactions
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                        <h2 className="text-xl font-bold text-secondary">
                            Your Transactions
                        </h2>
                        {payments.length > 0 && (
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                                <Icon
                                    icon="mdi:receipt-text"
                                    className="text-third"
                                />
                                <span className="text-sm font-medium text-textPrimary">
                                    {payments.length} records
                                </span>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : payments.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                <PaymentHistory payments={paginatedPayments} />
                            </div>

                            {paymentPages > 1 && (
                                <div className="mt-6 p-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-gray-500">
                                            Showing{" "}
                                            {(paymentPage - 1) * itemsPerPage +
                                                1}
                                            -
                                            {Math.min(
                                                paymentPage * itemsPerPage,
                                                payments.length
                                            )}{" "}
                                            of {payments.length} payments
                                        </div>
                                        <nav className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        paymentPage - 1
                                                    )
                                                }
                                                disabled={paymentPage === 1}
                                                className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Previous page"
                                            >
                                                Previous
                                            </button>

                                            <div className="flex gap-1">
                                                {Array.from(
                                                    { length: paymentPages },
                                                    (_, i) => i + 1
                                                ).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() =>
                                                            handlePageChange(
                                                                page
                                                            )
                                                        }
                                                        className={`w-8 h-8 flex items-center justify-center border text-sm font-medium ${
                                                            paymentPage === page
                                                                ? "border-third bg-third text-white"
                                                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                        aria-current={
                                                            paymentPage === page
                                                                ? "page"
                                                                : undefined
                                                        }
                                                        aria-label={`Page ${page}`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        paymentPage + 1
                                                    )
                                                }
                                                disabled={
                                                    paymentPage === paymentPages
                                                }
                                                className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Next page"
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl">
                            <div className="bg-green-50 inline-flex p-5 rounded-full mb-5">
                                <Icon
                                    icon="mdi:receipt-text-remove"
                                    className="text-4xl text-third"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-2">
                                No Payment History
                            </h3>
                            <p className="text-textPrimary max-w-md mx-auto">
                                You haven't made any payments yet. Your payment
                                history will appear here once you complete a
                                transaction.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
