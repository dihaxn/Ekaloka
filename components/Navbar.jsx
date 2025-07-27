// components/Navbar.jsx
"use client"
import React, { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";

const Navbar = () => {
    const { isSeller, router } = useAppContext();
    const { openSignIn } = useClerk();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navbarRef = useRef(null);
    const [navbarHeight, setNavbarHeight] = useState(0);

    // Update navbar height on mount and when mobile menu opens/closes
    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight);
        }
    }, [mobileMenuOpen]);

    // Close mobile menu when a link is clicked
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

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
                        <Link href="/my-orders" className="relative group">
                            <span className="text-gray-500/80 group-hover:text-amber-400 transition-colors duration-300">
                                Orders
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/" className="relative group">
                            <span className="text-gray-500/80 group-hover:text-amber-400 transition-colors duration-300">
                                About
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/" className="relative group">
                            <span className="text-gray-500/80 group-hover:text-amber-400 transition-colors duration-300">
                                Contact
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <div className="relative group">
                            <Image
                                className="w-5 h-5 cursor-pointer transition-transform duration-300 group-hover:scale-125 group-hover:brightness-125"
                                src={assets.search_icon}
                                alt="search icon"
                                width={20}
                                height={20}
                                style={{ filter: 'invert(100%)' }}
                            />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </div>

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

                        <button
                            onClick={openSignIn}
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

                        {isSeller && (
                            <button
                                onClick={() => router.push('/seller')}
                                className="px-4 py-1.5 rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-amber-500 to-amber-400 text-black text-sm font-medium hover:from-amber-600 hover:to-amber-500 hover:shadow-lg"
                            >
                                Seller Dashboard
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-4">
                        {isSeller && (
                            <button
                                onClick={() => router.push('/seller')}
                                className="hidden md:block px-3 py-1 rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-medium hover:from-amber-600 hover:to-amber-500"
                            >
                                Seller
                            </button>
                        )}

                        <button
                            onClick={openSignIn}
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
                        </button>

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
                        <Link href="/" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                            Home
                        </Link>
                        <Link href="/all-products" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                            Shop
                        </Link>
                        <Link href="/my-orders" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                            Orders
                        </Link>
                        <Link href="/" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                            About
                        </Link>
                        <Link href="/" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                            Contact
                        </Link>

                        <div className="pt-6 flex justify-between items-center">
                            <div className="flex space-x-6">
                                <div className="p-2 rounded-full bg-gray-800">
                                    <Image
                                        className="w-5 h-5 cursor-pointer"
                                        src={assets.search_icon}
                                        alt="search icon"
                                        width={20}
                                        height={20}
                                        style={{ filter: 'invert(100%)' }}
                                    />
                                </div>
                                <div className="p-2 rounded-full bg-gray-800">
                                    <Image
                                        className="w-5 h-5 cursor-pointer"
                                        src={assets.cart_icon}
                                        alt="cart icon"
                                        width={20}
                                        height={20}
                                        style={{ filter: 'invert(100%)' }}
                                    />
                                </div>
                            </div>

                            {isSeller && (
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