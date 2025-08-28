'use client'
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

const Signup = () => {
    const { router } = useAppContext();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        agreeToTerms: false,
        subscribeNewsletter: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'phoneNumber') {
            const formattedPhone = formatPhoneNumber(value);
            setFormData(prev => ({
                ...prev,
                [name]: formattedPhone
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const validateStep1 = () => {
        if (!formData.fullName.trim()) {
            setMessage({ type: 'error', text: 'Full name is required' });
            return false;
        }
        if (!formData.email.trim()) {
            setMessage({ type: 'error', text: 'Email is required' });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return false;
        }
        if (!formData.password.trim()) {
            setMessage({ type: 'error', text: 'Password is required' });
            return false;
        }
        if (formData.password.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return false;
        }
        return true;
    };

    const validateSriLankanPhone = (phone) => {
        const cleanPhone = phone.replace(/[\s-]/g, '');
        // Accept both +947XXXXXXXX and 07XXXXXXXX formats
        const sriLankanPhoneRegex = /^(\+94\d{9}|0\d{9})$/;
        return sriLankanPhoneRegex.test(cleanPhone);
    };

    const formatPhoneNumber = (value) => {
        const digits = value.replace(/\D/g, '');
        
        if (digits.length === 0) return '';
        
        // If user starts with 0, convert to +94
        if (digits.startsWith('0')) {
            const remainingDigits = digits.slice(1);
            if (remainingDigits.length === 0) return '+94';
            if (remainingDigits.length <= 2) return `+94${remainingDigits}`;
            if (remainingDigits.length <= 5) return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2)}`;
            if (remainingDigits.length <= 9) return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2, 5)} ${remainingDigits.slice(5)}`;
            return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2, 5)} ${remainingDigits.slice(5, 9)}`;
        }
        
        // If user starts with +94, format normally
        if (digits.startsWith('94')) {
            const remainingDigits = digits.slice(2);
            if (remainingDigits.length === 0) return '+94';
            if (remainingDigits.length <= 2) return `+94${remainingDigits}`;
            if (remainingDigits.length <= 5) return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2)}`;
            if (remainingDigits.length <= 9) return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2, 5)} ${remainingDigits.slice(5)}`;
            return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2, 5)} ${remainingDigits.slice(5, 9)}`;
        }
        
        // If user starts with 7, assume they want +94
        if (digits.startsWith('7')) {
            if (digits.length <= 2) return `+94${digits}`;
            if (digits.length <= 5) return `+94${digits.slice(0, 2)} ${digits.slice(2)}`;
            if (digits.length <= 9) return `+94${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
            return `+94${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
        }
        
        // Default formatting
        if (digits.length <= 2) return `+94${digits}`;
        if (digits.length <= 5) return `+94${digits.slice(0, 2)} ${digits.slice(2)}`;
        if (digits.length <= 9) return `+94${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
        return `+94${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
    };

    const validateStep2 = () => {
        if (!formData.phoneNumber.trim()) {
            setMessage({ type: 'error', text: 'Phone number is required' });
            return false;
        }
        if (!validateSriLankanPhone(formData.phoneNumber)) {
            setMessage({ type: 'error', text: 'Please enter a valid Sri Lankan phone number (07XXXXXXXX or +947XXXXXXXX)' });
            return false;
        }
        if (!formData.agreeToTerms) {
            setMessage({ type: 'error', text: 'You must agree to the Terms of Service' });
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (!otp.trim()) {
            setMessage({ type: 'error', text: 'OTP is required' });
            return false;
        }
        if (otp.length !== 6) {
            setMessage({ type: 'error', text: 'OTP must be 6 digits' });
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setMessage({ type: '', text: '' });
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            handleSendOTP();
        }
    };

    const handleBack = () => {
        if (currentStep === 3) {
            setCurrentStep(2);
            setOtp('');
        } else if (currentStep === 2) {
            setCurrentStep(1);
        }
        setMessage({ type: '', text: '' });
    };

    const handleSendOTP = async () => {
        try {
            setOtpLoading(true);
            setMessage({ type: '', text: '' });
            
            // Convert phone number to +94 format
            let phoneNumber = formData.phoneNumber.replace(/\s/g, '');
            if (phoneNumber.startsWith('0')) {
                phoneNumber = '+94' + phoneNumber.slice(1);
            } else if (!phoneNumber.startsWith('+94')) {
                phoneNumber = '+94' + phoneNumber;
            }
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    step: 'send-otp', 
                    phone: phoneNumber
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                setOtpSent(true);
                setCurrentStep(3);
                setMessage({ type: 'success', text: 'OTP sent successfully to your phone number!' });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setMessage({ type: 'error', text: 'Failed to send OTP. Please try again.' });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep3()) {
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            
            // Convert phone number to +94 format
            let phoneNumber = formData.phoneNumber.replace(/\s/g, '');
            if (phoneNumber.startsWith('0')) {
                phoneNumber = '+94' + phoneNumber.slice(1);
            } else if (!phoneNumber.startsWith('+94')) {
                phoneNumber = '+94' + phoneNumber;
            }
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    step: 'verify-otp',
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    phone: phoneNumber,
                    otp: otp
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
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
                            <h1 className="text-2xl font-bold text-gray-200 mb-2">Create Account</h1>
                            <p className="text-gray-400">Join Dai Fashion today</p>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-600 text-gray-400'
                                }`}>
                                    1
                                </div>
                                <div className={`w-16 h-1 mx-2 ${
                                    currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-600'
                                }`}></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-600 text-gray-400'
                                }`}>
                                    2
                                </div>
                                <div className={`w-16 h-1 mx-2 ${
                                    currentStep >= 3 ? 'bg-orange-600' : 'bg-gray-600'
                                }`}></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    currentStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-600 text-gray-400'
                                }`}>
                                    3
                                </div>
                            </div>
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

                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Email Address *
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
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Create a password (min. 8 characters)"
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

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm your password"
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors pr-12"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                            disabled={loading}
                                        >
                                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                        <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                                >
                                    Next Step
                                </button>
                            </form>
                        )}

                        {/* Step 2: Phone Number & Terms */}
                        {currentStep === 2 && (
                            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="07X XXX XXXX or +947XXXXXXXX"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                                        disabled={loading || otpLoading}
                                        maxLength="15"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Sri Lankan mobile number (07XXXXXXXX or +947XXXXXXXX). OTP will be shown in the console for testing.</p>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            name="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700 mt-0.5"
                                            disabled={loading || otpLoading}
                                        />
                                        <label className="ml-2 block text-sm text-gray-400">
                                            I agree to the{' '}
                                            <Link href="/terms" className="text-orange-400 hover:text-orange-300 underline">
                                                Terms of Service
                                            </Link>
                                            {' '}and{' '}
                                            <Link href="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </div>

                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            name="subscribeNewsletter"
                                            checked={formData.subscribeNewsletter}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700 mt-0.5"
                                            disabled={loading || otpLoading}
                                        />
                                        <label className="ml-2 block text-sm text-gray-400">
                                            Subscribe to our newsletter for fashion updates and exclusive offers
                                        </label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={loading || otpLoading}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 font-medium py-3 px-4 rounded-lg transition-all duration-300"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || otpLoading || !formData.agreeToTerms}
                                        className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        {otpLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Sending OTP...
                                            </>
                                        ) : (
                                            'Send OTP'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: OTP Verification */}
                        {currentStep === 3 && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-gray-200 mb-2">Verify Your Phone Number</h3>
                                    <p className="text-gray-400 text-sm">
                                        We've sent a 6-digit code to {formData.phoneNumber}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Enter 6-Digit OTP *
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="123456"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors text-center text-2xl tracking-widest"
                                        disabled={loading}
                                        maxLength="6"
                                    />
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={otpLoading}
                                        className="text-orange-400 hover:text-orange-300 text-sm underline disabled:opacity-50"
                                    >
                                        {otpLoading ? 'Resending...' : 'Resend OTP'}
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={loading}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 font-medium py-3 px-4 rounded-lg transition-all duration-300"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || otp.length !== 6}
                                        className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Signup;