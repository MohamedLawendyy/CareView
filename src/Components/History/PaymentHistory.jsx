import React from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function PaymentHistory({
    payments,
    selectedPayments,
    onSelectPayment,
    showSelection,
}) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = () => {
        return "bg-green-100 text-green-800";
    };

    return (
        <div className="space-y-4">
            {payments.map((payment) => (
                <div
                    key={payment.paymentId}
                    className={`bg-white rounded-lg border ${
                        selectedPayments.includes(payment.paymentId)
                            ? "border-2 border-primary shadow-md"
                            : "border-gray-200"
                    } overflow-hidden hover:border-primary transition-all duration-300 relative`}
                >
                    {showSelection && (
                        <div
                            className={`absolute top-4 left-4 z-10 transition-all duration-200 ${
                                selectedPayments.includes(payment.paymentId)
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-90"
                            }`}
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
                                        selectedPayments.includes(
                                            payment.paymentId
                                        )
                                            ? "border-primary bg-primary"
                                            : "border-gray-300 hover:border-primary"
                                    }`}
                                >
                                    {selectedPayments.includes(
                                        payment.paymentId
                                    ) && (
                                        <Icon
                                            icon="mdi:check"
                                            className="text-white text-sm"
                                        />
                                    )}
                                </div>
                            )}

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor()}`}
                                        >
                                            Completed
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 mt-2">
                                            Payment #{payment.paymentId}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                            <Icon
                                                icon="mdi:calendar"
                                                className="text-gray-400"
                                            />
                                            {formatDate(payment.paymentDate)}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            Total Paid
                                        </p>
                                        <p className="text-2xl font-bold text-third">
                                            E£{payment.totalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <Icon
                                                icon="mdi:account"
                                                className="text-gray-400"
                                            />
                                            {payment.name}
                                        </p>
                                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                            <Icon
                                                icon="mdi:email"
                                                className="text-gray-400"
                                            />
                                            {payment.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                            Transaction ID: {payment.paymentId}
                        </span>
                        <button className="text-xs text-third font-bold hover:underline">
                            Download Receipt
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

PaymentHistory.propTypes = {
    payments: PropTypes.array.isRequired,
    selectedPayments: PropTypes.array.isRequired,
    onSelectPayment: PropTypes.func.isRequired,
    showSelection: PropTypes.bool.isRequired,
};
