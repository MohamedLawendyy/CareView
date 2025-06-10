import React, { useContext, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ProductCard from "../ProductCard/ProductCard";
import Message from "../Message/Message.jsx";
import SectionBG from "../../assets/images/SectionBG.svg";
import DefaultProductImage from "../../assets/images/panadolColdFlu.jpeg";
import CartModal from "../CartModal/CartModal.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { CartContext } from "../../Context/CartContext.jsx";

export default function Pharmacy() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCart, setShowCart] = useState(false);
    const [sortOption, setSortOption] = useState("name-asc");
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
    });
    const { cartCount, setCartCount } = useContext(CartContext)

    const token = localStorage.getItem("userToken");

    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const {
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
            setCartCount(count);
        },
    });

    const fetchProducts = async (
        pageIndex = 1,
        pageSize = pagination.pageSize
    ) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://careview.runasp.net/api/Products/GetAllProducts?PageSize=${pageSize}&PageIndex=${pageIndex}`
            );

            setProducts(response.data);
            setFilteredProducts(response.data);
            setPagination((prev) => ({
                ...prev,
                pageIndex,
                pageSize,
                totalCount: response.data.length * pageIndex,
            }));
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Please login to access this page");
            } else {
                setError(err.message);
            }
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

        filtered = sortProducts(filtered, sortOption);
        setFilteredProducts(filtered);
    }, [searchTerm, products, sortOption]);

    const sortProducts = (products, option) => {
        const [field, order] = option.split("-");
        return [...products].sort((a, b) => {
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

    const addToCart = async (product, quantity) => {
        try {
            await authAxios.post(
                `https://careview.runasp.net/api/cart/add?productId=${product.id}&quantity=${quantity}`
            );
            return true;
        } catch (error) {
            if (error.response?.status === 401) {
                Swal.fire({
                    title: "Login Required",
                    text: "Please login to add items to cart",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
            } else {
                console.error("Error adding to cart:", error);
            }
            return false;
        } finally {
            refetchCart()
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await authAxios.delete(
                `https://careview.runasp.net/api/cart/remove-product?itemId=${itemId}`
            );
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const updateCartItem = async (productId, newQuantity) => {
        try {
            await authAxios.post(
                `https://careview.runasp.net/api/cart/add?productId=${productId}&quantity=${newQuantity}`
            );
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await authAxios.post(
                "https://careview.runasp.net/api/cart/Pay"
            );
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error during checkout:", error);
            Swal.fire({
                title: "Payment Failed",
                text:
                    error.response?.data?.message || "Please try again later.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
            });
        }
    };

    const handlePageChange = (newPage) => {
        fetchProducts(newPage, pagination.pageSize);
    };

    const handlePageSizeChange = (newSize) => {
        fetchProducts(1, newSize);
    };

    return (
        <div
            className="relative min-h-screen container mx-auto px-4 py-8 max-w-8xl"
            style={{
                backgroundImage: `url(${SectionBG})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backgroundRepeat: "repeat",
            }}
        >
            <div className="fixed top-4 right-[100px] z-50">
                <button
                    className="relative bg-primary hover:bg-primary-dark p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => setShowCart(true)}
                    aria-label="Shopping Cart"
                >
                    <Icon
                        icon="solar:cart-bold"
                        className="text-2xl text-third"
                    />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 text-xs text-white font-bold bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <h1 className="text-3xl font-bold mb-6 text-secondary w-fit">
                    Pharmacy Products
                </h1>

                {error && error.includes("login") && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{error}</p>
                        <button
                            onClick={() => (window.location.href = "/login")}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Go to Login
                        </button>
                    </div>
                )}

                <div className="mb-8 bg-primary p-4 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-third bg-white/60 focus:bg-white/80 transition-all duration-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

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
                                <option value="20">20 per page</option>
                            </select>
                        </div>
                    </div>
                </div>

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
                                        className={`flex items-center justify-center px-4 h-10 rounded-lg transition-all duration-300 ${pagination.pageIndex === 1
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
                                        className={`flex items-center justify-center px-4 h-10 rounded-lg transition-all duration-300 ${filteredProducts.length <
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

            {showCart && (
                <CartModal
                    onClose={() => setShowCart(false)}
                    onRemove={removeFromCart}
                    onUpdate={updateCartItem}
                    onCheckout={handleCheckout}
                    setCartItemsCount={setCartCount}
                />
            )}
        </div>
    );
}
