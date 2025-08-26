'use client';
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Footer from "@/components/seller/Footer";

const AddProduct = () => {
  // State variables for form fields
  const [files, setFiles] = useState([]); // Array to store uploaded image files
  const [name, setName] = useState(''); // Product name
  const [description, setDescription] = useState(''); // Product description
  const [category, setCategory] = useState('Earphone'); // Product category
  const [price, setPrice] = useState(''); // Product price
  const [offerPrice, setOfferPrice] = useState(''); // Offer price

  // Form submission handler (placeholder)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here (e.g., API call)
    console.log({ files, name, description, category, price, offerPrice });
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-gray-900 to-black text-gray-400">
      {/* Main content area */}
      <div className="md:p-10 p-4 space-y-5 animate-fade-in-up max-w-xl">
        {/* Header */}
        <h2 className="text-lg font-medium text-amber-500 border-b-2 border-amber-500 pb-2 w-fit mb-8 bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
          Add New Product
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-800/30 border border-amber-500/10 rounded-md p-6 backdrop-blur-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300"
        >
          {/* Product Image Section */}
          <div className="group">
            <label className="text-base font-medium text-gray-100 group-hover:text-amber-300 transition-colors duration-300">
              Product Image
            </label>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {[...Array(4)].map((_, index) => (
                <label
                  key={index}
                  htmlFor={`image${index}`}
                  className="relative group cursor-pointer"
                >
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    type="file"
                    id={`image${index}`}
                    accept="image/*"
                    hidden
                  />
                  <Image
                    className="max-w-24 w-24 h-24 object-cover rounded-lg border border-gray-500/20 group-hover:border-amber-500/30 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300"
                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                    alt={`Upload Image ${index + 1}`}
                    width={96}
                    height={96}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs text-amber-400 font-medium">Image</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div className="flex flex-col gap-2 max-w-md group">
            <label
              className="text-base font-medium text-gray-100 group-hover:text-amber-300 transition-colors duration-300"
              htmlFor="product-name"
            >
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Enter product name"
              className="outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-500/40 bg-gray-900/50 text-gray-100 placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          {/* Product Description */}
          <div className="flex flex-col gap-2 max-w-md group">
            <label
              className="text-base font-medium text-gray-100 group-hover:text-amber-300 transition-colors duration-300"
              htmlFor="product-description"
            >
              Product Description
            </label>
            <textarea
              id="product-description"
              rows={4}
              className="outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-500/40 bg-gray-900/50 text-gray-100 placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 resize-none transition-all duration-300"
              placeholder="Enter product description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>

          {/* Category, Price, and Offer Price */}
          <div className="flex items-center gap-5 flex-wrap">
            {/* Category */}
            <div className="flex flex-col gap-2 w-32 group">
              <label
                className="text-base font-medium text-gray-100 group-hover:text-amber-300 transition-colors duration-300"
                htmlFor="category"
              >
                Category
              </label>
              <select
                id="category"
                className="outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-500/40 bg-gray-900/50 text-gray-100 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="Earphone">Earphone</option>
                <option value="Headphone">Headphone</option>
                <option value="Watch">Watch</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Camera">Camera</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* Product Price */}
            <div className="flex flex-col gap-2 w-32 group">
              <label
                className="text-base font-medium text-gray-100 group-hover:text-amber-300 transition-colors duration-300"
                htmlFor="product-price"
              >
                Product Price
              </label>
              <input
                id="product-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-500/40 bg-gray-900/50 text-gray-100 placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />
            </div>

            {/* Offer Price */}
            <div className="flex flex-col gap-2 w-32 group">
              <label
                className="text-base font-medium text-gray-100 group-hover:text-amber-300 transition-colors duration-300"
                htmlFor="offer-price"
              >
                Offer Price
              </label>
              <input
                id="offer-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded-lg border border-gray-500/40 bg-gray-900/50 text-gray-100 placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300"
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-8 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-95 border border-amber-500/20"
          >
            ADD PRODUCT
          </button>
        </form>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AddProduct;