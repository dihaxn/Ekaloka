'use client'
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import SocialLoginButtons from "../../components/SocialLoginButtons";
import MessageAlert from "../../components/MessageAlert";

/**
 * Login Component
 * 
 * SECURITY NOTES:
 * - Credentials are sent with credentials: 'include' for httpOnly cookie support
 * - Remember Me functionality requires backend to issue longer-lived refresh tokens
 * - Password validation should happen server-side (client-side is UX only)
 * - CSRF protection requires backend to verify oauth_state from localStorage
 * - Server should set httpOnly, SameSite, Secure cookies for session management
 */
const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Check API URL configuration
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl && process.env.NODE_ENV === 'production') {
            console.error('NEXT_PUBLIC_API_URL is not configured');
            setMessage({ 
                type: 'error', 
                text: 'Configuration error. Please contact support.' 
            });
        }
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        
        // Sanitize input to prevent XSS
        const sanitizeInput = (input) => {
            return input
                .replace(/[<>]/g, '') // Remove < and > characters
                .replace(/javascript:/gi, '') // Remove javascript: protocol
                .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick=, onerror=, etc.)
                .replace(/data:/gi, '') // Remove data: protocol
                .replace(/vbscript:/gi, '') // Remove vbscript: protocol
                .replace(/expression\s*\(/gi, '') // Remove CSS expressions
                .trim();
        };
        
        if (name === 'email') {
            const sanitizedValue = sanitizeInput(value);
            setFormData(prev => ({
                ...prev,
                [name]: sanitizedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear validation errors when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear message when user starts typing
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    }, [validationErrors, message.text]);

    const validateForm = useCallback(() => {
        const errors = {};

        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            errors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        }

        setValidationErrors(errors);
        return errors;
    }, [formData.email, formData.password]);

    const focusFirst = useCallback((errors) => {
        const firstKey = Object.keys(errors)[0];
        if (firstKey) {
            const element = document.getElementById(firstKey);
            if (element) {
                element.focus();
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            focusFirst(errors);
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                setMessage({ type: 'error', text: 'Configuration error: API URL not configured' });
                return;
            }
            
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for httpOnly cookies
                body: JSON.stringify(formData)
            });

            let result;
            try {
                result = await response.json();
            } catch (parseError) {
                throw new Error('Invalid response from server');
            }

            // Handle rate limiting
            if (response.status === 429) {
                setMessage({ 
                    type: 'error', 
                    text: 'Too many login attempts. Please wait a few minutes before trying again.' 
                });
                return;
            }

            // Handle server errors
            if (response.status >= 500) {
                setMessage({ 
                    type: 'error', 
                    text: 'Server error. Please try again later.' 
                });
                return;
            }

            if (result.success) {
                toast.success('Login successful! Redirecting...', {
                    duration: 2000,
                    position: 'top-center',
                });
                
                // Redirect immediately
                router.push('/');
            } else {
                setMessage({ 
                    type: 'error', 
                    text: result.message || 'Invalid email or password. Please try again.' 
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.message === 'Invalid response from server' 
                ? 'Network error. Please check your connection and try again.'
                : 'An unexpected error occurred. Please try again.';
            
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-black via-gray-900 to-black min-h-screen">
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
                        <MessageAlert message={message} />

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div>
                                <label 
                                    htmlFor="email" 
                                    className="block text-gray-400 text-sm font-medium mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                                        validationErrors.email 
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                            : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                                    }`}
                                    disabled={loading}
                                    aria-describedby={validationErrors.email ? 'email-error' : undefined}
                                    aria-invalid={!!validationErrors.email}
                                />
                                {validationErrors.email && (
                                    <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
                                        {validationErrors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label 
                                    htmlFor="password" 
                                    className="block text-gray-400 text-sm font-medium mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors pr-12 ${
                                            validationErrors.password 
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                                        }`}
                                        disabled={loading}
                                        aria-describedby={validationErrors.password ? 'password-error' : undefined}
                                        aria-invalid={!!validationErrors.password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                        disabled={loading}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                
                                {validationErrors.password && (
                                    <p id="password-error" className="mt-1 text-sm text-red-400" role="alert">
                                        {validationErrors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="rememberMe"
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700"
                                        disabled={loading}
                                    />
                                    <label 
                                        htmlFor="rememberMe" 
                                        className="ml-2 block text-sm text-gray-400 cursor-pointer"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <Link 
                                    href="/forgot-password" 
                                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                                >
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
                        <SocialLoginButtons loading={loading} />

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
        </div>
    );
};

export default Login;