import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {
    const { router } = useAppContext()

    return (
        <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
            <Image
                onClick={() => router.push('/')}
                className='w-28 lg:w-32 cursor-pointer opacity-100 hover:opacity-80 transition-opacity duration-300'
                src={assets.logo}
                alt="Website Logo"
            />
            <button
                className='bg-orange-500 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm
        transition-all duration-300 hover:bg-orange-600 hover:shadow-md active:scale-95'
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar