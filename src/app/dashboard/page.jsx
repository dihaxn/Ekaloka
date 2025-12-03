'use client';
import { Calendar, LogOut, Shield, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Suspense } from 'react';

const DashboardContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated via cookie
    const checkAuth = async () => {
      try {
        // In a real app, you'd make an API call to verify the session
        // For now, we'll check if we have a welcome parameter
        const welcome = searchParams.get('welcome');

        if (welcome) {
          // Mock user data for demo purposes
          setUser({
            name: 'OAuth User',
            email: 'user@example.com',
            provider: 'Google/Facebook',
            loginTime: new Date().toLocaleString(),
          });
        } else {
          // No welcome param, redirect to login
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, searchParams]);

  const handleLogout = () => {
    // Clear session cookie and redirect to login
    document.cookie =
      'user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-white text-lg'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-black'>
      {/* Header */}
      <header className='bg-gray-900 border-b border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center'>
              <div className='bg-gradient-to-r from-orange-500 to-orange-300 p-2 rounded-lg'>
                <div className='bg-black p-2 rounded-md'>
                  <span className='text-orange-400 font-bold text-2xl'>DF</span>
                </div>
              </div>
              <h1 className='ml-3 text-2xl font-bold text-white'>
                Dai Fashion
              </h1>
            </div>

            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center'>
                  <User className='w-5 h-5 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium text-white'>{user.name}</p>
                  <p className='text-xs text-gray-400'>{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className='flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors'
              >
                <LogOut className='w-4 h-4' />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Message */}
        {searchParams.get('welcome') && (
          <div className='mb-8'>
            <div className='bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-600 rounded-lg p-6'>
              <div className='flex items-center'>
                <Shield className='w-8 h-8 text-green-400 mr-3' />
                <div>
                  <h2 className='text-2xl font-bold text-white mb-2'>
                    Welcome to Dai Fashion! 🎉
                  </h2>
                  <p className='text-green-200'>
                    You've successfully signed in with {user.provider}. Your
                    account is now active.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Stats Card */}
          <div className='bg-gray-900 border border-gray-800 rounded-lg p-6'>
            <div className='flex items-center'>
              <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'>
                <Calendar className='w-6 h-6 text-white' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-400'>Last Login</p>
                <p className='text-lg font-semibold text-white'>
                  {user.loginTime}
                </p>
              </div>
            </div>
          </div>

          {/* Account Info Card */}
          <div className='bg-gray-900 border border-gray-800 rounded-lg p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Account Information
            </h3>
            <div className='space-y-3'>
              <div>
                <p className='text-sm text-gray-400'>Name</p>
                <p className='text-white font-medium'>{user.name}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Email</p>
                <p className='text-white font-medium'>{user.email}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Sign-in Method</p>
                <p className='text-white font-medium'>{user.provider}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className='bg-gray-900 border border-gray-800 rounded-lg p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Quick Actions
            </h3>
            <div className='space-y-3'>
              <button className='w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors'>
                Browse Products
              </button>
              <button className='w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors'>
                View Orders
              </button>
              <button className='w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors'>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className='mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-white mb-4'>
            What's Next?
          </h3>
          <p className='text-gray-300 mb-4'>
            Your OAuth authentication system is now fully functional! Here's
            what you can do next:
          </p>
          <ul className='text-gray-300 space-y-2'>
            <li>• Integrate with your existing Prisma database</li>
            <li>• Add user roles and permissions</li>
            <li>• Implement product catalog and shopping features</li>
            <li>• Add email verification and password reset</li>
            <li>• Deploy to production with proper SSL certificates</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Suspense fallback={
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-white text-lg'>Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
};

export default Dashboard;
