'use client'
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
      bgColor: "from-amber-900/30 to-gray-900"
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few left!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
      bgColor: "from-blue-900/30 to-gray-900"
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_macbook_image,
      bgColor: "from-gray-800/30 to-gray-900"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000); // Increased duration for better UX
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className={`flex flex-col-reverse md:flex-row items-center justify-between py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full bg-gradient-to-r ${slide.bgColor}`}
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-amber-400 font-medium pb-1 animate-pulse">
                {slide.offer}
              </p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-bold text-white tracking-tight">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 gap-4">
                <button className="md:px-10 px-7 md:py-3 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 shadow-lg shadow-amber-900/30">
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 px-6 py-2.5 font-medium text-gray-200 hover:text-white transition-all duration-300">
                  {slide.buttonText2}
                  <Image 
                    className="invert group-hover:translate-x-1 transition-transform duration-300 group-hover:opacity-100 opacity-90" 
                    src={assets.arrow_icon} 
                    alt="arrow_icon" 
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48 transition-transform duration-500 hover:scale-105"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
                width={320}
                height={320}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentSlide === index 
                ? "bg-amber-600 w-8" 
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;