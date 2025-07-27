import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 my-16 rounded-xl overflow-hidden bg-gradient-to-r from-amber-900/30 via-gray-900 to-amber-900/30 border border-amber-500/20 transition-all duration-700 hover:border-amber-500/40">
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
        <Image
          className="max-w-56 group-hover:scale-105 transition-transform duration-500"
          src={assets.jbl_soundbox_image}
          alt="jbl_soundbox_image"
          width={224}
          height={224}
        />
      </div>

     <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          Level Up Your Gaming Experience
        </h2>
        <p className="max-w-[343px] font-medium text-gray-500/60">
          From immersive sound to precise controls—everything you need to win
        </p>
        <button
          className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-800 rounded text-white transition-colors duration-300 ease-in-out hover:bg-orange-900 hover:shadow-lg"
        >
          Buy now
        </button>
      </div>

      <div className="relative group mt-8 md:mt-0">
        <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
        <Image
          className="hidden md:block max-w-80 group-hover:scale-105 transition-transform duration-500"
          src={assets.md_controller_image}
          alt="md_controller_image"
          width={320}
          height={320}
        />
        <Image
          className="md:hidden group-hover:scale-105 transition-transform duration-500"
          src={assets.sm_controller_image}
          alt="sm_controller_image"
          width={280}
          height={280}
        />
      </div>
    </div>
  );
};

export default Banner;






