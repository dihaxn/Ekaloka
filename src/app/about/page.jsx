// apps/frontend/app/about/page.jsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { assets } from '@/assets/assets';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Dihan Laknuka',
      role: 'Founder & CEO',
      image: '/images/team-founder.jpg',
      bio: 'The visionary behind Dai Fashion, with a passion for creating timeless and sustainable clothing.',
    },
    {
      name: 'Jane Doe',
      role: 'Head of Design',
      image: '/images/team-designer.jpg',
      bio: 'The creative force behind our collections, blending modern trends with classic elegance.',
    },
    {
      name: 'John Smith',
      role: 'Marketing Director',
      image: '/images/team-marketing.jpg',
      bio: 'The strategic mind connecting our brand with fashion lovers worldwide.',
    },
  ];

  return (
    <div className='bg-gradient-to-r from-black via-gray-900 to-black'>
      <Navbar />
      <main className='pt-24'>
        {/* Hero Section */}
        <section className='relative h-[50vh] flex items-center justify-center text-center px-4'>
          <div className='absolute inset-0 bg-black opacity-50'></div>
          <Image
            src='/images/about-hero.jpg'
            alt='Fashion Studio Hero'
            fill
            style={{ objectFit: 'cover' }}
            className='z-0'
            priority
          />
          <div className='relative z-10'>
            <h1 className='text-5xl md:text-7xl font-extrabold text-white tracking-tight'>
              About Dai Fashion
            </h1>
            <p className='mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto'>
              Weaving stories of style, quality, and sustainability into every
              thread.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className='py-20 px-4 md:px-8'>
          <div className='container mx-auto grid md:grid-cols-2 gap-12 items-center'>
            <div className='animate-fadeIn'>
              <h2 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200'>
                Our Story
              </h2>
              <p className='text-gray-400 mb-4'>
                Founded in 2024, Dai Fashion started with a simple idea: to
                create high-quality, stylish apparel that doesn’t compromise on
                ethics or sustainability. We saw a gap in the market for fashion
                that was both beautiful and responsible.
              </p>
              <p className='text-gray-400'>
                From a small workshop to a growing online presence, our journey
                has been fueled by a passion for craftsmanship and a commitment
                to our customers. Every piece in our collection is designed with
                intention and made to last, telling a story of dedication and
                care.
              </p>
            </div>
            <div
              className='relative h-80 rounded-lg overflow-hidden shadow-2xl animate-fadeIn'
              style={{ animationDelay: '0.2s' }}
            >
              <Image
                src='/images/about-workshop.jpg'
                alt='Our Fashion Workshop'
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className='bg-gray-900/50 py-20 px-4 md:px-8'>
          <div className='container mx-auto text-center'>
            <h2 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200'>
              Our Mission
            </h2>
            <p className='text-lg text-gray-400 max-w-3xl mx-auto mb-12'>
              Our mission is to empower self-expression through fashion that is
              ethically produced and environmentally conscious. We are dedicated
              to transparency, quality, and creating a positive impact on the
              world.
            </p>
            <div className='grid md:grid-cols-3 gap-8'>
              <div className='bg-gray-800 p-8 rounded-lg shadow-lg hover-grow border border-transparent hover:border-amber-500/30 transition-all duration-300'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-black'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-amber-400 mb-3'>
                  Quality Craftsmanship
                </h3>
                <p className='text-gray-400'>
                  Every stitch matters. We use premium materials and pay
                  meticulous attention to detail.
                </p>
              </div>
              <div className='bg-gray-800 p-8 rounded-lg shadow-lg hover-grow border border-transparent hover:border-amber-500/30 transition-all duration-300'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-black'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-amber-400 mb-3'>
                  Sustainable Practices
                </h3>
                <p className='text-gray-400'>
                  From sourcing to packaging, we prioritize eco-friendly methods
                  to protect our planet.
                </p>
              </div>
              <div className='bg-gray-800 p-8 rounded-lg shadow-lg hover-grow border border-transparent hover:border-amber-500/30 transition-all duration-300'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-black'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-amber-400 mb-3'>
                  Ethical Production
                </h3>
                <p className='text-gray-400'>
                  We partner with suppliers who share our values of fair wages
                  and safe working conditions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fashion Studio Section */}
        <section className='py-20 px-4 md:px-8'>
          <div className='container mx-auto grid md:grid-cols-2 gap-12 items-center'>
            <div
              className='relative h-80 rounded-lg overflow-hidden shadow-2xl animate-fadeIn'
              style={{ animationDelay: '0.4s' }}
            >
              <Image
                src='/images/fashion-studio.jpg'
                alt='Our Fashion Studio'
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className='animate-fadeIn' style={{ animationDelay: '0.6s' }}>
              <h2 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200'>
                Our Creative Space
              </h2>
              <p className='text-gray-400 mb-4'>
                Our state-of-the-art fashion studio is where creativity meets
                innovation. Here, our talented designers bring your fashion
                dreams to life, combining traditional craftsmanship with
                cutting-edge technology.
              </p>
              <p className='text-gray-400'>
                Every collection starts with inspiration, evolves through
                collaboration, and culminates in pieces that reflect both
                current trends and timeless elegance. Our studio is more than a
                workspace—it's the heart of Dai Fashion.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className='py-20 px-4 md:px-8'>
          <div className='container mx-auto text-center'>
            <h2 className='text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200'>
              Meet the Team
            </h2>
            <div className='grid md:grid-cols-3 gap-10'>
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className='group bg-gray-800/50 p-6 rounded-lg text-center shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-800/70 border border-transparent hover:border-amber-500/30'
                >
                  <div className='relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-amber-500 hover:border-amber-400 transition-colors duration-300'>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes='128px'
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className='text-xl font-bold text-white group-hover:text-amber-300 transition-colors duration-300'>
                    {member.name}
                  </h3>
                  <p className='text-amber-400 mb-2'>{member.role}</p>
                  <p className='text-gray-400 text-sm'>{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className='bg-gray-900/50 py-20 px-4 md:px-8 text-center'>
          <div className='container mx-auto'>
            <h2 className='text-4xl font-bold text-white mb-4'>
              Join Our Journey
            </h2>
            <p className='text-lg text-gray-400 max-w-2xl mx-auto mb-8'>
              Be a part of the Dai Fashion family. Explore our latest
              collections and discover your unique style.
            </p>
            <Link
              href='/all-products'
              className='inline-block bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-lg'
            >
              Shop Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
