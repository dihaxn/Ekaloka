'use client'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import Footer from '@/components/owner/Footer'

const Analytics = () => {
    const { currency } = useAppContext()
    const [selectedPeriod, setSelectedPeriod] = useState('7d') // Default to 7 days
    const [isLoading, setIsLoading] = useState(false)
    const [analyticsData, setAnalyticsData] = useState(null)

    const periods = [
        { key: '1d', label: 'Daily', days: 1 },
        { key: '7d', label: 'Weekly', days: 7 },
        { key: '30d', label: 'Monthly', days: 30 },
        { key: '90d', label: '3 Months', days: 90 },
        { key: '365d', label: 'Yearly', days: 365 }
    ]

    // Mock data generator based on period
    const generateMockData = (days) => {
        const now = new Date()
        const data = []
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now)
            date.setDate(date.getDate() - i)
            
            // Generate realistic data with some growth trend
            const baseRevenue = 1000 + Math.random() * 2000
            const growthFactor = 1 + (days - i) / days * 0.3 // Growth trend
            const seasonality = 1 + Math.sin(i / 7) * 0.2 // Weekly seasonality
            
            data.push({
                date: date.toISOString().split('T')[0],
                revenue: Math.round(baseRevenue * growthFactor * seasonality),
                orders: Math.round(5 + Math.random() * 15),
                customers: Math.round(3 + Math.random() * 10),
                products_sold: Math.round(8 + Math.random() * 25),
                conversion_rate: (2 + Math.random() * 8).toFixed(2),
                avg_order_value: Math.round(150 + Math.random() * 200)
            })
        }
        
        return data
    }

    // Calculate summary statistics
    const calculateSummary = (data) => {
        if (!data || data.length === 0) return null

        const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
        const totalOrders = data.reduce((sum, d) => sum + d.orders, 0)
        const totalCustomers = data.reduce((sum, d) => sum + d.customers, 0)
        const totalProductsSold = data.reduce((sum, d) => sum + d.products_sold, 0)
        const avgConversionRate = (data.reduce((sum, d) => sum + parseFloat(d.conversion_rate), 0) / data.length).toFixed(2)
        const avgOrderValue = Math.round(totalRevenue / totalOrders)

        // Calculate growth compared to previous period
        const midPoint = Math.floor(data.length / 2)
        const firstHalf = data.slice(0, midPoint)
        const secondHalf = data.slice(midPoint)
        
        const firstHalfRevenue = firstHalf.reduce((sum, d) => sum + d.revenue, 0)
        const secondHalfRevenue = secondHalf.reduce((sum, d) => sum + d.revenue, 0)
        
        const growthRate = firstHalfRevenue > 0 
            ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue * 100).toFixed(1)
            : 0

        return {
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProductsSold,
            avgConversionRate,
            avgOrderValue,
            growthRate
        }
    }

    // Load data when period changes
    useEffect(() => {
        setIsLoading(true)
        
        // Simulate API call delay
        setTimeout(() => {
            const periodConfig = periods.find(p => p.key === selectedPeriod)
            const mockData = generateMockData(periodConfig.days)
            setAnalyticsData(mockData)
            setIsLoading(false)
        }, 500)
    }, [selectedPeriod])

    const summary = analyticsData ? calculateSummary(analyticsData) : null

    // Top products mock data
    const topProducts = [
        { name: 'Premium Fashion Collection', revenue: 12450, orders: 45, growth: '+15.2%' },
        { name: 'Designer Fashion Set', revenue: 9890, orders: 32, growth: '+8.7%' },
        { name: 'Lifestyle Fashion Bundle', revenue: 7650, orders: 28, growth: '+22.1%' },
        { name: 'Elegant Evening Wear', revenue: 6200, orders: 15, growth: '+5.3%' },
        { name: 'Casual Wear Collection', revenue: 4800, orders: 24, growth: '+12.8%' }
    ]

    // Customer segments mock data
    const customerSegments = [
        { segment: 'VIP Customers', count: 45, revenue: 18500, percentage: 35 },
        { segment: 'Regular Customers', count: 120, revenue: 25000, percentage: 48 },
        { segment: 'New Customers', count: 80, revenue: 9000, percentage: 17 }
    ]

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-gray-400">
            {/* Main content area */}
            <div className="p-6 space-y-6 animate-fade-in-up">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
                        <p className="text-gray-400">Comprehensive business insights and performance metrics</p>
                    </div>
                    
                    {/* Period Selector */}
                    <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                        {periods.map((period) => (
                            <button
                                key={period.key}
                                onClick={() => setSelectedPeriod(period.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    selectedPeriod === period.key
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-amber-400'
                                }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading analytics data...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        {summary && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">Total Revenue</p>
                                            <p className="text-2xl font-bold text-white">{currency}{summary.totalRevenue.toLocaleString()}</p>
                                            <p className={`text-xs mt-1 ${summary.growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {summary.growthRate >= 0 ? '+' : ''}{summary.growthRate}% growth
                                            </p>
                                        </div>
                                        <div className="bg-amber-500/20 p-3 rounded-full">
                                            <span className="text-2xl">💰</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">Total Orders</p>
                                            <p className="text-2xl font-bold text-white">{summary.totalOrders.toLocaleString()}</p>
                                            <p className="text-green-400 text-xs mt-1">Avg: {summary.avgOrderValue} per order</p>
                                        </div>
                                        <div className="bg-blue-500/20 p-3 rounded-full">
                                            <span className="text-2xl">📦</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">New Customers</p>
                                            <p className="text-2xl font-bold text-white">{summary.totalCustomers.toLocaleString()}</p>
                                            <p className="text-green-400 text-xs mt-1">{summary.avgConversionRate}% conversion rate</p>
                                        </div>
                                        <div className="bg-green-500/20 p-3 rounded-full">
                                            <span className="text-2xl">👥</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">Products Sold</p>
                                            <p className="text-2xl font-bold text-white">{summary.totalProductsSold.toLocaleString()}</p>
                                            <p className="text-green-400 text-xs mt-1">Units moved</p>
                                        </div>
                                        <div className="bg-purple-500/20 p-3 rounded-full">
                                            <span className="text-2xl">🛍️</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Revenue Chart */}
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-white">Revenue Trend</h2>
                                    <span className="text-sm text-gray-400">{periods.find(p => p.key === selectedPeriod)?.label}</span>
                                </div>
                                <div className="h-64 flex items-end justify-between space-x-1">
                                    {analyticsData?.slice(-10).map((data, index) => {
                                        const height = (data.revenue / Math.max(...analyticsData.map(d => d.revenue))) * 100
                                        return (
                                            <div key={index} className="flex flex-col items-center group">
                                                <div className="bg-gradient-to-t from-amber-600 to-amber-400 rounded-t transition-all duration-300 group-hover:from-amber-500 group-hover:to-amber-300 w-8"
                                                     style={{ height: `${height}%` }}>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1 rotate-45 transform origin-left">
                                                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                                <div className="absolute bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-16">
                                                    {currency}{data.revenue.toLocaleString()}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Orders Chart */}
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-white">Orders Trend</h2>
                                    <span className="text-sm text-gray-400">{periods.find(p => p.key === selectedPeriod)?.label}</span>
                                </div>
                                <div className="h-64 flex items-end justify-between space-x-1">
                                    {analyticsData?.slice(-10).map((data, index) => {
                                        const height = (data.orders / Math.max(...analyticsData.map(d => d.orders))) * 100
                                        return (
                                            <div key={index} className="flex flex-col items-center group">
                                                <div className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-300 w-8"
                                                     style={{ height: `${height}%` }}>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1 rotate-45 transform origin-left">
                                                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                                <div className="absolute bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-16">
                                                    {data.orders} orders
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Additional Analytics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Products */}
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-white">Top Products</h2>
                                    <button className="text-amber-400 hover:text-amber-300 text-sm">View All</button>
                                </div>
                                <div className="space-y-3">
                                    {topProducts.map((product, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                                            <div className="flex items-center">
                                                <span className="bg-amber-500/20 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <p className="text-white font-medium">{product.name}</p>
                                                    <p className="text-gray-400 text-sm">{product.orders} orders</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-medium">{currency}{product.revenue.toLocaleString()}</p>
                                                <p className="text-green-400 text-sm">{product.growth}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Segments */}
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-white">Customer Segments</h2>
                                    <button className="text-amber-400 hover:text-amber-300 text-sm">View Details</button>
                                </div>
                                <div className="space-y-4">
                                    {customerSegments.map((segment, index) => (
                                        <div key={index} className="p-4 bg-gray-900/50 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-white font-medium">{segment.segment}</span>
                                                <span className="text-gray-400">{segment.percentage}%</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                                <span>{segment.count} customers</span>
                                                <span>{currency}{segment.revenue.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-500"
                                                     style={{ width: `${segment.percentage}%` }}>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Metrics Table */}
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">Detailed Metrics</h2>
                                <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Export Report
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700/50">
                                            <th className="text-left py-3 px-4 text-white font-medium">Date</th>
                                            <th className="text-left py-3 px-4 text-white font-medium">Revenue</th>
                                            <th className="text-left py-3 px-4 text-white font-medium">Orders</th>
                                            <th className="text-left py-3 px-4 text-white font-medium">Customers</th>
                                            <th className="text-left py-3 px-4 text-white font-medium">AOV</th>
                                            <th className="text-left py-3 px-4 text-white font-medium">Conv. Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analyticsData?.slice(-7).reverse().map((data, index) => (
                                            <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                                                <td className="py-3 px-4 text-gray-300">
                                                    {new Date(data.date).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4 text-white font-medium">
                                                    {currency}{data.revenue.toLocaleString()}
                                                </td>
                                                <td className="py-3 px-4 text-gray-300">{data.orders}</td>
                                                <td className="py-3 px-4 text-gray-300">{data.customers}</td>
                                                <td className="py-3 px-4 text-gray-300">
                                                    {currency}{data.avg_order_value}
                                                </td>
                                                <td className="py-3 px-4 text-gray-300">{data.conversion_rate}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default Analytics
