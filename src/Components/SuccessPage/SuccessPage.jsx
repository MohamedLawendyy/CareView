import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const paymentId = searchParams.get("payment_id");

    useEffect(() => {
        if (paymentId) {
            Swal.fire({
                title: "Payment Successful!",
                text: `Your payment with ID ${paymentId} has been processed successfully.`,
                icon: "success",
                confirmButtonText: "Continue Shopping",
                confirmButtonColor: "#3085d6",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to the pharmacy page
                    navigate("/pharmacy");
                }
            });
        } else {
            // If no payment ID, just redirect to pharmacy page
            navigate("/pharmacy");
        }
    }, [paymentId, navigate]);

    // This component doesn't render anything visible
    return <>

    </>;
};

