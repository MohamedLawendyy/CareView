import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function ProductCard({ product, onAddToCart, defaultImage }) {
    const [quantity, setQuantity] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [isOutOfStock, setIsOutOfStock] = useState(
        product.stockQuantity === 0
    );
    const [currentStock, setCurrentStock] = useState(product.stockQuantity);

    const token = localStorage.getItem("userToken");

    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Function to get first 6 words of description
    const getShortDescription = (description) => {
        if (!description) return "";
        const words = description.split(" ");
        return words.slice(0, 6).join(" ") + (words.length > 6 ? "..." : "");
    };

    const handleAddToCart = async () => {
        try {
            const response = await authAxios.get(
                `https://careview.runasp.net/api/Products/${product.id}`
            );
            const currentProduct = response.data;
            const updatedStock = currentProduct.stockQuantity;
            setCurrentStock(updatedStock);

            if (updatedStock === 0) {
                setIsOutOfStock(true);
                toast.error("This product is now out of stock");
                return;
            }

            if (quantity > updatedStock) {
                toast.error(`Only ${updatedStock} items available`);
                return;
            }

            const success = await onAddToCart(product, quantity);

            if (success) {
                setIsAdded(true);
                setQuantity(1);
                setTimeout(() => setIsAdded(false), 2000);

                if (updatedStock - quantity === 0) {
                    setIsOutOfStock(true);
                }
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Please login to add items to cart");
            } else {
                toast.error("Failed to check availability");
                console.error("Error:", error);
            }
        }
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        if (currentStock > 0 && newQuantity > currentStock) {
            toast.info(`Maximum available: ${currentStock}`);
            return;
        }
        setQuantity(newQuantity);
    };

    const discountedPrice =
        product.price - (product.price * (product.discount || 0)) / 100;

    return (
        <div
            className={`relative bg-primary p-3 sm:p-4 rounded-xl shadow-lg transition-all duration-300 transform ${
                isHovered ? "-translate-y-1 shadow-xl" : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {product.discount && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-bl-xl z-10">
                    {product.discount}% OFF
                </div>
            )}

            <div className="relative overflow-hidden rounded-lg mb-3 sm:mb-4 aspect-square">
                <img
                    src={product.imageUrl || defaultImage}
                    alt={product.name}
                    className={`w-full h-full object-cover rounded-lg transition-transform duration-500 ${
                        isHovered ? "scale-105" : "scale-100"
                    }`}
                    onError={(e) => {
                        e.target.src = defaultImage;
                    }}
                />
            </div>

            <div className="mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-third line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-secondary font-medium">
                    {getShortDescription(product.description)}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-third">
                        E£{discountedPrice.toFixed(2)}
                    </span>
                    {product.discount && (
                        <span className="text-xs sm:text-sm text-secondary line-through">
                            E£{product.price.toFixed(2)}
                        </span>
                    )}
                </div>

                {!isOutOfStock && (
                    <div className="flex items-center justify-between sm:justify-normal bg-bg rounded-full px-2 py-1">
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-secondary hover:text-third active:scale-90 transition-transform"
                            aria-label="Decrease quantity"
                            disabled={quantity <= 1}
                        >
                            <Icon icon="typcn:minus" width={16} />
                        </button>
                        <span className="mx-1 sm:mx-2 text-sm sm:text-base text-third font-medium">
                            {quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-secondary hover:text-third active:scale-90 transition-transform"
                            aria-label="Increase quantity"
                            disabled={quantity >= currentStock}
                        >
                            <Icon icon="fluent:add-12-filled" width={16} />
                        </button>
                    </div>
                )}
            </div>

            <p className="text-xs sm:text-sm text-secondary font-medium mx-2 my-2">
                {isOutOfStock
                    ? "Out of stock"
                    : `${currentStock} items in stock`}
            </p>

            <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdded}
                className={`w-full py-2 sm:py-3 rounded-xl font-medium sm:font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center ${
                    isOutOfStock
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : isAdded
                        ? "bg-green-500 text-white transform scale-95"
                        : "bg-third text-bg hover:bg-secondary hover:text-white active:scale-95"
                }`}
                aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
            >
                {isOutOfStock ? (
                    <>
                        <Icon
                            icon="mdi:cart-off"
                            className="mr-1 sm:mr-2 text-base sm:text-lg transition-transform"
                        />
                        Out of stock
                    </>
                ) : isAdded ? (
                    <>
                        <Icon
                            icon="material-symbols:check-circle"
                            className="mr-1 sm:mr-2 text-base sm:text-lg animate-bounce"
                        />
                        Added!
                    </>
                ) : (
                    <>
                        <Icon
                            icon="solar:cart-bold"
                            className="mr-1 sm:mr-2 text-base sm:text-lg group-hover:scale-110 transition-transform"
                        />
                        Add to Cart
                    </>
                )}
            </button>
        </div>
    );
}