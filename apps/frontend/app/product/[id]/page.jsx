"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart } = useAppContext();
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const product = products.find((product) => product._id === id);
    setProductData(product);
    setTimeout(() => setIsLoading(false), 300);
  }, [id, products.length]);

  if (isLoading || !productData) return <Loading />;

  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black min-h-screen flex flex-col">
      {/* Global animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>

      <Navbar />
      <br />
      <br />
      <br />

      <main className="flex-1 px-6 md:px-16 lg:px-32 pt-14 space-y-10 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/50 mb-6 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <Image
                src={mainImage || productData.image?.[0] || assets.placeholder}
                alt={productData.name}
                className="w-full h-auto object-contain mix-blend-multiply transition-all duration-500 group-hover:scale-105"
                width={1280}
                height={720}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productData.image?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`cursor-pointer rounded-xl overflow-hidden bg-gray-800/50 border ${
                    (mainImage || productData.image[0]) === image
                      ? "border-amber-500"
                      : "border-gray-700/50"
                  } transition-all duration-300 hover:border-amber-400`}
                >
                  <Image
                    src={image}
                    alt={productData.name}
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={300}
                    height={300}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col animate-fadeIn delay-100">
            <h1 className="text-3xl font-bold text-gray-500/80 mb-4">
              {productData.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className="h-5 w-5 text-amber-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500/80">(4.5)</p>
            </div>
            <p className="mt-4 leading-relaxed">
              {productData.description}
            </p>
            <div className="mt-8">
              <p className="text-3xl font-bold text-amber-400">
                ${productData.offerPrice}
                <span className="text-base font-normal text-gray-500 line-through ml-3">
                  ${productData.price}
                </span>
              </p>
            </div>
            <hr className="border-gray-700 my-8" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-400/80 font-medium py-2">Brand</td>
                    <td className="text-gray-400/80 py-2">Generic</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400/80 font-medium py-2">Color</td>
                    <td className="text-gray-400/80 py-2">Multi</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400/80 font-medium py-2">Category</td>
                    <td className="text-gray-400/80 py-2">
                      {productData.category}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row items-center mt-10 gap-4">
              <button
                onClick={() => addToCart(productData)}
                className="w-full relative overflow-hidden group px-6 py-4 rounded-full "
              >
                <span className="relative z-10 text-white group-hover:text-gray-300 transition-colors duration-300">
                  Add to Cart
                </span>
                <div className="absolute inset-0 bg-gray-700 rounded-full transition-all duration-500 group-hover:bg-gray-900"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              <button
                onClick={() => {
                  addToCart(productData);
                  router.push("/cart");
                }}
                className="w-full relative overflow-hidden group px-6 py-4 rounded-full "
              >
                <span className="relative z-10 text-gray-900 group-hover:text-gray-900 transition-colors duration-300">
                  Buy now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500 group-hover:from-amber-400 group-hover:to-amber-200"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <section className="flex flex-col items-center animate-fadeIn delay-200">
          <div className="flex flex-col items-center mb-4 mt-5">
            <h2 className="text-3xl font-bold">
              Feature Products
            </h2>
                <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product._id || product.id || product.name} product={product} />
            ))}
          </div>
          <button
          onClick={() => { router.push('/all-products') }}
          className="px-12 py-2.5 border border-gray-500/70 rounded text-gray-500/70 hover:border-gray-800 transition"
        >
          See more
        </button>
        <br />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Product;