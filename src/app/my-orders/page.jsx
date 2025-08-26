'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";

const MyOrders = () => {

    const { currency } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            
            if (!token) {
                setOrders([]);
                return;
            }

            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.orders) {
                    setOrders(data.orders);
                } else {
                    setOrders([]);
                }
            } else {
                console.error('Failed to fetch orders');
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
            <div className="bg-gradient-to-r from-black via-gray-900 to-black">

            <div >
                <Navbar />
                <br />
                <br />
                <br />
            </div>
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen text-gray-500/80">
                <div className="space-y-5">
                    <div className="flex flex-col items-start">
                    <div className="flex flex-col items-end pt-12">
                        <p className="text-2xl font-medium">My Orders</p>
                        <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                    </div>
                    </div>  
                    <br/>
                    {loading ? <Loading /> : (
                        orders && orders.length > 0 ? (
                            <div className="max-w-5xl border-t border-gray-300 text-sm">
                                {orders.map((order, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                        <div className="flex-1 flex gap-5 max-w-80">
                                            <Image
                                                className="max-w-16 max-h-16 object-cover"
                                                src={assets.box_icon}
                                                alt="box_icon"
                                                width={64}
                                                height={64}
                                            />
                                            <p className="flex flex-col gap-3">
                                                <span className="font-medium text-base">
                                                    {order.items && order.items.length > 0 
                                                        ? order.items.map((item) => 
                                                            item.product && item.product.name 
                                                                ? `${item.product.name} x ${item.quantity || 1}`
                                                                : 'Unknown Product'
                                                          ).join(", ")
                                                        : 'No items'
                                                    }
                                                </span>
                                                <span>Items : {order.items ? order.items.length : 0}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <span className="font-medium">
                                                    {order.address && order.address.fullName ? order.address.fullName : 'N/A'}
                                                </span>
                                                <br />
                                                <span>{order.address && order.address.area ? order.address.area : 'N/A'}</span>
                                                <br />
                                                <span>
                                                    {order.address && order.address.city && order.address.state 
                                                        ? `${order.address.city}, ${order.address.state}`
                                                        : 'N/A'
                                                    }
                                                </span>
                                                <br />
                                                <span>{order.address && order.address.phoneNumber ? order.address.phoneNumber : 'N/A'}</span>
                                            </p>
                                        </div>
                                        <p className="font-medium my-auto">{currency}{order.amount || 0}</p>
                                        <div>
                                            <p className="flex flex-col">
                                                <span>Method : COD</span>
                                                <span>Date : {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</span>
                                                <span>Payment : Pending</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                                    <Image
                                        src={assets.box_icon}
                                        alt="No orders"
                                        width={48}
                                        height={48}
                                        className="opacity-50"
                                    />
                                </div>
                                <h3 className="text-xl font-medium text-gray-400 mb-2">No Orders Yet</h3>
                                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                                <button 
                                    onClick={() => window.history.back()}
                                    className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyOrders;