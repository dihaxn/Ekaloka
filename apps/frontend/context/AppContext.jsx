"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};

export const AppContextProvider = (props) => {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [isSeller, setIsSeller] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductList = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${url}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.data);
            } else {
                throw new Error(response.data.message || "Failed to fetch products.");
            }
        } catch (err) {
            console.error("Failed to fetch product list:", err);
            setError(err.response?.data?.message || err.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (userData) => {
        try {
            const response = await axios.post(`${url}/api/user/login`, userData);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                // In a real app, you'd fetch user details to set role-based state
                // For now, we can assume a role is returned or handle it as needed
                setIsSeller(response.data.role === 'seller');
                return { success: true, message: "Login successful!" };
            } else {
                return { success: false, message: response.data.message || "Login failed." };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "An error occurred during login." };
        }
    };

    const registerUser = async (userData) => {
        try {
            const response = await axios.post(`${url}/api/user/register`, userData);
            if (response.data.success) {
                return { success: true, message: "Registration successful! Please log in." };
            } else {
                return { success: false, message: response.data.message || "Registration failed." };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "An error occurred during registration." };
        }
    };

    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (newCart[itemId] > 1) {
                newCart[itemId] -= 1;
            } else {
                delete newCart[itemId];
            }
            return newCart;
        });
    };
    
    const updateCartQuantity = (itemId, quantity) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (quantity > 0) {
                newCart[itemId] = quantity;
            } else {
                delete newCart[itemId];
            }
            return newCart;
        });
    };

    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const itemInfo = products.find((product) => product._id === itemId);
            return total + (itemInfo ? itemInfo.offerPrice * quantity : 0);
        }, 0);
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, count) => total + count, 0);
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchProductList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                // You might want to verify the token and fetch user role here
            }
        };
        loadData();
    }, []);

    const contextValue = {
        products,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getCartCount,
        updateCartQuantity,
        url,
        router,
        token,
        setToken,
        isSeller,
        loginUser,
        registerUser,
        loading,
        error
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};