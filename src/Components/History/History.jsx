import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PaymentHistory from "./PaymentHistory";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function History() {
    const token = localStorage.getItem("userToken");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [selectedPayments, setSelectedPayments] = useState([]);
    const [showSelection, setShowSelection] = useState(false);
    const [paymentPage, setPaymentPage] = useState(1);
    const itemsPerPage = 3;

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

    const deletePayment = useMutation({
        mutationFn: async (paymentIds) => {
            await Promise.all(
                paymentIds.map((id) =>
                    axios.delete(
                        `https://careview.runasp.net/api/Payment/DeletePayment?paymentId=${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                )
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["userPayments"]);
            setSelectedPayments([]);
            setShowSelection(false);
            Swal.fire({
                title: "Success!",
                text: "Payments deleted successfully",
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
        },
        onError: (error) => {
            let errorMessage = error.message;
            if (error.response?.status === 403) {
                errorMessage = "You don't have permission to delete payments";
            } else if (error.response?.status === 404) {
                errorMessage = "Payment not found";
            }

            Swal.fire({
                title: "Error!",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#d33",
            });
        },
    });

    const handleSelectPayment = (paymentId) => {
        setSelectedPayments((prev) =>
            prev.includes(paymentId)
                ? prev.filter((id) => id !== paymentId)
                : [...prev, paymentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPayments.length === payments.length) {
            setSelectedPayments([]);
        } else {
            setSelectedPayments(payments.map((p) => p.paymentId));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedPayments.length === 0) return;

        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete ${selectedPayments.length} payment(s)`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete them!",
        }).then((result) => {
            if (result.isConfirmed) {
                deletePayment.mutate(selectedPayments);
            }
        });
    };

    const toggleSelectionMode = () => {
        setShowSelection(!showSelection);
        if (!showSelection) {
            setSelectedPayments([]);
        }
    };

    const paymentPages = Math.ceil(payments.length / itemsPerPage);
    const paginatedPayments = payments.slice(
        (paymentPage - 1) * itemsPerPage,
        paymentPage * itemsPerPage
    );

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
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
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
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
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
                    <h1 className="text-3xl font-bold text-gray-900">
                        History
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Review your payment transactions
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                        <h2 className="text-xl font-bold text-gray-800">
                            Your Transactions
                        </h2>
                        {payments.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                                    <Icon
                                        icon="mdi:filter"
                                        className="text-gray-500"
                                    />
                                    <span className="text-sm font-medium">
                                        {payments.length} records
                                    </span>
                                </div>
                                <button
                                    onClick={toggleSelectionMode}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                        showSelection
                                            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                            : "bg-red-800 text-white hover:bg-primary-dark"
                                    }`}
                                >
                                    <Icon
                                        icon={
                                            showSelection
                                                ? "mdi:close"
                                                : "mdi:delete"
                                        }
                                    />
                                    {showSelection ? "Cancel" : "Delete"}
                                </button>
                                {showSelection &&
                                    selectedPayments.length > 0 && (
                                        <button
                                            onClick={handleDeleteSelected}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                            disabled={deletePayment.isLoading}
                                        >
                                            <Icon icon="mdi:delete" />
                                            Delete {selectedPayments.length}
                                        </button>
                                    )}
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : payments.length > 0 ? (
                        <>
                            {showSelection && (
                                <div className="mb-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="selectAll"
                                        checked={
                                            selectedPayments.length ===
                                            payments.length
                                        }
                                        onChange={handleSelectAll}
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label
                                        htmlFor="selectAll"
                                        className="text-sm text-gray-700"
                                    >
                                        {selectedPayments.length ===
                                        payments.length
                                            ? "Deselect all"
                                            : "Select all"}
                                    </label>
                                    {selectedPayments.length > 0 && (
                                        <span className="ml-auto text-sm font-medium text-primary">
                                            {selectedPayments.length} selected
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="space-y-4">
                                <PaymentHistory
                                    payments={paginatedPayments}
                                    selectedPayments={selectedPayments}
                                    onSelectPayment={handleSelectPayment}
                                    showSelection={showSelection}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl">
                            <div className="bg-green-50 inline-flex p-5 rounded-full mb-5">
                                <Icon
                                    icon="mdi:receipt-text-remove"
                                    className="text-4xl text-third"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                No Payment History
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                You haven't made any payments yet. Your payment
                                history will appear here once you complete a
                                transaction.
                            </p>
                        </div>
                    )}
                </div>

                {paymentPages > 1 && (
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                        <div className="flex justify-center">
                            <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() =>
                                        setPaymentPage((p) =>
                                            Math.max(1, p - 1)
                                        )
                                    }
                                    disabled={paymentPage === 1}
                                    className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {Array.from(
                                    { length: paymentPages },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setPaymentPage(page)}
                                        className={`px-3 py-2 border border-gray-300 text-sm font-medium ${
                                            paymentPage === page
                                                ? "bg-primary text-white"
                                                : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() =>
                                        setPaymentPage((p) =>
                                            Math.min(paymentPages, p + 1)
                                        )
                                    }
                                    disabled={paymentPage === paymentPages}
                                    className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
