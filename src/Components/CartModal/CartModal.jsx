import React from "react";
import { Icon } from "@iconify/react";
import DefaultProductImage from "../../assets/images/panadolColdFlu.jpeg";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

export default function CartModal({
    onClose,
    onRemove,
    onUpdate,
    onCheckout,
    setCartItemsCount,
}) {
    const token = localStorage.getItem("userToken");

    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const {
        data: cartResponse,
        isLoading,
        error,
        refetch: refetchCart,
    } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            try {
                const response = await authAxios.get(
                    "https://careview.runasp.net/api/cart/GetUserCart"
                );
                return response.data;
            } catch (error) {
                if (error.response?.status === 401) {
                    Swal.fire({
                        title: "Session Expired",
                        text: "Please login again to view your cart",
                        icon: "warning",
                        confirmButtonText: "OK",
                    }).then(() => {
                        window.location.href = "/login";
                    });
                }
                throw error;
            }
        },
        onSuccess: (data) => {
            const count =
                data?.items?.reduce(
                    (total, item) => total + item.quantity,
                    0
                ) || 0;
            setCartItemsCount(count);
        },
    });

    const { data: cartTotalResponse, refetch: refetchTotal } = useQuery({
        queryKey: ["cartTotal"],
        queryFn: async () => {
            try {
                const response = await authAxios.get(
                    "https://careview.runasp.net/api/cart/cart-total"
                );
                return response.data;
            } catch (error) {
                console.error("Error fetching cart total:", error);
                return { totalPrice: 0 };
            }
        },
    });

    const cartItems = cartResponse?.items || [];
    const cartTotal = cartTotalResponse?.totalPrice || 0;

    const handleRemove = async (itemId) => {
        try {
            await onRemove(itemId);
            await Promise.all([refetchCart(), refetchTotal()]);
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleUpdate = async (productId, newQuantity) => {
        try {
            await onUpdate(productId, newQuantity);
            await Promise.all([refetchCart(), refetchTotal()]);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const handleCheckoutClick = async () => {
        try {
            await onCheckout();
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col p-4">
                    <div className="flex justify-center items-center h-full">
                        <Icon
                            icon="eos-icons:loading"
                            className="text-4xl text-primary animate-spin"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col p-4">
                    <div className="text-center py-8 text-red-500">
                        <Icon
                            icon="mdi:alert-circle"
                            className="text-4xl mx-auto mb-3"
                        />
                        <p>Error loading cart: {error.message}</p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-third text-white rounded-lg hover:bg-secondary/90 transition duration"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-third">
                        Your Shopping Cart (
                        {cartItems.reduce(
                            (total, item) => total + item.quantity,
                            0
                        )}{" "}
                        items)
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-700 p-1"
                    >
                        <Icon icon="mdi:close" width={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-8">
                            <Icon
                                icon="solar:cart-bold-duotone"
                                className="mx-auto text-4xl text-third mb-3"
                            />
                            <p className="text-gray-500">Your cart is empty</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 bg-third text-white rounded-lg hover:bg-secondary/90 transition duration"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {cartItems.map((item) => (
                                <li
                                    key={item.id}
                                    className="py-4 flex items-start gap-3"
                                >
                                    <img
                                        src={
                                            item.imageUrl || DefaultProductImage
                                        }
                                        alt={item.productName}
                                        className="w-16 h-16 object-contain rounded-md border border-gray-200"
                                        onError={(e) =>
                                            (e.target.src = DefaultProductImage)
                                        }
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">
                                            {item.productName}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            E£{item.price.toFixed(2)} each
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <div className="flex items-center bg-gray-100 rounded-full px-2">
                                                <button
                                                    onClick={() =>
                                                        handleUpdate(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-secondary"
                                                >
                                                    <Icon
                                                        icon="typcn:minus"
                                                        width={14}
                                                    />
                                                </button>
                                                <span className="mx-2 text-gray-700 font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleUpdate(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-secondary"
                                                >
                                                    <Icon
                                                        icon="fluent:add-12-filled"
                                                        width={14}
                                                    />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemove(item.id)
                                                }
                                                className="ml-auto text-gray-400 hover:text-red-500 p-1"
                                            >
                                                <Icon
                                                    icon="mdi:trash"
                                                    width={18}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-4 border-t">
                        <div className="flex justify-between mb-4">
                            <span className="font-bold text-gray-700">
                                Total:
                            </span>
                            <span className="font-bold text-third">
                                E£{cartTotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 border border-third text-third rounded-lg hover:bg-third/10"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={handleCheckoutClick}
                                className="flex-1 py-2 bg-third/90 text-white rounded-lg hover:bg-third"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
