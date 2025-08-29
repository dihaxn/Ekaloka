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
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [token, setToken] = useState("");
    const [userRole, setUserRole] = useState(""); // Add user role state
    const [userName, setUserName] = useState(""); // Add user name state
    const [userEmail, setUserEmail] = useState(""); // Add user email state
    const [isOwner, setIsOwner] = useState(false); // owner role
    const [loading, setLoading] = useState(true);
    const [currency] = useState("$"); // Default currency

    // Hide cart for owner users
    const canAccessCart = () => {
        return userRole !== "owner";
    };

    // Check if user is owner
    const isOwnerUser = () => {
        return userRole === "owner";
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
                const { token, rememberMe, expiresIn, user } = response.data;
                
                setToken(token);
                
                // Store token and user data based on remember me preference
                if (rememberMe) {
                    // Store in localStorage for persistent login (30 days)
                    localStorage.setItem("token", token);
                    localStorage.setItem("rememberMe", "true");
                    localStorage.setItem("tokenExpiry", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
                    console.log('🔐 Remember Me: ON - Token stored in localStorage for 30 days');
                } else {
                    // Store in sessionStorage for session-only login (24 hours)
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("rememberMe", "false");
                    sessionStorage.setItem("tokenExpiry", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
                    console.log('🔐 Remember Me: OFF - Token stored in sessionStorage for 24 hours');
                }
                
                // Set user data from login response
                if (user) {
                    setUserRole(user.role);
                    setUserName(user.name);
                    setUserEmail(user.email);
                    setIsOwner(user.role === "owner");
                    
                    // Store user data in the same storage as token
                    if (rememberMe) {
                        localStorage.setItem("userRole", user.role);
                        localStorage.setItem("userName", user.name);
                        localStorage.setItem("userEmail", user.email);
                    } else {
                        sessionStorage.setItem("userRole", user.role);
                        sessionStorage.setItem("userName", user.name);
                        sessionStorage.setItem("userEmail", user.email);
                    }
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

    const logoutUser = () => {
        setToken("");
        setUserRole("");
        setUserName("");
        setUserEmail("");
        setIsOwner(false);
        
        // Clear both localStorage and sessionStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("tokenExpiry");
        
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("rememberMe");
        sessionStorage.removeItem("tokenExpiry");
        
        router.push('/login');
    };

    const getTokenExpiryInfo = () => {
        const storedExpiry = localStorage.getItem("tokenExpiry") || sessionStorage.getItem("tokenExpiry");
        if (!storedExpiry) return null;
        
        const expiryDate = new Date(storedExpiry);
        const now = new Date();
        const timeLeft = expiryDate.getTime() - now.getTime();
        
        if (timeLeft <= 0) return { expired: true, timeLeft: 0 };
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        return {
            expired: false,
            timeLeft,
            days,
            hours,
            minutes,
            expiryDate: expiryDate.toLocaleString()
        };
    };

    useEffect(() => {
        async function loadData() {
            await fetchProductList();
            
            // Check for token in both localStorage and sessionStorage
            let storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
            let storedRememberMe = localStorage.getItem("rememberMe") || sessionStorage.getItem("rememberMe");
            let storedExpiry = localStorage.getItem("tokenExpiry") || sessionStorage.getItem("tokenExpiry");
            
            if (storedToken && storedExpiry) {
                // Check if token is expired
                const expiryDate = new Date(storedExpiry);
                if (expiryDate > new Date()) {
                    setToken(storedToken);
                    
                    // Load user data from the appropriate storage
                    if (storedRememberMe === "true") {
                        // Load from localStorage
                        const savedRole = localStorage.getItem("userRole");
                        const savedName = localStorage.getItem("userName");
                        const savedEmail = localStorage.getItem("userEmail");
                        if (savedRole) {
                            setUserRole(savedRole);
                            setIsOwner(savedRole === "owner");
                        }
                        if (savedName) {
                            setUserName(savedName);
                        }
                        if (savedEmail) {
                            setUserEmail(savedEmail);
                        }
                    } else {
                        // Load from sessionStorage
                        const savedRole = sessionStorage.getItem("userRole");
                        const savedName = sessionStorage.getItem("userName");
                        const savedEmail = sessionStorage.getItem("userEmail");
                        if (savedRole) {
                            setUserRole(savedRole);
                            setIsOwner(savedRole === "owner");
                        }
                        if (savedName) {
                            setUserName(savedName);
                        }
                        if (savedEmail) {
                            setUserEmail(savedEmail);
                        }
                    }
                } else {
                    // Token expired, clear storage
                    logoutUser();
                }
            }
        }
        loadData();
        
        // Set up periodic token expiration check (every 5 minutes)
        const tokenCheckInterval = setInterval(() => {
            const storedExpiry = localStorage.getItem("tokenExpiry") || sessionStorage.getItem("tokenExpiry");
            if (storedExpiry) {
                const expiryDate = new Date(storedExpiry);
                if (expiryDate <= new Date()) {
                    // Token expired, logout user
                    logoutUser();
                }
            }
        }, 5 * 60 * 1000); // 5 minutes
        
        return () => clearInterval(tokenCheckInterval);
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
        isOwner,
        isOwnerUser,
        loginUser,
        logoutUser,
        registerUser,
        getTokenExpiryInfo,
        loading,
        userRole, // Add userRole to context
        setUserRole, // Add setUserRole to context
        userName, // Add userName to context
        setUserName, // Add setUserName to context
        userEmail, // Add userEmail to context
        setUserEmail, // Add setUserEmail to context
        canAccessCart, // Add canAccessCart to context
        
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}
