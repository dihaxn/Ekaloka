import React from 'react';

const NewsLetter = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14'>
      <h1 className='md:text-4xl text-2xl font-medium text-white'>
        Subscribe now & get 20% off
      </h1>
      <p className='md:text-base text-gray-300/80 pb-8'>
        Stay updated with the latest fashion trends and exclusive offers
      </p>
      <div className='flex items-center justify-between max-w-2xl w-full md:h-14 h-12'>
        <input
          className='bg-gray-800 border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-300 placeholder-gray-400'
          type='text'
          placeholder='Enter your email id'
        />
        <button className='md:px-12 px-8 h-full text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-300 rounded-md rounded-l-none'>
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
