import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function SuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const paymentId = searchParams.get("payment_id");
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        const displaySuccessMessage = async () => {
            try {
                // Clear the cart cache
                await queryClient.invalidateQueries(["cart"]);

                await Swal.fire({
                    title: "Thank You!",
                    html: `
                        <div class="text-center">
                            <svg class="mx-auto mb-4 w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <p class="mb-4 text-lg font-medium text-secondary">Your order has been placed successfully!</p>
                            <p class="text-sm text-textPrimary">You can check your order history for more details.</p>
                        </div>
                    `,
                    icon: "success",
                    confirmButtonText: "Continue Shopping",
                    confirmButtonColor: "#2F5241", // Your bg-third color
                    allowOutsideClick: false,
                    customClass: {
                        popup: "rounded-lg shadow-xl bg-bg", // Using your bg color
                        confirmButton:
                            "py-2 px-6 rounded-md font-medium text-white hover:bg-opacity-90 transition-colors",
                        title: "text-secondary", // Using your secondary color for title
                    },
                    background: "#E4E5DB", // Your bg color
                });
            } catch (error) {
                console.error("Error processing success:", error);
            } finally {
                navigate("/pharmacy");
            }
        };

        displaySuccessMessage();
    }, [paymentId, sessionId, navigate, queryClient]);

    return null;
}
