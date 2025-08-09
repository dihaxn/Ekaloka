'use client'
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const ProductList = () => {
    const { router } = useAppContext()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchSellerProduct = async () => {
        setProducts(productsDummyData)
        setLoading(false)
    }

    useEffect(() => {
        fetchSellerProduct();
    }, [])

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-gray-400">
            {loading ? <Loading /> : 
            <div className="w-full md:p-10 p-4 animate-fade-in-up">
                <h2 className="pb-4 text-lg font-medium text-amber-500 border-b-2 border-amber-500 w-fit mb-8 bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                    All Products
                </h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-gray-800/30 border border-amber-500/10 backdrop-blur-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
                    <table className="table-fixed w-full overflow-hidden">
                        <thead className="text-gray-100 text-sm text-left bg-black/30">
                            <tr>
                                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium border-b-2 border-amber-500/30">Product</th>
                                <th className="px-4 py-3 font-medium border-b-2 border-amber-500/30 max-sm:hidden">Category</th>
                                <th className="px-4 py-3 font-medium border-b-2 border-amber-500/30">Price</th>
                                <th className="px-4 py-3 font-medium border-b-2 border-amber-500/30 max-sm:hidden">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-400">
                            {products.map((product, index) => (
                                <tr key={index} className="border-t border-gray-500/20 hover:bg-amber-500/5 transition-all duration-300 group">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                                        <div className="bg-gray-500/10 rounded-lg p-2 border border-amber-500/10 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all duration-300">
                                            <Image
                                                src={product.image[0]}
                                                alt="product Image"
                                                className="w-16 rounded"
                                                width={64}
                                                height={64}
                                            />
                                        </div>
                                        <span className="truncate w-full text-gray-100 group-hover:text-amber-300 transition-colors duration-300">
                                            {product.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 max-sm:hidden group-hover:text-gray-300 transition-colors duration-300">
                                        {product.category}
                                    </td>
                                    <td className="px-4 py-3 text-amber-500 font-semibold group-hover:text-amber-400 transition-colors duration-300">
                                        ${product.offerPrice}
                                    </td>
                                    <td className="px-4 py-3 max-sm:hidden">
                                        <button 
                                            onClick={() => router.push(`/product/${product._id}`)} 
                                            className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-600 text-white rounded-md hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 group/btn"
                                        >
                                            <span className="hidden md:block group-hover/btn:text-gray-100">Visit</span>
                                            <Image
                                                className="h-3.5 group-hover/btn:scale-110 transition-transform duration-300"
                                                src={assets.redirect_icon}
                                                alt="redirect_icon"
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default ProductList;