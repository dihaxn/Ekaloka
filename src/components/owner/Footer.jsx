// Enhanced Owner Footer
import React from 'react'

const Footer = () => {
    return (
        <div className='border-t border-gray-500/30 bg-black/20 backdrop-blur-lg'>
            <div className='flex flex-col sm:flex-row items-center justify-between px-4 md:px-8 py-4 text-xs text-gray-500'>
                <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-300 p-1 rounded">
                        <div className="bg-black p-0.5 rounded">
                            <span className="text-amber-400 font-bold text-xs">DF</span>
                        </div>
                    </div>
                    <span>© 2024 Dai Fashion - Owner Panel</span>
                </div>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <span>Version 1.0.0</span>
                    <span>•</span>
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    )
}

export default Footer
