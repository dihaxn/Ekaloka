// Enhanced Owner Navbar combining admin and seller features
import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {
    const { router, setToken, userRole } = useAppContext()

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userRole")
        setToken("")
        router.push("/")
    }

    return (
        <div className='flex items-center px-4 md:px-8 py-4 justify-between border-b border-gray-500/30 bg-black/30 backdrop-blur-lg'>
            {/* Logo Section with Enhanced Styling */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => router.push('/')}>
                <div className="bg-gradient-to-r from-amber-500 to-amber-300 p-2 rounded-lg shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300">
                    <div className="bg-black p-1 rounded-md">
                        <span className="text-amber-400 font-bold text-xl">DF</span>
                    </div>
                </div>
                <div className="hidden md:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-amber-100 transition-all duration-300">
                        Dai Fashion
                    </h1>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        Owner Management Panel
                    </p>
                </div>
            </div>

            {/* Owner Info and Logout */}
            <div className="flex items-center space-x-4">
                {/* Owner Role Badge */}
                <div className="hidden sm:flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-amber-400 font-medium capitalize">{userRole}</span>
                </div>

                {/* Enhanced Logout Button */}
                <button 
                    onClick={handleLogout}
                    className='bg-gradient-to-r from-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-95 border border-amber-500/20'
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar
