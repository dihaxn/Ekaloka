'use client'
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Footer from "@/components/admin/Footer";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";

const AdminDashboardWithSidebar = () => {
    const { userRole, token } = useAppContext();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        offerPrice: '',
        images: []
    });

    useEffect(() => {
        // Check if user is admin
        if (token && !isOwnerUser()) {
            router.push('/');
            return;
        }
        
        if (!token) {
            router.push('/login');
            return;
        }
    }, [token, userRole, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your API
        console.log('Product data:', formData);
        alert('Product added successfully!');
        router.push('/admin/products');
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <Navbar />
                
                {/* Main Content Area */}
                <div className="flex-1 p-6 md:p-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-white mb-4">
                                Add New Product
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Create a new product for the platform
                            </p>
                        </div>

                        <div className="bg-gray-800/30 rounded-lg border border-amber-500/10 backdrop-blur-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Product Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        placeholder="Enter product description"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Category
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Clothing">Clothing</option>
                                            <option value="Books">Books</option>
                                            <option value="Home">Home</option>
                                            <option value="Sports">Sports</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Product Price
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Offer Price
                                        </label>
                                        <input
                                            type="number"
                                            name="offerPrice"
                                            value={formData.offerPrice}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                                    >
                                        ADD PRODUCT
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push('/admin/products')}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default AdminDashboardWithSidebar;
