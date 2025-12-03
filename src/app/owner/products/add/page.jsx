'use client';
import Image from 'next/image';
import React, { useState } from 'react';

import { assets } from '@/assets/assets';
import Footer from '@/components/owner/Footer';

const AddProduct = () => {
  // State variables for form fields
  const [files, setFiles] = useState([]); // Array to store uploaded image files
  const [name, setName] = useState(''); // Product name
  const [description, setDescription] = useState(''); // Product description
  const [category, setCategory] = useState('Fashion'); // Product category
  const [price, setPrice] = useState(''); // Product price
  const [offerPrice, setOfferPrice] = useState(''); // Offer price
  const [tags, setTags] = useState(''); // Product tags
  const [stock, setStock] = useState(''); // Stock quantity
  const [sku, setSku] = useState(''); // SKU
  const [brand, setBrand] = useState(''); // Brand
  const [isLoading, setIsLoading] = useState(false);

  // Form submission handler
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your form submission logic here (e.g., API call)
      console.log({
        files,
        name,
        description,
        category,
        price,
        offerPrice,
        tags,
        stock,
        sku,
        brand,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset form on success
      setFiles([]);
      setName('');
      setDescription('');
      setCategory('Fashion');
      setPrice('');
      setOfferPrice('');
      setTags('');
      setStock('');
      setSku('');
      setBrand('');

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fashionCategories = [
    'Fashion',
    'Clothing',
    'Accessories',
    'Shoes',
    'Bags',
    'Jewelry',
    'Watches',
    'Sunglasses',
    'Scarves',
    'Belts',
  ];

  return (
    <div className='flex-1 min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-gray-400'>
      {/* Main content area */}
      <div className='p-6 space-y-6 animate-fade-in-up'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>
            Add New Product
          </h1>
          <p className='text-gray-400'>
            Create a new product for your fashion store
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='space-y-8 bg-gray-800/30 border border-amber-500/10 rounded-xl p-8 backdrop-blur-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300'
        >
          {/* Product Images Section */}
          <div className='group'>
            <label className='text-lg font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-4'>
              Product Images
            </label>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {[...Array(4)].map((_, index) => (
                <label
                  key={index}
                  htmlFor={`image${index}`}
                  className='relative group cursor-pointer'
                >
                  <input
                    onChange={e => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    type='file'
                    id={`image${index}`}
                    accept='image/*'
                    hidden
                  />
                  <div className='aspect-square border-2 border-dashed border-gray-500/40 rounded-lg hover:border-amber-500/50 transition-all duration-300 overflow-hidden'>
                    <Image
                      className='w-full h-full object-cover'
                      src={
                        files[index]
                          ? URL.createObjectURL(files[index])
                          : assets.upload_area
                      }
                      alt={`Upload Image ${index + 1}`}
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <span className='text-sm text-amber-400 font-medium'>
                      {files[index] ? 'Change' : 'Upload'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Product Name */}
            <div className='group'>
              <label className='text-base font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-2'>
                Product Name
              </label>
              <input
                type='text'
                placeholder='Enter product name'
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                onChange={e => setName(e.target.value)}
                value={name}
                required
              />
            </div>

            {/* Brand */}
            <div className='group'>
              <label className='text-base font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-2'>
                Brand
              </label>
              <input
                type='text'
                placeholder='Enter brand name'
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                onChange={e => setBrand(e.target.value)}
                value={brand}
              />
            </div>
          </div>

          {/* Product Description */}
          <div className='group'>
            <label className='text-base font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-2'>
              Product Description
            </label>
            <textarea
              rows={4}
              className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 resize-none transition-all duration-300'
              placeholder='Enter detailed product description'
              onChange={e => setDescription(e.target.value)}
              value={description}
              required
            />
          </div>

          {/* Category, SKU, and Stock */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Category */}
            <div className='group'>
              <label className='text-base font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-2'>
                Category
              </label>
              <select
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                onChange={e => setCategory(e.target.value)}
                value={category}
              >
                {fashionCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* SKU */}
            <div className='group'>
              <label className='text-base font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-2'>
                SKU
              </label>
              <input
                type='text'
                placeholder='Product SKU'
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                onChange={e => setSku(e.target.value)}
                value={sku}
              />
            </div>

            {/* Stock */}
            <div className='group'>
              <label className='text-base font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-2'>
                Stock Quantity
              </label>
              <input
                type='number'
                placeholder='0'
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                onChange={e => setStock(e.target.value)}
                value={stock}
                required
              />
            </div>
          </div>

          {/* Price Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Product Price */}
            <div className='group'>
              <label className='text-base font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-2'>
                Regular Price ($)
              </label>
              <input
                type='number'
                step='0.01'
                placeholder='0.00'
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                onChange={e => setPrice(e.target.value)}
                value={price}
                required
              />
            </div>

            {/* Offer Price */}
            <div className='group'>
              <label className='text-base font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-2'>
                Sale Price ($)
              </label>
              <input
                type='number'
                step='0.01'
                placeholder='0.00'
                className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
                onChange={e => setOfferPrice(e.target.value)}
                value={offerPrice}
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div className='group'>
            <label className='text-base font-medium text-white group-hover:text-amber-300 transition-colors duration-300 block mb-2'>
              Product Tags
            </label>
            <input
              type='text'
              placeholder='Enter tags separated by commas (e.g., summer, casual, trendy)'
              className='w-full outline-none py-3 px-4 rounded-lg border border-gray-500/40 bg-gray-900/50 text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300'
              onChange={e => setTags(e.target.value)}
              value={tags}
            />
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={isLoading}
              className={`px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-95 border border-amber-500/20 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className='flex items-center'>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Adding Product...
                </span>
              ) : (
                'ADD PRODUCT'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AddProduct;
