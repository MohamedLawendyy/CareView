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
    const [sortOption, setSortOption] = useState("name-asc");
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
    });

    const fetchProducts = async (
        pageIndex = 1,
        pageSize = pagination.pageSize
    ) => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://careview.runasp.net/api/Products/GetAllProducts?PageSize=${pageSize}&PageIndex=${pageIndex}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setProducts(data);
            setFilteredProducts(data);
            setPagination((prev) => ({
                ...prev,
                pageIndex,
                pageSize,
                totalCount: data.length * pageIndex, // This is a temporary approximation
            }));
        } catch (err) {
            setError(err.message);
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = [...products];

        // Apply search filter
        if (searchTerm.trim() !== "") {
            filtered = filtered.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (product.description &&
                        product.description
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
            );
        }

        // Apply sorting
        filtered = sortProducts(filtered, sortOption);

        setFilteredProducts(filtered);
    }, [searchTerm, products, sortOption]);

    const sortProducts = (products, option) => {
        const [field, order] = option.split("-");
        return [...products].sort((a, b) => {
            // Handle missing fields
            if (!a[field] || !b[field]) return 0;

            if (field === "price") {
                return order === "asc" ? a.price - b.price : b.price - a.price;
            } else {
                const aValue = a[field].toString().toLowerCase();
                const bValue = b[field].toString().toLowerCase();
                return order === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        fetchProducts(newPage, pagination.pageSize);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePageSizeChange = (newSize) => {
        const newPageSize = Number(newSize);
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 1,
        }));
        fetchProducts(1, newPageSize);
    };

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
                    className="relative bg-primary hover:bg-primary-dark p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
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

                {/* Search, Sort, and Page Size Controls */}
                <div className="mb-8 bg-primary p-4 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third bg-white/60 focus:bg-white/80 transition-all duration-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="w-full sm:w-48">
                            <select
                                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third bg-white/60 focus:bg-white/80 transition-all duration-300"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="price-asc">
                                    Price (Low to High)
                                </option>
                                <option value="price-desc">
                                    Price (High to Low)
                                </option>
                            </select>
                        </div>

                        {/* Items per page selector */}
                        <div className="w-full sm:w-40">
                            <select
                                value={pagination.pageSize}
                                onChange={(e) =>
                                    handlePageSizeChange(e.target.value)
                                }
                                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third bg-white/60 focus:bg-white/80 transition-all duration-300"
                            >
                                <option value="5">5 per page</option>
                                <option value="10">10 per page</option>
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
                        <div className="inline-flex items-center">
                            <Icon
                                icon="eos-icons:loading"
                                className="text-4xl text-primary animate-spin mr-2"
                            />
                            <span>Loading products...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Products Grid */}
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
                                            : "No products available"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Enhanced Pagination */}
                        {filteredProducts.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
                                <div className="text-sm text-gray-600">
                                    Showing{" "}
                                    {(pagination.pageIndex - 1) *
                                        pagination.pageSize +
                                        1}
                                    -
                                    {Math.min(
                                        pagination.pageIndex *
                                            pagination.pageSize,
                                        (pagination.pageIndex - 1) *
                                            pagination.pageSize +
                                            filteredProducts.length
                                    )}{" "}
                                    items
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.pageIndex - 1
                                            )
                                        }
                                        disabled={pagination.pageIndex === 1}
                                        className={`flex items-center justify-center px-4 h-10 rounded-lg transition-all duration-300 ${
                                            pagination.pageIndex === 1
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "text-white bg-secondary hover:bg-secondary-dark hover:shadow-md"
                                        }`}
                                    >
                                        <Icon
                                            icon="mdi:chevron-left"
                                            className="text-xl"
                                        />
                                        <span className="ml-1">Previous</span>
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {pagination.pageIndex > 1 && (
                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.pageIndex - 1
                                                    )
                                                }
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-secondary transition-colors"
                                            >
                                                {pagination.pageIndex - 1}
                                            </button>
                                        )}

                                        <button className="w-10 h-10 flex items-center justify-center bg-secondary text-white rounded-lg scale-105 transform transition-transform">
                                            {pagination.pageIndex}
                                        </button>

                                        {filteredProducts.length >=
                                            pagination.pageSize && (
                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.pageIndex + 1
                                                    )
                                                }
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-secondary transition-colors"
                                            >
                                                {pagination.pageIndex + 1}
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.pageIndex + 1
                                            )
                                        }
                                        disabled={
                                            filteredProducts.length <
                                            pagination.pageSize
                                        }
                                        className={`flex items-center justify-center px-4 h-10 rounded-lg transition-all duration-300 ${
                                            filteredProducts.length <
                                            pagination.pageSize
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "text-white bg-secondary hover:bg-secondary-dark hover:shadow-md"
                                        }`}
                                    >
                                        <span className="mr-1">Next</span>
                                        <Icon
                                            icon="mdi:chevron-right"
                                            className="text-xl"
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
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
