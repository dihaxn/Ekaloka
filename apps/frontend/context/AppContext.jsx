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
    const url = "http://localhost:4000"
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [token, setToken] = useState("");
    const [isSeller, setIsSeller] = useState(false); // Placeholder for seller logic
    const [loading, setLoading] = useState(true);

    const fetchProductList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch product list:", error);
        } finally {
            setLoading(false);
        }
    }

    const loginUser = async (userData) => {
        try {
            const response = await axios.post(`${url}/api/user/login`, userData);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                // You might want to fetch user details here to set isSeller
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
            const response = await axios.post(`${url}/api/user/register`, userData);
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
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    useEffect(() => {
        async function loadData() {
            await fetchProductList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                // Here you could also fetch user data to check role
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
        getTotalCartAmount,
        url,
        router,
        token,
        setToken,
        isSeller,
        loginUser,
        registerUser,
        loading
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )

}