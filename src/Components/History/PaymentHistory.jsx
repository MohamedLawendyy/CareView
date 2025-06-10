import React from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function PaymentHistory({
    payments,
    selectedPayments = [],
    onSelectPayment = () => {},
    showSelection = false,
}) {
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString; // Return original string if formatting fails
        }
    };

    const getStatusDetails = (status) => {
        const statusMap = {
            completed: {
                color: "bg-green-100 text-green-800",
                text: "Completed",
                icon: "mdi:check-circle",
            },
            pending: {
                color: "bg-yellow-100 text-yellow-800",
                text: "Pending",
                icon: "mdi:clock",
            },
            failed: {
                color: "bg-red-100 text-red-800",
                text: "Failed",
                icon: "mdi:close-circle",
            },
            refunded: {
                color: "bg-blue-100 text-blue-800",
                text: "Refunded",
                icon: "mdi:currency-usd-off",
            },
        };

        return statusMap[status.toLowerCase()] || statusMap.completed;
    };

    const handleDownloadReceipt = (paymentId) => {
        console.log("Downloading receipt for payment:", paymentId);
        // Implement actual download logic here
    };

    if (!payments || payments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-gray-100 inline-flex p-4 rounded-full mb-4">
                    <Icon
                        icon="mdi:receipt-text-remove"
                        className="text-4xl text-gray-400"
                    />
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                    No payments found
                </h3>
                <p className="text-gray-500 mt-1">
                    There are no payment records to display
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {payments.map((payment) => {
                const statusDetails = getStatusDetails(
                    payment.status || "completed"
                );
                const isSelected = selectedPayments.includes(payment.paymentId);

                return (
                    <div
                        key={payment.paymentId}
                        className={`bg-white rounded-lg border ${
                            isSelected
                                ? "border-2 border-primary shadow-md"
                                : "border-gray-200"
                        } overflow-hidden hover:border-primary transition-all duration-300 relative`}
                        data-testid={`payment-card-${payment.paymentId}`}
                    >
                        {showSelection && (
                            <div
                                className={`absolute top-4 left-4 z-10 transition-all duration-200 ${
                                    isSelected
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-90"
                                }`}
                                aria-hidden={!isSelected}
                            >
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <Icon
                                        icon="mdi:check"
                                        className="text-white text-lg"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                {showSelection && (
                                    <div
                                        onClick={() =>
                                            onSelectPayment(payment.paymentId)
                                        }
                                        className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                                            isSelected
                                                ? "border-primary bg-primary"
                                                : "border-gray-300 hover:border-primary"
                                        }`}
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                onSelectPayment(
                                                    payment.paymentId
                                                );
                                            }
                                        }}
                                    >
                                        {isSelected && (
                                            <Icon
                                                icon="mdi:check"
                                                className="text-white text-sm"
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${statusDetails.color}`}
                                                >
                                                    {statusDetails.text}
                                                </span>
                                                <Icon
                                                    icon={statusDetails.icon}
                                                    className={statusDetails.color.replace(
                                                        "bg-",
                                                        "text-"
                                                    )}
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mt-2">
                                                Payment #{payment.paymentId}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                <Icon
                                                    icon="mdi:calendar"
                                                    className="text-gray-400"
                                                />
                                                {formatDate(
                                                    payment.paymentDate
                                                )}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                Total Paid
                                            </p>
                                            <p className="text-2xl font-bold text-third">
                                                E£
                                                {payment.totalPrice?.toFixed(
                                                    2
                                                ) || "0.00"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <Icon
                                                        icon="mdi:account"
                                                        className="text-gray-400"
                                                    />
                                                    {payment.name || "N/A"}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                    <Icon
                                                        icon="mdi:email"
                                                        className="text-gray-400"
                                                    />
                                                    {payment.email || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                                    <Icon
                                                        icon="mdi:credit-card"
                                                        className="text-gray-400"
                                                    />
                                                    {payment.paymentMethod ||
                                                        "Payment method not specified"}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                    <Icon
                                                        icon="mdi:identifier"
                                                        className="text-gray-400"
                                                    />
                                                    Reference:{" "}
                                                    {payment.referenceNumber ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2">
                            <span className="text-xs text-gray-500">
                                Transaction ID: {payment.paymentId}
                            </span>
                            <button
                                onClick={() =>
                                    handleDownloadReceipt(payment.paymentId)
                                }
                                className="text-xs text-third font-bold hover:underline flex items-center gap-1"
                                aria-label={`Download receipt for payment ${payment.paymentId}`}
                            >
                                <Icon icon="mdi:download" />
                                Download Receipt
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

PaymentHistory.propTypes = {
    payments: PropTypes.arrayOf(
        PropTypes.shape({
            paymentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            paymentDate: PropTypes.string.isRequired,
            totalPrice: PropTypes.number.isRequired,
            name: PropTypes.string,
            email: PropTypes.string,
            status: PropTypes.string,
            paymentMethod: PropTypes.string,
            referenceNumber: PropTypes.string,
        })
    ).isRequired,
    selectedPayments: PropTypes.array,
    onSelectPayment: PropTypes.func,
    showSelection: PropTypes.bool,
};

PaymentHistory.defaultProps = {
    selectedPayments: [],
    onSelectPayment: () => {},
    showSelection: false,
};
