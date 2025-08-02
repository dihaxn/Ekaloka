import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
    const pathname = usePathname()
    
    // Custom SVG Icons matching the design theme
    const AddIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    );

    const ProductListIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    );

    const OrdersIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    );

    const menuItems = [
        { 
            name: 'Add Product', 
            path: '/seller', 
            icon: AddIcon,
            description: 'Create new products'
        },
        { 
            name: 'Product List', 
            path: '/seller/product-list', 
            icon: ProductListIcon,
            description: 'Manage inventory'
        },
        { 
            name: 'Orders', 
            path: '/seller/orders', 
            icon: OrdersIcon,
            description: 'View customer orders'
        },
    ];

    return (
        <div className='md:w-64 w-16 border-r border-gray-500/30 min-h-screen text-base py-2 flex flex-col bg-black/30 backdrop-blur-lg'>
            {/* Sidebar Header */}
            <div className="px-4 py-4 border-b border-gray-500/20 mb-2">
                <div className="md:block hidden">
                    <h3 className="text-amber-500 font-semibold text-sm bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                        Dashboard Menu
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Manage your store</p>
                </div>
                <div className="md:hidden flex justify-center">
                    <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"></div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 space-y-1 px-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    const IconComponent = item.icon;

                    return (
                        <Link href={item.path} key={item.name} passHref>
                            <div className={`
                                relative flex items-center py-3 px-3 gap-3 rounded-lg
                                transition-all duration-300 text-gray-400 hover:text-amber-500 group cursor-pointer
                                ${isActive
                                    ? "bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10"
                                    : "hover:bg-amber-500/5 border border-transparent hover:border-amber-500/20 hover:shadow-md hover:shadow-amber-500/5"
                                }
                            `}>
                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-r-full"></div>
                                )}

                                {/* Icon Container */}
                                <div className={`
                                    p-2 rounded-lg transition-all duration-300
                                    ${isActive 
                                        ? "bg-amber-500/20 text-amber-400" 
                                        : "bg-gray-700/30 text-gray-400 group-hover:bg-amber-500/10 group-hover:text-amber-500"
                                    }
                                `}>
                                    <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                </div>

                                {/* Text Content */}
                                <div className='md:block hidden flex-1'>
                                    <p className='font-medium group-hover:text-amber-400 transition-colors duration-300 text-sm'>
                                        {item.name}
                                    </p>
                                    <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                                        isActive ? "text-amber-300/70" : "text-gray-500 group-hover:text-amber-400/70"
                                    }`}>
                                        {item.description}
                                    </p>
                                </div>

                                {/* Hover Effect Arrow */}
                                <div className={`
                                    md:block hidden transition-all duration-300 opacity-0 group-hover:opacity-100
                                    ${isActive ? "opacity-100" : ""}
                                `}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-500/20 mt-auto">
                <div className="md:block hidden">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-3 rounded-lg border border-gray-600/20">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-gray-300">System Status</span>
                        </div>
                        <p className="text-xs text-gray-500">All systems operational</p>
                    </div>
                </div>
                <div className="md:hidden flex justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;