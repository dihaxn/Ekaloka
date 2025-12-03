'use client';
import React, { useEffect, useState } from 'react';

import Banner from '@/components/Banner';
import FeaturedProduct from '@/components/FeaturedProduct';
import Footer from '@/components/Footer';
import HeaderSlider from '@/components/HeaderSlider';
import HomeProducts from '@/components/HomeProducts';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import NewsLetter from '@/components/NewsLetter';
import TopSellings from '@/components/TopSellings';
import { useAppContext } from '@/context/AppContext';

const Home = () => {
  const { loading } = useAppContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted) {
    return <Loading />;
  }

  return (
    <div className='bg-gradient-to-r from-black via-gray-900 to-black'>
      <div>
        <Navbar />
        <br />
        <br />
        <br />
      </div>
      <div className='px-6 md:px-16 lg:px-32'>
        <HeaderSlider />
        <TopSellings />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
