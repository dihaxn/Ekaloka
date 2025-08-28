// components/Navbar.jsx
"use client"
import React, { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {
    const { isOwner, isOwnerUser, router, token, logoutUser, canAccessCart, userRole, userName } = useAppContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
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
        logoutUser();
        setAccountDropdownOpen(false);
    }

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

                        {isClient && <>
                        {canAccessCart() && (
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
                        )}

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
                                <span>{token ? (userName || (isOwnerUser() ? 'Owner' : 'User')) : 'Account'}</span>
                            </button>

                            {/* Dropdown Menu for Logged-in Users */}
                            {accountDropdownOpen && token && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                                    {/* User Info Header */}
                                    <div className="px-4 py-2 border-b border-gray-700">
                                        <div className="text-sm text-gray-300">
                                            <div className="font-medium text-white">{userName || (isOwnerUser() ? 'Owner' : 'User')}</div>
                                            <div className="text-xs text-gray-400">{userRole}</div>
                                        </div>
                                    </div>

                                    {/* Regular User Options */}
                                    {userRole === 'user' && (
                                        <>
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
                                        </>
                                    )}

                                    {/* Owner Options */}
                                    {isOwnerUser() && (
                                        <>
                                            <Link 
                                                href="/owner/dashboard" 
                                                className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                                onClick={() => setAccountDropdownOpen(false)}
                                            >
                                                Owner Dashboard
                                            </Link>
                                            <div className="border-t border-gray-700 my-1"></div>
                                            <Link 
                                                href="/owner/products" 
                                                className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                                onClick={() => setAccountDropdownOpen(false)}
                                            >
                                                Manage Products
                                            </Link>
                                            <Link 
                                                href="/owner/products/add" 
                                                className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                                onClick={() => setAccountDropdownOpen(false)}
                                            >
                                                Add Product
                                            </Link>
                                            <Link 
                                                href="/owner/orders" 
                                                className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                                onClick={() => setAccountDropdownOpen(false)}
                                            >
                                                View Orders
                                            </Link>
                                            <Link 
                                                href="/owner/analytics" 
                                                className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                                onClick={() => setAccountDropdownOpen(false)}
                                            >
                                                Analytics
                                            </Link>
                                            <Link 
                                                href="/owner/customers" 
                                                className="block px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                                onClick={() => setAccountDropdownOpen(false)}
                                            >
                                                Customers
                                            </Link>
                                            <div className="border-t border-gray-700 my-1"></div>
                                        </>
                                    )}

                                    {/* Common Options for All Logged-in Users */}
                                    <div className="border-t border-gray-700 my-1"></div>
                                                                        
                                    <button 
                                         onClick={logout}
                                         className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-800 hover:text-amber-400"
                                     >
                                         Sign Out
                                    </button>
                                </div>
                            )}
                        </div>


                        </>}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-4">
                        {isClient && isOwnerUser() && (
                            <button
                                onClick={() => router.push('/seller')}
                                                                 className="hidden md:block px-3 py-1 rounded-all transition-all duration-300 ease-out bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-medium hover:from-amber-600 hover:to-amber-500"
                            >
                                Owner
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
                                                 <Link href="/" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                             Home
                         </Link>
                         <Link href="/all-products" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                             Shop
                         </Link>
                         <Link href="/about" className="text-xl text-gray-200 hover:text-amber-400 transition-colors py-2 border-b border-gray-800" onClick={closeMobileMenu}>
                             About
                         </Link>

                        {/* Mobile Account Section */}
                        {token ? (
                            <div className="pt-4 border-t border-gray-800">
                                <div className="mb-4">
                                    <div className="text-sm text-gray-400 mb-2">
                                        {userName || (isOwnerUser() ? 'Owner' : 'User')}
                                    </div>
                                    <div className="text-lg font-medium text-white">{userRole}</div>
                                </div>
                                
                                {/* Regular User Options */}
                                {userRole === 'user' && (
                                    <div className="space-y-2">
                                                                                                                              <Link href="/profile" className="block text-gray-200 hover:text-amber-400 py-2" onClick={closeMobileMenu}>
                                                 Profile
                                             </Link>
                                                                                      <Link href="/my-orders" className="block text-gray-200 hover:text-amber-400 py-2" onClick={closeMobileMenu}>
                                                 My Orders
                                             </Link>
                                    </div>
                                )}

                                {/* Owner User Options */}
                                {isOwnerUser() && (
                                    <div className="space-y-2">
                                        <div className="text-amber-400 font-medium py-1 border-b border-gray-700 mb-2">
                                            Owner Management Panel
                                        </div>
                                        <Link href="/owner/dashboard" className="block text-gray-200 hover:text-amber-400 py-2 pl-2" onClick={closeMobileMenu}>
                                            📊 Owner Dashboard
                                        </Link>
                                        <div className="text-amber-400 font-medium py-1 border-b border-gray-700 mb-2 mt-3">
                                            Product Management
                                        </div>
                                        <Link href="/owner/products" className="block text-gray-200 hover:text-amber-400 py-2 pl-2" onClick={closeMobileMenu}>
                                            🛍️ Manage Products
                                        </Link>
                                        <Link href="/owner/products/add" className="block text-gray-200 hover:text-amber-400 py-2 pl-2" onClick={closeMobileMenu}>
                                            ➕ Add Product
                                        </Link>
                                        <div className="text-amber-400 font-medium py-1 border-b border-gray-700 mb-2 mt-3">
                                            Order Management
                                        </div>
                                        <Link href="/owner/orders" className="block text-gray-200 hover:text-amber-400 py-2 pl-2" onClick={closeMobileMenu}>
                                            📋 View Orders
                                        </Link>
                                        <Link href="/owner/analytics" className="block text-gray-200 hover:text-amber-400 py-2 pl-2" onClick={closeMobileMenu}>
                                            📈 Analytics & Reports
                                        </Link>
                                        <div className="text-amber-400 font-medium py-1 border-b border-gray-700 mb-2 mt-3">
                                            Legacy Access
                                        </div>
                                        <Link href="/admin/dashboard" className="block text-gray-200 hover:text-amber-400 py-2 pl-2" onClick={closeMobileMenu}>
                                            🔧 Legacy Admin
                                        </Link>
                                    </div>
                                )}

                                {/* Common Options */}
                                <div className="pt-4 border-t border-gray-800">
                                        <button 
                                             onClick={() => {
                                                 logout();
                                                 closeMobileMenu();
                                             }}
                                             className="block w-full text-left text-gray-200 hover:text-amber-400 py-2"
                                         >
                                             Sign Out
                                         </button>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-gray-800">
                                
                            </div>
                        )}

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
                                {canAccessCart() && (
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
                                )}
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;