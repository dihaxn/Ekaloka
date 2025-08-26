'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {
    const { currency } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSellerOrders = async () => {
        setOrders(orderDummyData);
        setLoading(false);
    }

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    return (
        <div className="flex-1 h-screen overflow-y-auto flex flex-col justify-between text-sm bg-gradient-to-br from-black via-gray-900 to-black text-gray-400">
            {loading ? <Loading /> : 
            <div className="md:p-10 p-4 space-y-5 animate-fade-in-up">
                <h2 className="text-lg font-medium text-amber-500 border-b-2 border-amber-500 pb-2 w-fit mb-8 bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                    Orders
                </h2>
                <div className="max-w-4xl rounded-md bg-gray-800/30 border border-amber-500/10 backdrop-blur-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
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
                        </div>
                    ))}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;
