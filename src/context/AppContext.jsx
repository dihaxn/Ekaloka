"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {
    const router = useRouter();
    const url = "http://localhost:3000"
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [token, setToken] = useState("");
    const [userRole, setUserRole] = useState(""); // Add user role state
    const [isSeller, setIsSeller] = useState(false); // Placeholder for seller logic
    const [loading, setLoading] = useState(true);
    const [currency] = useState("$"); // Default currency

    // Check if user can access cart (hide for admin/seller users)
    const canAccessCart = () => {
        return userRole !== "admin" && userRole !== "seller";
    };

    // Check if user is admin or seller (treat as same role)
    const isAdmin = () => {
        return userRole === "admin" || userRole === "seller";
    };

    // Check if user is seller (same as admin)
    const isSellerUser = () => {
        return userRole === "admin" || userRole === "seller";
    };

    const fetchProductList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/products`);
            if (response.data.ok) {
                setProducts(response.data.data.products)
            }
        } catch (error) {
            console.error("Failed to fetch product list:", error);
        } finally {
            setLoading(false);
        }
    }

    const loginUser = async (userData) => {
        try {
            const response = await axios.post(`${url}/api/auth/login`, userData);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                
                // Set user role from login response
                if (response.data.user && response.data.user.role) {
                    setUserRole(response.data.user.role);
                    // Treat admin and seller as the same role
                    setIsSeller(response.data.user.role === "seller" || response.data.user.role === "admin");
                    localStorage.setItem("userRole", response.data.user.role);
                }
                
                return { success: true, message: "Login successful!" };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "An error occurred" };
        }
    };

    const registerUser = async (userData) => {
        try {
            const response = await axios.post(`${url}/api/auth/register`, userData);
            if (response.data.success) {
                return { success: true, message: "Registration successful! Please log in." };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "An error occurred" };
        }
    };

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = products.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.offerPrice * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const getCartCount = () => {
        let count = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                count += cartItems[item];
            }
        }
        return count;
    }

    const updateCartQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            setCartItems((prev) => {
                const newCart = { ...prev };
                delete newCart[itemId];
                return newCart;
            });
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: quantity }));
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchProductList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                // Load user role from localStorage
                const savedRole = localStorage.getItem("userRole");
                if (savedRole) {
                    setUserRole(savedRole);
                    // Treat admin and seller as the same role
                    setIsSeller(savedRole === "seller" || savedRole === "admin");
                }
            }
        }
        loadData();
    }, [])

    const contextValue = {
        products,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartCount,
        getTotalCartAmount,
        currency,
        url,
        router,
        token,
        setToken,
        isSeller,
        isSellerUser, // Add isSellerUser function to context
        loginUser,
        registerUser,
        loading,
        userRole, // Add userRole to context
        setUserRole, // Add setUserRole to context
        canAccessCart, // Add canAccessCart to context
        isAdmin // Add isAdmin to context
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}
