import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { currency, router, addToCart, canAccessCart } = useAppContext();

    return (
        <div
            onClick={(e) => {
                // Only navigate when not clicking on buttons
                if (!e.target.closest('button')) {
                    router.push('/product/' + product._id);
                    window.scrollTo(0, 0);
                }
            }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer group"
        >
            {/* Product Image Container */}
                         <div className="relative bg-gray-800/50 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden border border-gray-700/50 group-hover:border-amber-500/50 transition-all duration-300">
                {/* Product Image */}
                <Image
                    src={product.image[0] || assets.placeholder_image}
                    alt={product.name}
                    className="group-hover:scale-105 transition-transform duration-500 object-contain w-4/5 h-4/5 md:w-full md:h-full"
                    width={800}
                    height={800}
                />
                
                {/* Wishlist Button */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        // Handle wishlist functionality here
                    }}
                                         className="absolute top-2 right-2 bg-gray-900/80 p-2 rounded-full shadow-md hover:bg-amber-500/90 transition-colors duration-300 z-10"
                >
                    <Image
                        className="h-3 w-3 invert opacity-80 group-hover:opacity-100 group-hover:invert-0 transition-all"
                        src={assets.heart_icon}
                        alt="heart_icon"
                        width={12}
                        height={12}
                    />
                </button>
                
                {/* Add to Cart Button
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-amber-300 p-2 rounded-full shadow-lg hover:from-amber-400 hover:to-amber-200 transition-all duration-300 transform hover:scale-110 z-10"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-gray-900" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M10 2a1 1 0 011 1v1h3a1 1 0 110 2h-1v3a1 1 0 11-2 0V6H8v3a1 1 0 11-2 0V6H5a1 1 0 110-2h3V3a1 1 0 011-1zm-5 9a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                </button>
                 */}
                {/* Quick Buy Button - Visible on Mobile */}
                {canAccessCart() && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                                         className="absolute bottom-3 left-3 px-3 py-1 text-xs bg-gradient-to-r from-amber-500/80 to-amber-300/80 rounded-full text-gray-900 font-medium hover:from-amber-400 hover:to-amber-300 transition-all duration-300 transform hover:scale-105 md:hidden"
                >
                    Buy
                </button>
                )}
            </div>

            {/* Product Name */}
                         <p className="md:text-base font-medium pt-2 w-full truncate text-white group-hover:text-amber-400 transition-colors">
                 {product.name}
             </p>
            
            {/* Product Description */}
            <p className="w-full text-xs text-gray-400 max-sm:hidden truncate">
                {product.description}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <svg
                            key={index}
                            className={`h-3 w-3 ${index < Math.floor(4.5) ? 'text-amber-400' : 'text-gray-600'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path 
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
                            />
                        </svg>
                    ))}
                </div>
                <p className="text-xs text-gray-400">{4.5}</p>
            </div>

            {/* Price and Buy Button */}
            <div className="flex items-end justify-between w-full mt-1.5">
                <div>
                                         <p className="text-base font-medium text-amber-400">
                         {currency}{product.offerPrice}
                     </p>
                    {product.originalPrice && (
                        <p className="text-xs text-gray-500 line-through">
                            {currency}{product.originalPrice}
                        </p>
                    )}
                </div>
                
                {/* Buy Now Button - Visible on Desktop */}
                {canAccessCart() && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className="px-4 py-1.5 text-xs  bg-gradient-to-r from-gray-700/50 to-gray-500/50 rounded-full text-gray-500 font-medium hover:from-gray-500/50 hover:to-gray-700/50 transition-all duration-300 transform hover:scale-105 max-sm:hidden"
                >
                    Buy now
                </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;