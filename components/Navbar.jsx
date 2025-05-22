"use client"
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";

const Navbar = () => {
    const { isSeller, router } = useAppContext();
    const { openSignIn } = useClerk()

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
            <Image
                className="cursor-pointer w-28 md:w-32 opacity-100 hover:opacity-80 transition-opacity duration-300"
                onClick={() => router.push('/')}
                src={assets.logo}
                alt="logo"
            />
            <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
                <Link href="/" className="relative group hover:text-orange-500 transition-colors duration-300">
          <span className="relative">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-px bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </span>
                </Link>
                <Link href="/all-products" className="relative group hover:text-orange-500 transition-colors duration-300">
          <span className="relative">
            Shop
            <span className="absolute bottom-0 left-0 w-0 h-px bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </span>
                </Link>
                <Link href="/" className="relative group hover:text-orange-500 transition-colors duration-300">
          <span className="relative">
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-px bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </span>
                </Link>
                <Link href="/" className="relative group hover:text-orange-500 transition-colors duration-300">
          <span className="relative">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-px bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </span>
                </Link>

                {isSeller && (
                    <button
                        onClick={() => router.push('/seller')}
                        className="text-xs border px-4 py-1.5 rounded-full transition-all duration-300 ease-out hover:bg-orange-500 hover:text-white hover:border-orange-500"
                    >
                        Seller Dashboard
                    </button>
                )}
            </div>

            <ul className="hidden md:flex items-center gap-6 ">
                <Image
                    className="w-4 h-4 cursor-pointer transition-transform duration-300 hover:scale-125 hover:brightness-125"
                    src={assets.search_icon}
                    alt="search icon"
                    style={{ filter: 'hue-rotate(0deg) saturate(2)' }}
                />
                <button
                    onClick={openSignIn}
                    className="flex items-center gap-2 hover:text-orange-500 transition-colors duration-300"
                >
                    <Image
                        src={assets.user_icon}
                        alt="user icon"
                        className="transition-transform duration-300 hover:scale-110 hover:brightness-125"
                    />
                    Account
                </button>
            </ul>

            <div className="flex items-center md:hidden gap-3">
                {isSeller && (
                    <button
                        onClick={() => router.push('/seller')}
                        className="text-xs border px-4 py-1.5 rounded-full transition-all duration-300 ease-out hover:bg-orange-500 hover:text-white hover:border-orange-500"
                    >
                        Seller Dashboard
                    </button>
                )}
                <button
                    onClick={openSignIn}
                    className="flex items-center gap-2 hover:text-orange-500 transition-colors duration-300"
                >
                    <Image
                        src={assets.user_icon}
                        alt="user icon"
                        className="transition-transform duration-300 hover:scale-110 hover:brightness-125"
                    />
                    Account
                </button>
            </div>
        </nav>
    );
};

export default Navbar;