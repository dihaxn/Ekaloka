'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { assets } from '@/assets/assets';
import Footer from '@/components/owner/Footer';
import { useAppContext } from '@/context/AppContext';

const ProductList = () => {
  const { products } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mock enhanced product data
  const [mockProducts] = useState([
    {
      _id: '1',
      name: 'Premium Fashion Collection',
      category: 'Fashion',
      price: 299,
      offerPrice: 249,
      stock: 25,
      sales: 45,
      status: 'Active',
      image: ['/images/fashion-collection.jpg'],
      sku: 'PFC-001',
    },
    {
      _id: '2',
      name: 'Designer Fashion Set',
      category: 'Clothing',
      price: 459,
      offerPrice: 399,
      stock: 12,
      sales: 32,
      status: 'Active',
      image: ['/images/fashion-model.jpg'],
      sku: 'DFS-002',
    },
    {
      _id: '3',
      name: 'Lifestyle Fashion Bundle',
      category: 'Accessories',
      price: 199,
      offerPrice: 159,
      stock: 8,
      sales: 28,
      status: 'Low Stock',
      image: ['/images/fashion-accessories.jpg'],
      sku: 'LFB-003',
    },
    {
      _id: '4',
      name: 'Elegant Evening Wear',
      category: 'Fashion',
      price: 599,
      offerPrice: 499,
      stock: 0,
      sales: 15,
      status: 'Out of Stock',
      image: ['/images/fashion-hero.jpg'],
      sku: 'EEW-004',
    },
  ]);

  const categories = [
    'All',
    'Fashion',
    'Clothing',
    'Accessories',
    'Shoes',
    'Bags',
  ];

  useEffect(() => {
    let filtered = mockProducts;

    if (searchTerm) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(
        product => product.category === categoryFilter
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, mockProducts]);

  const getStatusColor = status => {
    switch (status) {
      case 'Active':
        return 'text-green-400 bg-green-500/20';
      case 'Low Stock':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'Out of Stock':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const handleEdit = productId => {
    console.log('Edit product:', productId);
    // Navigate to edit page
  };

  const handleDelete = productId => {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', productId);
      // Handle delete logic
    }
  };

  const handleStatusToggle = productId => {
    console.log('Toggle status for product:', productId);
    // Handle status toggle
  };

  return (
    <div className='flex-1 min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-gray-400'>
      {/* Main content area */}
      <div className='p-6 space-y-6 animate-fade-in-up'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              Product Management
            </h1>
            <p className='text-gray-400'>
              Manage your product inventory and listings
            </p>
          </div>
          <button
            onClick={() => (window.location.href = '/owner/products/add')}
            className='mt-4 sm:mt-0 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30'
          >
            + Add New Product
          </button>
        </div>

        {/* Filters */}
        <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Search products by name or SKU...'
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className='md:w-48'>
              <select
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Total Products</p>
            <p className='text-2xl font-bold text-white'>
              {mockProducts.length}
            </p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Active Products</p>
            <p className='text-2xl font-bold text-green-400'>
              {mockProducts.filter(p => p.status === 'Active').length}
            </p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Low Stock</p>
            <p className='text-2xl font-bold text-yellow-400'>
              {mockProducts.filter(p => p.status === 'Low Stock').length}
            </p>
          </div>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
            <p className='text-gray-400 text-sm'>Out of Stock</p>
            <p className='text-2xl font-bold text-red-400'>
              {mockProducts.filter(p => p.status === 'Out of Stock').length}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-6'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-700/50'>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Product
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    SKU
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Category
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Price
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Stock
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Sales
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Status
                  </th>
                  <th className='text-left py-3 px-4 text-white font-medium'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr
                    key={product._id}
                    className='border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors'
                  >
                    <td className='py-3 px-4'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-12 h-12 bg-gray-700 rounded-lg overflow-hidden'>
                          <Image
                            src={product.image[0] || assets.placeholder_image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <p className='text-white font-medium'>
                            {product.name}
                          </p>
                          <p className='text-gray-400 text-sm'>
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='py-3 px-4 text-gray-300'>{product.sku}</td>
                    <td className='py-3 px-4 text-gray-300'>
                      {product.category}
                    </td>
                    <td className='py-3 px-4'>
                      <div>
                        <p className='text-white font-medium'>
                          ${product.offerPrice}
                        </p>
                        <p className='text-gray-400 text-sm line-through'>
                          ${product.price}
                        </p>
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`${product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-yellow-400' : 'text-green-400'}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-gray-300'>{product.sales}</td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleEdit(product._id)}
                          className='text-blue-400 hover:text-blue-300 p-1'
                          title='Edit'
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleStatusToggle(product._id)}
                          className='text-amber-400 hover:text-amber-300 p-1'
                          title='Toggle Status'
                        >
                          🔄
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className='text-red-400 hover:text-red-300 p-1'
                          title='Delete'
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-400'>
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductList;
