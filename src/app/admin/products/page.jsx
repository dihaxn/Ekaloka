'use client'
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/admin/Navbar";

const AdminProducts = () => {
    const { router, userRole, token } = useAppContext();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        if (token && !isAdmin()) {
            router.push('/');
            return;
        }
        
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchAdminProducts = async () => {
            setProducts(productsDummyData);
            setLoading(false);
        };

        fetchAdminProducts();
    }, [token, userRole, router]);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
                <Navbar />
                <Loading />
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Admin Products Management
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Manage all products across the platform
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-white">All Products</h2>
                            <button 
                                onClick={() => router.push('/admin/products/add')}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Add New Product
                            </button>
                        </div>

                        <div className="bg-gray-800/30 rounded-lg border border-amber-500/10 backdrop-blur-lg">
                            <table className="w-full">
                                <thead className="text-gray-100 text-sm text-left bg-black/30">
                                    <tr>
                                        <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium border-b-2 border-amber-500/30">Product</th>
                                        <th className="px-4 py-3 font-medium border-b-2 border-amber-500/30 max-sm:hidden">Category</th>
                                        <th className="px-4 py-3 font-medium border-b-2 border-amber-500/30">Price</th>
                                        <th className="px-4 py-3 font-medium border-b-2 border-amber-500/30 max-sm:hidden">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-400">
                                    {products.map((product, index) => (
                                        <tr key={index} className="border-t border-gray-500/20 hover:bg-amber-500/5 transition-all duration-300 group">
                                            <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                                                <div className="bg-gray-500/10 rounded-lg p-2 border border-amber-500/10 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-colors duration-300">
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
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => router.push(`/admin/products/edit/${product._id}`)} 
                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => router.push(`/product/${product._id}`)} 
                                                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminProducts;
