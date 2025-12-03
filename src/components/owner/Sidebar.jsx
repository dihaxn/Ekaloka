// Enhanced Owner Sidebar combining admin and seller features
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { assets } from '../../assets/assets';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: '📊',
      href: '/owner/dashboard',
      description: 'Overview & Analytics',
    },
    {
      name: 'Add Product',
      icon: '➕',
      href: '/owner/products/add',
      description: 'Create new product',
    },
    {
      name: 'Product List',
      icon: '📦',
      href: '/owner/products',
      description: 'Manage inventory',
    },
    {
      name: 'Orders',
      icon: '📋',
      href: '/owner/orders',
      description: 'Order management',
    },
    {
      name: 'Analytics',
      icon: '📈',
      href: '/owner/analytics',
      description: 'Sales & Performance',
    },
    {
      name: 'Customers',
      icon: '👥',
      href: '/owner/customers',
      description: 'Customer management',
    },
    {
      name: 'Settings',
      icon: '⚙️',
      href: '/owner/settings',
      description: 'System configuration',
    },
  ];

  const isActive = href => pathname === href;

  return (
    <div className='w-[18%] min-h-screen border-r border-gray-500/30 bg-black/20 backdrop-blur-lg'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        {/* Navigation Header */}
        <div className='mb-4'>
          <h2 className='text-lg font-bold text-amber-400 mb-1'>Owner Panel</h2>
          <p className='text-xs text-gray-500'>Manage your business</p>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`group flex items-center gap-3 border border-gray-500/30 rounded-lg px-3 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5 ${
              isActive(item.href)
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-300/10 border-amber-500/50 text-amber-300'
                : 'bg-gray-900/30 hover:bg-gray-800/50 hover:border-amber-500/30 text-gray-400 hover:text-amber-400'
            }`}
          >
            <span className='text-lg'>{item.icon}</span>
            <div className='flex flex-col'>
              <span className='font-medium text-sm'>{item.name}</span>
              <span className='text-xs opacity-75'>{item.description}</span>
            </div>
            {isActive(item.href) && (
              <div className='ml-auto w-2 h-2 bg-amber-400 rounded-full animate-pulse'></div>
            )}
          </Link>
        ))}

        {/* Quick Stats */}
        <div className='mt-8 p-3 bg-gray-900/50 border border-gray-600/30 rounded-lg'>
          <h3 className='text-sm font-medium text-amber-400 mb-2'>
            Quick Stats
          </h3>
          <div className='space-y-1 text-xs text-gray-400'>
            <div className='flex justify-between'>
              <span>Products:</span>
              <span className='text-amber-400'>24</span>
            </div>
            <div className='flex justify-between'>
              <span>Orders:</span>
              <span className='text-green-400'>12</span>
            </div>
            <div className='flex justify-between'>
              <span>Revenue:</span>
              <span className='text-blue-400'>$2.4k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
