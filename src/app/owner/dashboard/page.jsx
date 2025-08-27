'use client'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import Footer from '@/components/owner/Footer'

const OwnerDashboard = () => {
    const { userRole } = useAppContext()
    const [stats, setStats] = useState({
        totalProducts: 24,
        totalOrders: 47,
        totalRevenue: 12450,
        totalCustomers: 156,
        pendingOrders: 8,
        completedOrders: 39
    })

    const [recentOrders] = useState([
        { id: '#001', customer: 'John Doe', product: 'Premium Fashion Collection', amount: 299, status: 'Completed' },
        { id: '#002', customer: 'Jane Smith', product: 'Designer Fashion Set', amount: 459, status: 'Processing' },
        { id: '#003', customer: 'Mike Johnson', product: 'Lifestyle Fashion Bundle', amount: 199, status: 'Pending' },
    ])

    const [topProducts] = useState([
        { name: 'Premium Fashion Collection', sales: 45, revenue: 13455 },
        { name: 'Designer Fashion Set', sales: 32, revenue: 14688 },
        { name: 'Lifestyle Fashion Bundle', sales: 28, revenue: 5572 },
    ])

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-gray-400">
            {/* Main Dashboard Content */}
            <div className="p-6 space-y-6 animate-fade-in-up">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Owner Dashboard</h1>
                        <p className="text-gray-400">Welcome back! Here's what's happening with your business today.</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1">
                            <span className="text-amber-400 text-sm font-medium">Role: {userRole}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Products</p>
                                <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
                            </div>
                            <div className="bg-blue-500/20 p-3 rounded-full">
                                <span className="text-2xl">📦</span>
                            </div>
                        </div>
                        <p className="text-green-400 text-xs mt-2">+12% from last month</p>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                            </div>
                            <div className="bg-green-500/20 p-3 rounded-full">
                                <span className="text-2xl">📋</span>
                            </div>
                        </div>
                        <p className="text-green-400 text-xs mt-2">+8% from last month</p>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-amber-500/20 p-3 rounded-full">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                        <p className="text-green-400 text-xs mt-2">+15% from last month</p>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Customers</p>
                                <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
                            </div>
                            <div className="bg-purple-500/20 p-3 rounded-full">
                                <span className="text-2xl">👥</span>
                            </div>
                        </div>
                        <p className="text-green-400 text-xs mt-2">+23% from last month</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                            <button className="text-amber-400 hover:text-amber-300 text-sm">View All</button>
                        </div>
                        <div className="space-y-3">
                            {recentOrders.map((order, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{order.id}</p>
                                        <p className="text-gray-400 text-sm">{order.customer}</p>
                                        <p className="text-gray-500 text-xs">{order.product}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-medium">${order.amount}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            order.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Top Products</h2>
                            <button className="text-amber-400 hover:text-amber-300 text-sm">View All</button>
                        </div>
                        <div className="space-y-3">
                            {topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{product.name}</p>
                                        <p className="text-gray-400 text-sm">{product.sales} sales</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-medium">${product.revenue.toLocaleString()}</p>
                                        <p className="text-green-400 text-xs">Revenue</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button 
                            onClick={() => window.location.href = '/owner/products/add'}
                            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
                        >
                            <span className="block text-2xl mb-2">➕</span>
                            <span className="text-sm font-medium">Add Product</span>
                        </button>
                        <button 
                            onClick={() => window.location.href = '/owner/orders'}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                        >
                            <span className="block text-2xl mb-2">📋</span>
                            <span className="text-sm font-medium">View Orders</span>
                        </button>
                        <button 
                            onClick={() => window.location.href = '/owner/analytics'}
                            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30"
                        >
                            <span className="block text-2xl mb-2">📈</span>
                            <span className="text-sm font-medium">Analytics</span>
                        </button>
                        <button 
                            onClick={() => window.location.href = '/owner/products'}
                            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                        >
                            <span className="block text-2xl mb-2">🛍️</span>
                            <span className="text-sm font-medium">Manage Products</span>
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default OwnerDashboard
