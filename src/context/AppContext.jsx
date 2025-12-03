"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEYS = {
  token: "token",
  userRole: "userRole",
  userName: "userName",
  cartItems: "cartItems",
};

const AppContext = createContext(undefined);

const safeParseJSON = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Failed to parse JSON from storage", error);
    return fallback;
  }
};

const readStoredValue = (key, fallback = "") => {
  if (typeof window === "undefined") {
    return fallback;
  }
  return window.localStorage.getItem(key) ?? fallback;
};

const readStoredObject = (key, fallback = {}) => {
  if (typeof window === "undefined") {
    return fallback;
  }
  const rawValue = window.localStorage.getItem(key);
  return safeParseJSON(rawValue, fallback);
};

export const AppContextProvider = ({ children }) => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenState, setTokenState] = useState(() => readStoredValue(STORAGE_KEYS.token, ""));
  const [userRole, setUserRole] = useState(() => readStoredValue(STORAGE_KEYS.userRole, ""));
  const [userName, setUserName] = useState(() => readStoredValue(STORAGE_KEYS.userName, ""));
  const [cartItems, setCartItems] = useState(() => readStoredObject(STORAGE_KEYS.cartItems, {}));
  const [currency] = useState("$");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load products: ${response.status}`);
        }
        const payload = await response.json();
        if (isMounted && payload?.data?.products) {
          setProducts(payload.data.products);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch products", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEYS.cartItems, JSON.stringify(cartItems));
    } catch (error) {
      console.warn("Failed to persist cart items", error);
    }
  }, [cartItems]);

  useEffect(() => {
    if (!tokenState) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEYS.cartItems);
      }
      setCartItems({});
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenState}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (!payload?.data?.cartItems) {
          return;
        }

        const nextCart = payload.data.cartItems.reduce((acc, item) => {
          const productId = item.productId || item.product?.id || item.product?.productId || item.id;
          if (productId) {
            acc[productId] = item.quantity ?? 1;
          }
          return acc;
        }, {});

        if (isMounted) {
          setCartItems(nextCart);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.warn("Failed to fetch cart", error);
        }
      }
    };

    fetchCart();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [tokenState]);

  const persistString = useCallback((key, value) => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      if (value) {
        window.localStorage.setItem(key, value);
      } else {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Failed to persist ${key}`, error);
    }
  }, []);

  const setToken = useCallback(
    (value) => {
      setTokenState(value);
      persistString(STORAGE_KEYS.token, value);
    },
    [persistString],
  );

  const setRole = useCallback(
    (value) => {
      setUserRole(value);
      persistString(STORAGE_KEYS.userRole, value);
    },
    [persistString],
  );

  const setName = useCallback(
    (value) => {
      setUserName(value);
      persistString(STORAGE_KEYS.userName, value);
    },
    [persistString],
  );

  const loginUser = useCallback(
    async ({ email, password, rememberMe = false }) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, rememberMe }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok || !payload?.success) {
          const message = payload?.message || "Invalid credentials";
          return { success: false, message };
        }

        const authToken = payload.token || payload.accessToken || "";
        const role = payload.user?.role || "";
        const name = payload.user?.name || payload.user?.fullName || "";

        setToken(authToken);
        setRole(role);
        setName(name);

        if (rememberMe) {
          persistString("rememberMe", "true");
        }

        return { success: true, message: payload.message || "Login successful" };
      } catch (error) {
        console.error("Login failed", error);
        return { success: false, message: "Unable to login. Please try again." };
      }
    },
    [persistString, setName, setRole, setToken],
  );

  const logoutUser = useCallback(() => {
    setToken("");
    setRole("");
    setName("");
    setCartItems({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("rememberMe");
    }
  }, [setName, setRole, setToken]);

  const normalizeProductId = useCallback((productOrId) => {
    if (typeof productOrId === "string") {
      return productOrId;
    }
    if (productOrId && typeof productOrId === "object") {
      return productOrId._id || productOrId.id || productOrId.productId || "";
    }
    return "";
  }, []);

  const addToCart = useCallback(
    (productOrId, quantity = 1) => {
      const productId = normalizeProductId(productOrId);
      if (!productId) {
        return;
      }

      setCartItems((prev) => {
        const currentQty = prev[productId] || 0;
        const nextQty = currentQty + quantity;
        return {
          ...prev,
          [productId]: nextQty,
        };
      });
    },
    [normalizeProductId],
  );

  const updateCartQuantity = useCallback((productId, quantity) => {
    setCartItems((prev) => {
      if (!productId) {
        return prev;
      }
      const safeQuantity = Math.max(0, Number.isFinite(quantity) ? Number(quantity) : 0);
      if (safeQuantity === 0) {
        const { [productId]: _removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [productId]: safeQuantity,
      };
    });
  }, []);

  const getCartCount = useCallback(() => {
    return Object.values(cartItems).reduce((total, amount) => total + (Number(amount) || 0), 0);
  }, [cartItems]);

  const getTotalCartAmount = useCallback(() => {
    return Object.entries(cartItems).reduce((total, [productId, qty]) => {
      const quantity = Number(qty) || 0;
      const product = products.find((item) => (item._id || item.id) === productId);
      const price = product?.offerPrice ?? product?.price ?? 0;
      return total + quantity * Number(price || 0);
    }, 0);
  }, [cartItems, products]);

  const canAccessCart = useCallback(() => {
    return userRole !== "admin";
  }, [userRole]);

  const isAdmin = useCallback(() => userRole === "admin", [userRole]);

  const isOwnerUser = useCallback(() => userRole === "owner", [userRole]);

  const contextValue = useMemo(
    () => ({
      products,
      loading,
      router,
      token: tokenState,
      setToken,
      userRole,
      userName,
      currency,
      cartItems,
      loginUser,
      logoutUser,
      addToCart,
      updateCartQuantity,
      getCartCount,
      getTotalCartAmount,
      canAccessCart,
      isAdmin,
      isOwnerUser,
      isOwner: isOwnerUser(),
      setUserRole: setRole,
      setUserName: setName,
    }),
    [
      products,
      loading,
      router,
      tokenState,
      setToken,
      userRole,
      userName,
      currency,
      cartItems,
      loginUser,
      logoutUser,
      addToCart,
      updateCartQuantity,
      getCartCount,
      getTotalCartAmount,
      canAccessCart,
      isAdmin,
      isOwnerUser,
      setRole,
      setName,
    ],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
