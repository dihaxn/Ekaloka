'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
    return (
        <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-gray-400">
            <div>
                <Navbar />
            </div>
            <div className='flex w-full'>
                <Sidebar />
                {children}
            </div>
            
        </div>
    )
}

export default Layout