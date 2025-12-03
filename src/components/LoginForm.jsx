'use client';

import React, { useState } from 'react';

import { useAppContext } from '../context/AppContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { loginUser, userRole, canAccessCart, isAdmin } = useAppContext();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    const result = await loginUser({ email, password });
    setMessage(result.message);

    if (result.success) {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.includes('successful')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Email
          </label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter your email'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Password
          </label>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter your password'
            required
          />
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Login
        </button>
      </form>

      <div className='mt-6 p-4 bg-gray-50 rounded-md'>
        <h3 className='font-medium text-gray-900 mb-2'>Test Accounts:</h3>
        <div className='space-y-2 text-sm text-gray-600'>
          <div>
            <strong>Regular User:</strong> john@example.com / password123
          </div>
          <div>
            <strong>Admin User:</strong> jane@example.com / password123
          </div>
        </div>
      </div>

      {userRole && (
        <div className='mt-4 p-3 bg-blue-50 rounded-md'>
          <div className='text-sm'>
            <strong>Current Role:</strong> {userRole}
          </div>
          <div className='text-sm'>
            <strong>Can Access Cart:</strong>{' '}
            {canAccessCart() ? '✅ Yes' : '❌ No'}
          </div>
          <div className='text-sm'>
            <strong>Is Admin:</strong> {isAdmin() ? '✅ Yes' : '❌ No'}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
