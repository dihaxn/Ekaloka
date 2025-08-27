import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Spinner from "./Spinner";

const TopSellings = () => {
  const { products, loading } = useAppContext();

  // Filter products to show only top-selling ones (for demo, we'll show first 4 products)
  // In a real app, you'd filter by sales data, ratings, views, or popularity metrics
  const topSellingProducts = products?.filter(product => 
    // For demo purposes, show products with ratings >= 4.0 or first 4 products
    product.rating >= 4.0 || products.indexOf(product) < 4
  ).slice(0, 4) || [];

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium text-white">Top Sellings for This Week</p>
        <div className="w-28 h-0.5 bg-amber-600 mt-2"></div>
      </div>

      {topSellingProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-amber-500/20 to-amber-300/20 rounded-full flex items-center justify-center border border-amber-500/30">
              <svg 
                className="w-12 h-12 text-amber-400/60" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300">No Top Products Available</h3>
            <p className="text-gray-400 max-w-md">
              We're currently updating our top-selling products. Check back soon for the latest trending items!
            </p>
            <button className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors duration-300">
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {topSellingProducts.map((product, index) => (
              <div key={product._id || index} className="relative">
                {/* Top Selling Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    #{index + 1} Top
                  </div>
                </div>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* View All Top Products Button */}
          <div className="flex justify-center mt-8">
            <button className="px-8 py-3 border border-amber-500/70 rounded text-amber-400/80 hover:border-amber-400 hover:text-amber-300 transition-colors duration-300 hover:bg-amber-500/10">
              View All Top Products
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopSellings;
