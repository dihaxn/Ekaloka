'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Navbar from '@/components/owner/Navbar';
import Sidebar from '@/components/owner/Sidebar';
import { useAppContext } from '@/context/AppContext';

const OwnerLayout = ({ children }) => {
  const { isOwnerUser, token } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not owner
    if (token && !isOwnerUser()) {
      router.push('/');
      return;
    }

    if (!token) {
      router.push('/login');
      return;
    }
  }, [token, isOwnerUser, router]);

  if (!token || !isOwnerUser()) {
    return null; // Will redirect
  }

  return (
    <div className='bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-gray-400'>
      <div>
        <Navbar />
      </div>
      <div className='flex w-full'>
        <Sidebar />
        <main className='flex-1 min-h-screen'>{children}</main>
      </div>
    </div>
  );
};

export default OwnerLayout;
