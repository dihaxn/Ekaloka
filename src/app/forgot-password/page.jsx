'use client'
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import MessageAlert from "../../components/MessageAlert";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator";
import { validatePassword, getPasswordErrorMessage } from "../../utils/validators";

const ForgotPassword = () => {
    const router = useRouter();
    const [step, setStep] = useState('email'); // email, otp, reset
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [error, setError] = useState({ type: '', text: '' });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [resendCooldown, setResendCooldown] = useState(0);
    const mountedRef = useRef(true);

    // Check API URL configuration
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl && process.env.NODE_ENV === 'production') {
            console.error('NEXT_PUBLIC_API_URL is not configured');
            setError({ type: 'error', text: 'Configuration error. Please contact support.' });
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                if (mountedRef.current) {
                    setResendCooldown(resendCooldown - 1);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Focus first input when step changes
    useEffect(() => {
        const firstInputs = {
            email: 'email',
            otp: 'otp',
            reset: 'newPassword'
        };
        const inputId = firstInputs[step];
        if (inputId) {
            setTimeout(() => {
                const element = document.getElementById(inputId);
                if (element && mountedRef.current) {
                    element.focus();
                }
            }, 100);
        }
    }, [step]);

    // Email validation helper
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const focusFirst = useCallback((errors) => {
        const firstKey = Object.keys(errors)[0];
        if (firstKey) {
            const element = document.getElementById(firstKey);
            if (element && mountedRef.current) {
                element.focus();
            }
        }
    }, []);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        
        // Client-side email validation
        if (!isValidEmail(email)) {
            setValidationErrors({ email: 'Please enter a valid email address' });
            setError({ type: '', text: '' });
            setMessage({ type: '', text: '' });
            focusFirst({ email: 'Please enter a valid email address' });
            return;
        }

        if (!mountedRef.current) return;
        
        setLoading(true);
        setError({ type: '', text: '' });
        setMessage({ type: '', text: '' });
        setValidationErrors({});

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ step: 'send-otp', email }),
            });

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error('Invalid response from server');
            }

            if (response.status === 429) {
                if (mountedRef.current) {
                    setError({ type: 'error', text: 'Too many requests. Please wait before trying again.' });
                }
                return;
            }

            if (data.success && mountedRef.current) {
                setMessage({ type: 'success', text: 'OTP sent to your email! Check your inbox.' });
                setStep('otp');
                setResendCooldown(60);
            } else if (mountedRef.current) {
                setError({ type: 'error', text: data.message || 'Failed to send OTP' });
            }
        } catch (err) {
            if (mountedRef.current) {
                const errorMessage = err.message === 'Invalid response from server'
                    ? 'Network error. Please check your connection and try again.'
                    : 'Network error. Please try again.';
                setError({ type: 'error', text: errorMessage });
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        
        if (!mountedRef.current) return;
        
        setLoading(true);
        setError({ type: '', text: '' });
        setMessage({ type: '', text: '' });
        setValidationErrors({});

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                setError({ type: 'error', text: 'Configuration error: API URL not configured' });
                return;
            }
            
            const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ step: 'verify-otp', email, otp }),
            });

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error('Invalid response from server');
            }

            if (data.success && mountedRef.current) {
                setMessage({ type: 'success', text: 'OTP verified! Please set your new password.' });
                setStep('reset');
            } else if (mountedRef.current) {
                setError({ type: 'error', text: data.message || 'Invalid OTP' });
            }
        } catch (err) {
            if (mountedRef.current) {
                const errorMessage = err.message === 'Invalid response from server'
                    ? 'Network error. Please check your connection and try again.'
                    : 'Network error. Please try again.';
                setError({ type: 'error', text: errorMessage });
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    };

    const validateResetForm = useCallback(() => {
        const errors = {};

        // Password validation
        if (!newPassword.trim()) {
            errors.newPassword = 'New password is required';
        } else {
            const passwordValidation = validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                const failedRules = [];
                if (!passwordValidation.errors.minLength) failedRules.push('min 8 chars');
                if (!passwordValidation.errors.hasUpperCase) failedRules.push('uppercase');
                if (!passwordValidation.errors.hasLowerCase) failedRules.push('lowercase');
                if (!passwordValidation.errors.hasNumber) failedRules.push('number');
                if (!passwordValidation.errors.hasSymbol) failedRules.push('symbol');
                errors.newPassword = `Password must include: ${failedRules.join(', ')}`;
            }
        }

        // Confirm password validation
        if (!confirmPassword.trim()) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return errors;
    }, [newPassword, confirmPassword]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        const errors = validateResetForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            focusFirst(errors);
            return;
        }

        if (!mountedRef.current) return;
        
        setLoading(true);
        setError({ type: '', text: '' });
        setMessage({ type: '', text: '' });

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                setError({ type: 'error', text: 'Configuration error: API URL not configured' });
                return;
            }
            
            const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    step: 'reset-password', 
                    email, 
                    otp, 
                    newPassword 
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error('Invalid response from server');
            }

            if (data.success && mountedRef.current) {
                setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
                toast.success('Password reset successful! Redirecting to login...', {
                    duration: 2000,
                    position: 'top-center',
                });
                
                // Clear sensitive fields
                setNewPassword('');
                setConfirmPassword('');
                
                setTimeout(() => {
                    if (mountedRef.current) {
                        router.push('/login');
                    }
                }, 2000);
            } else if (mountedRef.current) {
                setError({ type: 'error', text: data.message || 'Failed to reset password' });
            }
        } catch (err) {
            if (mountedRef.current) {
                const errorMessage = err.message === 'Invalid response from server'
                    ? 'Network error. Please check your connection and try again.'
                    : 'Network error. Please try again.';
                setError({ type: 'error', text: errorMessage });
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    };

    const handleInputChange = useCallback((field, value) => {
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
        
        // Clear validation errors when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Clear messages when user starts typing
        if (message.text || error.text) {
            setMessage({ type: '', text: '' });
            setError({ type: '', text: '' });
        }

        // Update the appropriate field
        switch (field) {
            case 'email':
                setEmail(sanitizeInput(value));
                break;
            case 'otp':
                setOtp(value.replace(/\D/g, '').slice(0, 6));
                break;
            case 'newPassword':
                setNewPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
        }
    }, [validationErrors, message.text, error.text]);

    const handleBack = () => {
        if (step === 'reset') {
            setStep('otp');
            setNewPassword('');
            setConfirmPassword('');
            setValidationErrors({});
        } else if (step === 'otp') {
            setStep('email');
            setOtp('');
            setResendCooldown(0);
            setValidationErrors({});
        }
        setMessage({ type: '', text: '' });
        setError({ type: '', text: '' });
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                        validationErrors.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    placeholder="Enter your email address"
                    required
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
                    onChange={(e) => handleInputChange('otp', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength="6"
                    inputMode="numeric"
                    pattern="\d{6}"
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
                onClick={handleBack}
                className="w-full text-gray-400 hover:text-orange-400 transition-colors"
            >
                ← Back to Email
            </button>
        </form>
    );

    const renderResetStep = () => (
        <form onSubmit={handleResetPassword} className="space-y-6" noValidate>
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors pr-12 ${
                            validationErrors.newPassword 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                        }`}
                        placeholder="Enter new password"
                        required
                        disabled={loading}
                        aria-describedby={validationErrors.newPassword ? 'newPassword-error' : 'newPassword-hint'}
                        aria-invalid={!!validationErrors.newPassword}
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        disabled={loading}
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                
                {/* Password Requirements Hint */}
                <div className="mt-2 text-xs text-gray-500" id="newPassword-hint">
                    Password must contain: at least 8 characters, uppercase letter, lowercase letter, number, and symbol
                </div>
                
                {/* Password Strength Indicator */}
                <PasswordStrengthIndicator password={newPassword} />
                
                {validationErrors.newPassword && (
                    <p id="newPassword-error" className="mt-1 text-sm text-red-400" role="alert">
                        {validationErrors.newPassword}
                    </p>
                )}
            </div>
            
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors pr-12 ${
                            validationErrors.confirmPassword 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                        }`}
                        placeholder="Confirm new password"
                        required
                        disabled={loading}
                        aria-describedby={validationErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                        aria-invalid={!!validationErrors.confirmPassword}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        disabled={loading}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                
                {validationErrors.confirmPassword && (
                    <p id="confirmPassword-error" className="mt-1 text-sm text-red-400" role="alert">
                        {validationErrors.confirmPassword}
                    </p>
                )}
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
                onClick={handleBack}
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
                {message.text && <MessageAlert message={message} />}
                {error.text && <MessageAlert message={error} />}

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
