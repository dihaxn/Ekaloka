import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => (
  <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 my-16 rounded-xl overflow-hidden bg-gradient-to-r from-amber-900/30 via-gray-900 to-amber-900/30 border border-amber-500/20 transition-all duration-700 hover:border-amber-500/40">
    {/* Left Image */}
    <div className="relative group">
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
      <Image
        className="max-w-56 group-hover:scale-105 transition-transform duration-500 rounded-lg w-56 h-56 object-cover"
        src={assets.fashion_accessories}
        alt="Fashion Accessories"
        width={224}
        height={224}
      />
    </div>

    {/* Center Content */}
    <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
      <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px] text-white">
        Elevate Your Style Game
      </h2>
      <p className="max-w-[343px] font-medium text-gray-300/80">
        From runway trends to everyday elegance—everything you need to look your best
      </p>
      <button
        className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-amber-800 hover:bg-amber-700 rounded text-white transition-colors duration-300 ease-in-out hover:shadow-lg"
      >
        Shop Collection
      </button>
    </div>

    {/* Right Image */}
    <div className="relative group mt-8 md:mt-0">
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
      <Image
        className="hidden md:block max-w-80 group-hover:scale-105 transition-transform duration-500 rounded-lg w-80 h-80 object-cover"
        src={assets.fashion_lifestyle}
        alt="Fashion Lifestyle"
        width={320}
        height={320}
      />
      <Image
        className="md:hidden group-hover:scale-105 transition-transform duration-500 rounded-lg w-72 h-72 object-cover"
        src={assets.fashion_lifestyle}
        alt="Fashion Lifestyle Small"
        width={280}
        height={280}
      />
    </div>
  </div>
);

export default Banner;






