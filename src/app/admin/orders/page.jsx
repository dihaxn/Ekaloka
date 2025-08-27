'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/admin/Navbar";

const AdminOrders = () => {
    const { currency, userRole, token } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

        const fetchAdminOrders = async () => {
            setOrders(orderDummyData);
            setLoading(false);
        };

        fetchAdminOrders();
    }, [token, userRole]);

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
                            Admin Orders Management
                        </h1>
                        <p className="text-gray-400 text-lg">
                            View and manage all customer orders across the platform
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="bg-gray-800/30 rounded-lg border border-amber-500/10 backdrop-blur-lg">
                            {orders.map((order, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-500/30 hover:bg-amber-500/5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer group">
                                    <div className="flex-1 flex gap-5 max-w-80">
                                        <div className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors duration-300">
                                            <Image
                                                className="max-w-16 max-h-16 object-cover rounded"
                                                src={assets.box_icon}
                                                alt="box_icon"
                                                width={64}
                                                height={64}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <span className="font-medium text-gray-100 group-hover:text-amber-300 transition-colors duration-300">
                                                {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
                                            </span>
                                            <span className="text-gray-400">Items : {order.items.length}</span>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 leading-relaxed">
                                        <span className="font-medium text-gray-100 block">{order.address.fullName}</span>
                                        <span className="block">{order.address.area}</span>
                                        <span className="block">{`${order.address.city}, ${order.address.state}`}</span>
                                        <span className="block">{order.address.phoneNumber}</span>
                                    </div>
                                    <p className="font-semibold my-auto text-amber-500 text-lg group-hover:text-amber-400 transition-colors duration-300">
                                        {currency}{order.amount}
                                    </p>
                                    <div className="flex flex-col text-gray-400 space-y-1">
                                        <span className="text-green-400 font-medium">Method : COD</span>
                                        <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                        <span className="text-red-400 font-medium">Payment : Pending</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                                            View Details
                                        </button>
                                        <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                                            Update Status
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminOrders;
