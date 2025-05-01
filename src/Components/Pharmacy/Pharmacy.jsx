import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import ProductCard from "../ProductCard/ProductCard";
import Message from "../Message/Message.jsx";
import SectionBG from "../../assets/images/SectionBG.svg";
import DefaultProductImage from "../../assets/images/panadolColdFlu.jpeg";
import CartModal from "../CartModal/CartModal.jsx";

export default function Pharmacy() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCart, setShowCart] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    "https://localhost:7290/api/Products/GetAllProducts"
                );
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products;

        if (searchTerm.trim() !== "") {
            filtered = filtered.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (product) =>
                    product.category &&
                    product.category.toLowerCase() ===
                        selectedCategory.toLowerCase()
            );
        }

        setFilteredProducts(filtered);
    }, [searchTerm, products, selectedCategory]);

    const addToCart = (product, quantity) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevCart, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId));
    };

    const updateCartItem = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCart(
            cart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const categories = [
        "all",
        ...new Set(
            products
                .map((product) => product.category)
                .filter((category) => typeof category === "string")
        ),
    ];

    return (
        <div
            className="relative min-h-screen py-16"
            style={{
                backgroundImage: `url(${SectionBG})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backgroundRepeat: "repeat",
            }}
        >
            {/* Fixed Cart Button */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    className="relative bg-primary hover:bg-primary-dark p-4 rounded-full shadow-lg transition-colors duration-200 hover:scale-105"
                    onClick={() => setShowCart(true)}
                    aria-label="Shopping Cart"
                >
                    <Icon
                        icon="solar:cart-bold"
                        className="text-2xl text-third"
                    />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 text-xs text-white font-bold bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">
                            {cart.reduce(
                                (total, item) => total + item.quantity,
                                0
                            )}
                        </span>
                    )}
                </button>
            </div>

            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <h1 className="text-3xl font-bold mb-6 text-secondary">
                    Pharmacy Products
                </h1>

                {/* Search and Filter Section */}
                <div className="mb-8 bg-primary p-4 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search products by name or description..."
                                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third bg-white/60 focus:bg-white/80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="w-full sm:w-64">
                            <select
                                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third bg-white/60 focus:bg-white/80"
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() +
                                            category.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <Message
                        severity="error"
                        text={error}
                        onClose={() => setError(null)}
                    />
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <Icon
                            icon="eos-icons:loading"
                            className="text-4xl text-primary animate-spin mx-auto"
                        />
                        <p className="text-gray-600 mt-2">
                            Loading products...
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addToCart}
                                    defaultImage={DefaultProductImage}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Icon
                                    icon="mdi:package-variant-remove"
                                    className="text-5xl text-gray-400 mx-auto mb-3"
                                />
                                <p className="text-gray-500 text-lg">
                                    {searchTerm
                                        ? `No products found matching "${searchTerm}"`
                                        : "No products available in this category"}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination buttons */}
            <div>
                <div className="flex flex items-center justify-center pt-8">
                    {/* Previous Button */}
                    <a
                        href="#"
                        className="flex items-center justify-center px-4 h-10 me-3 text-base font-medium text-bg bg-secondary border border-bg  rounded-lg hover:bg-third/80 hover:text-bg hover:border-third/80 dark:bg-third dark:border-bg dark:text-bg dark:hover:bg-secondary dark:hover:text-bg"
                    >
                        <svg
                            className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 5H1m0 0 4 4M1 5l4-4"
                            />
                        </svg>
                        Previous
                    </a>

                    {/* Next Button */}
                    <a
                        href="#"
                        className="flex items-center justify-center px-4 h-10 text-base font-medium text-bg bg-secondary border border-bg  rounded-lg hover:bg-third/80 hover:text-bg hover:border-third/80 dark:bg-third dark:border-bg dark:text-bg dark:hover:bg-secondary dark:hover:text-bg"
                    >
                        Next
                        <svg
                            className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </a>
                </div>
            </div>
            {/* Cart Modal */}
            {showCart && (
                <CartModal
                    cartItems={cart}
                    onClose={() => setShowCart(false)}
                    onRemove={removeFromCart}
                    onUpdate={updateCartItem}
                />
            )}
        </div>
    );
}
