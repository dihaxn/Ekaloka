"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import Link from 'next/link';

const ForgotPassword = () => {
    const router = useRouter();
    const [step, setStep] = useState('email'); // email, otp, reset
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ step: 'send-otp', email }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('OTP sent to your email! Check your inbox.');
                setStep('otp');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ step: 'verify-otp', email, otp }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('OTP verified! Please set your new password.');
                setStep('reset');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    step: 'reset-password', 
                    email, 
                    otp, 
                    newPassword 
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderEmailStep = () => (
        <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                />
            </div>
            
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Sending...' : 'Send Reset OTP'}
            </button>
            
            <div className="text-center pt-4">
                <p className="text-sm text-gray-500 mb-2">Don't have an account?</p>
                <Link 
                    href="/signup" 
                    className="text-orange-400 hover:text-orange-300 transition-colors font-medium text-sm"
                >
                    Sign up for a new account
                </Link>
            </div>
        </form>
    );

    const renderOTPStep = () => (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter OTP
                </label>
                <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength="6"
                    required
                    disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                    Enter the 6-digit code sent to {email}
                </p>
            </div>
            
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-gray-400 hover:text-orange-400 transition-colors"
            >
                ← Back to Email
            </button>
        </form>
    );

    const renderResetStep = () => (
        <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                </label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    placeholder="Enter new password"
                    required
                    disabled={loading}
                />
            </div>
            
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                />
            </div>
            
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <button
                type="button"
                onClick={() => setStep('otp')}
                className="w-full text-gray-400 hover:text-orange-400 transition-colors"
            >
                ← Back to OTP
            </button>
        </form>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-300 p-2 rounded-lg">
                            <div className="bg-black p-2 rounded-md">
                                <span className="text-amber-400 font-bold text-2xl">DF</span>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {step === 'email' && 'Forgot Password'}
                        {step === 'otp' && 'Verify OTP'}
                        {step === 'reset' && 'Reset Password'}
                    </h2>
                    <p className="text-gray-400">
                        {step === 'email' && 'Enter your email to receive a reset code'}
                        {step === 'otp' && 'Enter the 6-digit code sent to your email'}
                        {step === 'reset' && 'Create a new password for your account'}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl">
                    {step === 'email' && renderEmailStep()}
                    {step === 'otp' && renderOTPStep()}
                    {step === 'reset' && renderResetStep()}
                </div>

                {/* Messages */}
                {message && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400 text-center">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-center">
                        {error}
                    </div>
                )}

                {/* Back to Login */}
                <div className="text-center">
                    <Link 
                        href="/login" 
                        className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
