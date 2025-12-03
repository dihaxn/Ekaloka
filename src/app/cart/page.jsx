'use client';
import Image from 'next/image';
import React from 'react';

import { assets } from '@/assets/assets';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import OrderSummary from '@/components/OrderSummary';
import { useAppContext } from '@/context/AppContext';

const Cart = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    loading,
    canAccessCart,
    isAdmin,
    userRole,
  } = useAppContext();

  if (loading) {
    return <Loading />;
  }

  // Hide cart for admin users
  if (!canAccessCart()) {
    return (
      <div className='bg-gradient-to-r from-black via-gray-900 to-black min-h-screen'>
        <Navbar />
        <div className='flex flex-col items-center justify-center min-h-screen px-6'>
          <div className='text-center max-w-md'>
            <div className='mb-6'>
              <div className='w-24 h-24 mx-auto bg-amber-600/20 rounded-full flex items-center justify-center mb-4'>
                <svg
                  className='w-12 h-12 text-amber-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              </div>
              <h1 className='text-3xl font-bold text-white mb-2'>
                Admin Access
              </h1>
              <p className='text-gray-400 text-lg'>
                Cart functionality is not available for admin users
              </p>
            </div>

            <div className='bg-gray-800/50 rounded-lg p-6 mb-6'>
              <h2 className='text-xl font-semibold text-white mb-3'>
                Current User Info:
              </h2>
              <div className='space-y-2 text-sm text-gray-300'>
                <div>
                  <strong>Role:</strong> {userRole}
                </div>
                <div>
                  <strong>Cart Access:</strong> ❌ Restricted
                </div>
                <div>
                  <strong>Admin Status:</strong> ✅ Yes
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <button
                onClick={() => router.push('/all-products')}
                className='w-full bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors'
              >
                View Products
              </button>
              <button
                onClick={() => router.push('/')}
                className='w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors'
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-r from-black via-gray-900 to-black'>
      <div>
        <Navbar />
        <br />
        <br />
        <br />
      </div>
      <div className='flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20'>
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6'>
            <p className='text-2xl md:text-3xl text-gray-500'>
              Your <span className='font-medium text-amber-600'>Cart</span>
            </p>
            <p className='text-lg md:text-xl text-gray-500/80'>
              {getCartCount()} Items
            </p>
          </div>
          <div className='overflow-x-auto'>
            {getCartCount() === 0 ? (
              <div className='text-center py-12'>
                <p className='text-gray-500 text-lg mb-4'>Your cart is empty</p>
                <button
                  onClick={() => router.push('/all-products')}
                  className='bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700'
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <table className='min-w-full table-auto'>
                <thead className='text-left'>
                  <tr>
                    <th className='text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium'>
                      Product Details
                    </th>
                    <th className='pb-6 md:px-4 px-1 text-gray-600 font-medium'>
                      Price
                    </th>
                    <th className='pb-6 md:px-4 px-1 text-gray-600 font-medium'>
                      Quantity
                    </th>
                    <th className='pb-6 md:px-4 px-1 text-gray-600 font-medium'>
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(cartItems).map(itemId => {
                    const product = products.find(
                      product => product._id === itemId
                    );

                    if (!product || cartItems[itemId] <= 0) return null;

                    return (
                      <tr key={itemId}>
                        <td className='flex items-center gap-4 py-4 md:px-4 px-1'>
                          <div>
                            <div className='rounded-lg overflow-hidden bg-gray-500/10 p-2'>
                              <Image
                                src={product.image[0]}
                                alt={product.name}
                                className='w-16 h-auto object-cover mix-blend-multiply'
                                width={1280}
                                height={720}
                              />
                            </div>
                            <button
                              className='md:hidden text-xs text-orange-600 mt-1'
                              onClick={() => updateCartQuantity(product._id, 0)}
                            >
                              Remove
                            </button>
                          </div>
                          <div className='text-sm hidden md:block'>
                            <p className='text-gray-800'>{product.name}</p>
                            <button
                              className='text-xs text-orange-600 mt-1'
                              onClick={() => updateCartQuantity(product._id, 0)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                        <td className='py-4 md:px-4 px-1 text-gray-600'>
                          ${product.offerPrice}
                        </td>
                        <td className='py-4 md:px-4 px-1'>
                          <div className='flex items-center md:gap-2 gap-1'>
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  product._id,
                                  cartItems[itemId] - 1
                                )
                              }
                            >
                              <Image
                                src={assets.decrease_arrow}
                                alt='decrease_arrow'
                                className='w-4 h-4'
                                width={16}
                                height={16}
                              />
                            </button>
                            <input
                              onChange={e =>
                                updateCartQuantity(
                                  product._id,
                                  Number(e.target.value)
                                )
                              }
                              type='number'
                              value={cartItems[itemId]}
                              className='w-8 border text-center appearance-none'
                            ></input>
                            <button onClick={() => addToCart(product._id)}>
                              <Image
                                src={assets.increase_arrow}
                                alt='increase_arrow'
                                className='w-4 h-4'
                                width={16}
                                height={16}
                              />
                            </button>
                          </div>
                        </td>
                        <td className='py-4 md:px-4 px-1 text-gray-600'>
                          ${(product.offerPrice * cartItems[itemId]).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <button
            onClick={() => router.push('/all-products')}
            className='group flex items-center mt-6 gap-2 text-amber-600'
          >
            <Image
              className='group-hover:-translate-x-1 transition'
              src={assets.arrow_right_icon_colored}
              alt='arrow_right_icon_colored'
              width={24}
              height={24}
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
