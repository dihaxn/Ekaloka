import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <div className="bg-gradient-to-r from-black via-gray-900 to-black border-t border-gray-500/30 backdrop-blur-lg">
            <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-6 md:px-10 py-6">
                {/* Brand and Copyright Section */}
                <div className="flex items-center gap-4 group">
                    {/* Enhanced Logo */}
                    <div className="hidden md:flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-300 p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300">
                            <div className="bg-black p-1 rounded-md">
                                <span className="text-amber-400 font-bold text-lg">DF</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                                Dai Fashion
                            </h2>
                        </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-amber-500/60 to-transparent"></div>
                    
                    {/* Copyright Text */}
                    <div className="py-4 text-center md:text-left">
                        <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            Copyright {currentYear} © Dai Fashion. All Rights Reserved.
                        </p>
                        <p className="text-xs text-gray-500 mt-1 hidden md:block">
                            Admin Dashboard • Powered by Next.js
                        </p>
                    </div>
                </div>

                {/* Enhanced Social Media Icons */}
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="flex items-center gap-3">
                        <a 
                            href="#" 
                            className="bg-gray-800/50 p-3 rounded-full hover:bg-amber-500/20 border border-gray-700 hover:border-amber-500/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-500/20 group"
                            aria-label="Facebook"
                        >
                            <Image 
                                src={assets.facebook_icon} 
                                alt="facebook_icon" 
                                width={20}
                                height={20}
                                className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" 
                            />
                        </a>
                        <a 
                            href="#" 
                            className="bg-gray-800/50 p-3 rounded-full hover:bg-amber-500/20 border border-gray-700 hover:border-amber-500/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-500/20 group"
                            aria-label="Twitter"
                        >
                            <Image 
                                src={assets.twitter_icon} 
                                alt="twitter_icon" 
                                width={20}
                                height={20}
                                className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" 
                            />
                        </a>
                        <a 
                            href="#" 
                            className="bg-gray-800/50 p-3 rounded-full hover:bg-amber-500/20 border border-gray-700 hover:border-amber-500/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-500/20 group"
                            aria-label="Instagram"
                        >
                            <Image 
                                src={assets.instagram_icon} 
                                alt="instagram_icon" 
                                width={20}
                                height={20}
                                className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" 
                            />
                        </a>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="hidden lg:flex items-center ml-4 space-x-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Border Accent */}
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        </div>
    );
};

export default Footer;
