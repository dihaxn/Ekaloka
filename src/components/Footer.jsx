// components/Footer.jsx
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const quickLinks = [
  { name: "New Arrivals", href: "#" },
  { name: "Best Sellers", href: "#" },
  { name: "Seasonal Collections", href: "#" },
  { name: "Limited Editions", href: "#" },
  { name: "Sale Items", href: "#" },
];

const categories = [
  { name: "Women", count: 142 },
  { name: "Men", count: 98 },
  { name: "Accessories", count: 76 },
  { name: "Footwear", count: 54 },
  { name: "Bags", count: 43 },
  { name: "Jewelry", count: 32 },
];

const contacts = [
  {
         icon: (
               <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
         </svg>
     ),
    text: "+1 (888) 123-4567",
  },
  {
         icon: (
               <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
         </svg>
     ),
    text: "info@daifashion.com",
  },
  {
         icon: (
               <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
         </svg>
     ),
    text: "123 Fashion Ave, Style District, NY 10001",
  },
];

const socialLinks = [
  { href: "#", label: "YouTube" },
  { href: "#", label: "Facebook" },
  { href: "#", label: "Instagram" },
  { href: "#", label: "Twitter" },
];

const Footer = () => (
  <footer className="bg-gradient-to-r from-black via-gray-900 to-black text-gray-500/80">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-3">
                         <div className="bg-gradient-to-r from-amber-500 to-amber-300 p-2 rounded-lg">
               <div className="bg-black p-1 rounded-md">
                 <span className="text-amber-400 font-bold text-xl">DF</span>
               </div>
             </div>
             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">
               Dai Fashion
             </h1>
          </div>
          <p className="text-sm">
            Where elegance meets modern style. We bring you the latest trends and timeless classics to elevate your wardrobe and express your unique personality.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                aria-label={link.label}
                                 className="bg-gray-800 p-2 rounded-full hover:bg-amber-500 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M10 9.658l4.917 2.338L10 14.342V9.658z" />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
                     <h3 className="text-lg font-semibold border-b border-amber-500 pb-2 w-fit">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                                 <a href={item.href} className="flex items-center hover:text-amber-400 transition-colors">
                   <span className="mr-2 text-amber-500">→</span>
                   {item.name}
                 </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
                     <h3 className="text-lg font-semibold border-b border-amber-500 pb-2 w-fit">Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <motion.a
                key={index}
                href="#"
                                 className="group block p-3 bg-gray-800 rounded-lg hover:bg-amber-500/10 transition-all"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.1)",
                }}
              >
                                 <span className="font-medium group-hover:text-amber-400">{category.name}</span>
                 <span className="block text-xs text-gray-400 group-hover:text-amber-300 mt-1">
                   {category.count} items
                 </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Contact Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
                     <h3 className="text-lg font-semibold border-b border-amber-500 pb-2 w-fit">Contact Us</h3>
          <div className="space-y-2 text-sm">
            {contacts.map((contact, idx) => (
              <div key={idx} className="flex items-center">
                {contact.icon}
                <span>{contact.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment & Security */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 pt-8 border-t border-gray-800"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h4 className="font-medium mb-3">We Accept</h4>
            <div className="flex space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-800 p-2 rounded-lg">
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 w-10 h-6 rounded-md flex items-center justify-center">
                    <div className="h-1 w-6 bg-gray-500 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Secure Payment</h4>
            <div className="flex items-center space-x-2">
                             <div className="p-2 bg-amber-500/10 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <span className="text-sm">256-bit SSL Encryption</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>© 2023 Dai Fashion. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
                         <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-amber-400 transition-colors">Returns & Exchanges</a>
          </div>
        </div>
      </motion.div>
    </div>
  </footer>
);

export default Footer;