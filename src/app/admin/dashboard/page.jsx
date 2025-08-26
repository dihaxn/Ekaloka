'use client'

import React from 'react'
import { useAppContext } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const AdminDashboard = () => {
  const { userRole, isAdmin, token } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not admin
    if (token && !isAdmin()) {
      router.push('/')
    }
  }, [userRole, isAdmin, token, router])

  if (!token) {
    return (
      <div className="bg-gradient-to-r from-black via-gray-900 to-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-6">Please log in to access the admin dashboard.</p>
            <button 
              onClick={() => router.push('/login')}
              className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
            >
              Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAdmin()) {
    return (
      <div className="bg-gradient-to-r from-black via-gray-900 to-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-6">You don't have permission to access the admin dashboard.</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
            >
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome to the administrative control panel
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Quick Stats */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Total Users</h3>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
              </div>
              <p className="text-gray-400">Active user accounts</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Total Products</h3>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
              </div>
              <p className="text-gray-400">Available products</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Total Orders</h3>
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
              </div>
              <p className="text-gray-400">Completed orders</p>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">User Management</h3>
                <p className="text-gray-400 mb-4">Manage user accounts, roles, and permissions</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Manage Users
                </button>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Product Management</h3>
                <p className="text-gray-400 mb-4">Add, edit, or remove products from the catalog</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push('/admin/products')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Manage Products
                  </button>
                  <button 
                    onClick={() => router.push('/admin/dashboard-with-sidebar')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Sidebar Layout
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Order Management</h3>
                <p className="text-gray-400 mb-4">View and manage all customer orders</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push('/admin/orders')}
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
                  >
                    View Orders
                  </button>
                  <button 
                    onClick={() => router.push('/admin/products-with-sidebar')}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    Products Sidebar
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">System Settings</h3>
                <p className="text-gray-400 mb-4">Configure application settings and preferences</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Current User Info */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Current Session</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">User Role:</span>
                  <span className="text-white font-medium">{userRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Admin Access:</span>
                  <span className="text-green-400">✅ Granted</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cart Access:</span>
                  <span className="text-red-400">❌ Restricted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminDashboard
