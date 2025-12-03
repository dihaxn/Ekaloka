import Image from 'next/image';
import React from 'react';

import { assets } from '@/assets/assets';

const products = [
  {
    id: 1,
    image: assets.fashion_accessories,
    title: 'Stylish Accessories',
    description: 'Complete your look with our premium fashion accessories.',
  },
  {
    id: 2,
    image: assets.fashion_lifestyle,
    title: 'Lifestyle Collection',
    description:
      'Discover pieces that reflect your unique lifestyle and personality.',
  },
  {
    id: 3,
    image: assets.fashion_model,
    title: 'Designer Fashion',
    description: 'Exclusive designer pieces that define modern elegance.',
  },
];

const FeaturedProduct = () => {
  return (
    <div className='mt-14'>
      <div className='flex flex-col items-center'>
        <p className='text-3xl font-medium text-white'>Featured Collections</p>
        <div className='w-28 h-0.5 bg-amber-600 mt-2'></div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4'>
        {products.map(({ id, image, title, description }) => (
          <div key={id} className='relative group'>
            <Image
              src={image}
              alt={title}
              width={400}
              height={300}
              className='group-hover:brightness-75 transition duration-300 w-full h-64 object-cover rounded-lg'
            />
            <div className='group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2'>
              <p className='font-medium text-xl lg:text-2xl'>{title}</p>
              <p className='text-sm lg:text-base leading-5 max-w-60'>
                {description}
              </p>
              <button className='flex items-center gap-1.5 bg-amber-900 hover:bg-amber-800 px-4 py-2 rounded transition-colors duration-300'>
                Shop Now{' '}
                <Image
                  className='h-3 w-3'
                  src={assets.redirect_icon}
                  alt='Redirect Icon'
                  width={12}
                  height={12}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
