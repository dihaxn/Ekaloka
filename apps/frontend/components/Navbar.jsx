// components/Navbar.jsx
"use client"
import React, { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {
    const { isSeller, router, token, setToken, products } = useAppContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navbarRef = useRef(null);
    const accountDropdownRef = useRef(null);
    const [navbarHeight, setNavbarHeight] = useState(0);

    // Update navbar height on mount and when mobile menu opens/closes
    useEffect(() => {
        setIsClient(true);
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight);
        }
    }, [mobileMenuOpen]);

    // Close account dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setAccountDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu when a link is clicked
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setAccountDropdownOpen(false);
        router.push("/");
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        // Delay blur to allow click on search results
        setTimeout(() => {
            setIsSearchFocused(false);
        }, 200);
    };

    const filteredProducts = searchQuery
        ? products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <nav
            ref={navbarRef}
            className="fixed w-full z-50 bg-transparent bg-gradient-to-r from-black via-gray-900 to-black py-4 shadow-xl"
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div
                            className="flex items-center cursor-pointer group"
                            onClick={() => router.push('/')}
                        >
                            <div className="bg-gradient-to-r from-amber-500 to-amber-300 p-1.5 rounded-lg mr-3 group-hover:rotate-12 transition-transform">
                                <div className="bg-black p-1 rounded-md">
                                    <span className="text-amber-400 font-bold text-xl">DF</span>
                                </div>
                            </div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">
                                Dai Fashion
                            </h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link href="/" className="relative group">
                            <span className="text-gray-500/80 group-hover:text-amber-400 transition-colors duration-300">
                                Home
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/all-products" className="relative group">
                            <span className="text-gray-500/80 group-hover:text-amber-400 transition-colors duration-300">
                                Shop
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/about" className="relative group">
                            <span className="text-gray-500/80 group-hover:text-amber-400 transition-colors duration-300">
                                About
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                       
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <div className="relative group" onFocus={handleSearchFocus} onBlur={handleSearchBlur}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-48 px-3 py-1.5 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                            <Image
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 cursor-pointer transition-transform duration-300 group-hover:scale-125 group-hover:brightness-125"
                                src={assets.search_icon}
                                alt="search icon"
                                width={20}
                                height={20}
                                style={{ filter: 'invert(100%)' }}
                            />
                            {isSearchFocused && searchQuery && (
                                <div className="absolute top-full mt-2 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.slice(0, 5).map(product => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product._id}`}
                                                className="flex items-center p-2 hover:bg-gray-800"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setIsSearchFocused(false);
                                                }}
                                            >
                                                <Image src={product.image[0]} alt={product.name} width={40} height={40} className="w-10 h-10 object-cover rounded-md mr-3" />
                                                <span className="text-white">{product.name}</span>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-3 text-gray-400">No products found.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {isClient && <>
                        <Link href="/cart" className="relative group" aria-label="Cart">
                            <Image
                                className="w-5 h-5 cursor-pointer transition-transform duration-300 group-hover:scale-125 group-hover:brightness-125"
                                src={assets.cart_icon}
                                alt="cart icon"
                                width={20}
                                height={20}
                                style={{ filter: 'invert(100%)' }}
                            />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </Link>

                        {/* Account Dropdown */}
                        <div className="relative" ref={accountDropdownRef}>
                            <button
                                onClick={() => {
                                    if (token) {
                                        setAccountDropdownOpen(!accountDropdownOpen);
                                    } else {
                                        router.push('/login');
                                    }
                                }}
                                className="flex items-center gap-2 group hover:text-amber-400 transition-colors duration-300"
                            >
                                <Image
                                    src={assets.user_icon}
                                    alt="user icon"
                                    width={20}
                                    height={20}
                                    className="transition-transform duration-300 group-hover:scale-110 group-hover:brightness-125"
                                    style={{ filter: 'invert(100%)' }}
                                />
                                <span>Account</span>
                            </button>

                            {/* Dropdown Menu */}
                            {accountDropdownOpen && token && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                                   
                                   <Link 
                                        href="/profile" 
                                        className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                        onClick={() => setAccountDropdownOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link 
                                        href="/my-orders" 
                                        className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                        onClick={() => setAccountDropdownOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                     <Link 
                                        href="/login" 
                                        className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                        onClick={() => setAccountDropdownOpen(false)}
                                    >
                                        Login
                                    </Link>
                                     <Link 
                                        href="/signup" 
                                        className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                        onClick={() => setAccountDropdownOpen(false)}
                                    >
                                        Sign-up
                                    </Link>
                                    <button 
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                        {isSeller && (
                            <button
                                onClick={() => router.push('/seller')}
                                className="px-4 py-1.5 rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-amber-500 to-amber-400 text-black text-sm font-medium hover:from-amber-600 hover:to-amber-500 hover:shadow-lg"
                            >
                                Seller Dashboard
                            </button>
                        )}
                        </>}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-4">
                        {isClient && isSeller && (
                            <button
                                onClick={() => router.push('/seller')}
                                className="hidden md:block px-3 py-1 rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-medium hover:from-amber-600 hover:to-amber-500"
                            >
                                Seller
                            </button>
                        )}

                        {isClient && <button
                            onClick={() => router.push('/login')}
                            className="flex items-center gap-1 text-gray-200 group"
                        >
                            <Image
                                src={assets.user_icon}
                                alt="user icon"
                                width={20}
                                height={20}
                                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:brightness-125"
                                style={{ filter: 'invert(100%)' }}
                            />
                        </button>}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-200 focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden left-0 w-full bg-black transition-all duration-500 overflow-hidden ${
                    mobileMenuOpen ? "opacity-100" : "opacity-0"
                }`}
                style={{
                    position: 'fixed',
                    top: `${navbarHeight}px`,
                    height: mobileMenuOpen ? `calc(100vh - ${navbarHeight}px)` : '0'
                }}
            >
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col space-y-6">
                        <div className="relative" onFocus={handleSearchFocus} onBlur={handleSearchBlur}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                             {isSearchFocused && searchQuery && (
                                <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.slice(0, 5).map(product => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product._id}`}
                                                className="flex items-center p-2 hover:bg-gray-800"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setIsSearchFocused(false);
                                                    closeMobileMenu();
                                                }}
                                            >
                                                <Image src={product.image[0]} alt={product.name} width={40} height={40} className="w-10 h-10 object-cover rounded-md mr-3" />
                                                <span className="text-white">{product.name}</span>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-3 text-gray-400">No products found.</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <Link href="/" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                            Home
                        </Link>
                        <Link href="/all-products" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                            Shop
                        </Link>
                        <Link href="/" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                            About
                        </Link>
                

                        <div className="pt-6 flex justify-between items-center">
                            <div className="flex space-x-6">
                                <Link href="/cart" className="p-2 rounded-full bg-gray-800" onClick={closeMobileMenu}>
                                    <Image
                                        className="w-5 h-5 cursor-pointer"
                                        src={assets.cart_icon}
                                        alt="cart icon"
                                        width={20}
                                        height={20}
                                        style={{ filter: 'invert(100%)' }}
                                    />
                                </Link>
                            </div>

                            {isClient && isSeller && (
                                <button
                                    onClick={() => {
                                        router.push('/seller');
                                        closeMobileMenu();
                                    }}
                                    className="px-4 py-2 rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-amber-700 to-amber-600 text-black text-sm font-medium hover:from-amber-700 hover:to-amber-800"
                                >
                                    Seller Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;