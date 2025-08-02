'use client'
import { useState } from "react";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

const Login = () => {
    const { router, loginUser } = useAppContext();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.email.trim()) {
            setMessage({ type: 'error', text: 'Email is required' });
            return;
        }
        if (!formData.password.trim()) {
            setMessage({ type: 'error', text: 'Password is required' });
            return;
        }
        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            
            const result = await loginUser(formData);
            
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                // Redirect to home page after successful login
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            setLoading(true);
            // Handle social login (Google, Facebook, etc.)
            console.log(`Login with ${provider}`);
            // You would implement actual social login here
            setMessage({ type: 'info', text: `${provider} login coming soon!` });
        } catch (error) {
            console.error(`${provider} login error:`, error);
            setMessage({ type: 'error', text: `${provider} login failed. Please try again.` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-black via-gray-900 to-black min-h-screen">
            <Navbar />
            <br />
            <br />
            <br />
            
            <div className="flex items-center justify-center px-6 py-16 min-h-screen">
                <div className="max-w-md w-full">
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-8 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className="bg-gradient-to-r from-amber-500 to-amber-300 p-2 rounded-lg">
                                    <div className="bg-black p-2 rounded-md">
                                        <span className="text-amber-400 font-bold text-2xl">DF</span>
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-200 mb-2">Welcome Back</h1>
                            <p className="text-gray-400">Sign in to your account</p>
                        </div>

                        {/* Message Alert */}
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg border ${
                                message.type === 'success' 
                                    ? 'bg-green-900/20 border-green-500/50 text-green-300' 
                                    : message.type === 'error'
                                    ? 'bg-red-900/20 border-red-500/50 text-red-300'
                                    : 'bg-blue-900/20 border-blue-500/50 text-blue-300'
                            }`}>
                                <div className="flex items-center gap-2">
                                    <span>
                                        {message.type === 'success' ? '✓' : 
                                         message.type === 'error' ? '⚠' : 'ℹ'}
                                    </span>
                                    <span>{message.text}</span>
                                </div>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors pr-12"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                        disabled={loading}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700"
                                        disabled={loading}
                                    />
                                    <label className="ml-2 block text-sm text-gray-400">
                                        Remember me
                                    </label>
                                </div>
                                <Link href="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleSocialLogin('Google')}
                                disabled={loading}
                                className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700/30 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </button>
                            <button
                                onClick={() => handleSocialLogin('Facebook')}
                                disabled={loading}
                                className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg text-gray-300 bg-gray-700/30 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div className="mt-8 text-center">
                        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <span>•</span>
                            <Link href="/terms" className="hover:text-gray-400 transition-colors">
                                Terms of Service
                            </Link>
                            <span>•</span>
                            <Link href="/help" className="hover:text-gray-400 transition-colors">
                                Help
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;