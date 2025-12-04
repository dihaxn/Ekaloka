'use client';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import MessageAlert from '../../components/MessageAlert';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import {
  formatPhoneNumber,
  validateSriLankanPhone,
  normalizePhoneForBackend,
} from '../../lib/phone';
import {
  validateEmail,
  validatePassword,
  getPasswordErrorMessage,
  validateRequired,
  validatePhoneFormat,
} from '../../lib/validators';

/**
 * Signup Component
 *
 * SECURITY NOTES:
 * - Password validation is implemented client-side for UX but MUST be duplicated server-side
 * - OTP validation and rate limiting MUST be enforced server-side
 * - Phone number normalization happens client-side but server should validate format
 * - CSRF protection requires backend to verify oauth_state from localStorage
 * - All sensitive data (passwords, OTPs) should be hashed/encrypted server-side
 * - httpOnly cookies should be set server-side for session management
 */
const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    agreeToTerms: false,
    subscribeNewsletter: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(0);

  // Network status detection
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // AbortController for fetch calls
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Check API URL configuration
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl && process.env.NODE_ENV === 'production') {
      console.error('NEXT_PUBLIC_API_URL is not configured');
      setMessage({
        type: 'error',
        text: 'Configuration error. Please contact support.',
      });
    }
  }, []);

  // Form data persistence for offline/retry handling
  useEffect(() => {
    // Load saved form data on mount
    const savedFormData = localStorage.getItem('signup_form_data');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        // Don't restore sensitive fields
        setFormData(prev => ({
          ...prev,
          fullName: parsed.fullName || '',
          email: parsed.email || '',
          phoneNumber: parsed.phoneNumber || '',
          subscribeNewsletter: parsed.subscribeNewsletter || false,
        }));
        setCurrentStep(parsed.currentStep || 1);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        localStorage.removeItem('signup_form_data');
      }
    }
  }, []);

  // Save form data to localStorage (excluding sensitive fields)
  const saveFormData = useCallback(() => {
    const dataToSave = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      subscribeNewsletter: formData.subscribeNewsletter,
      currentStep,
    };
    localStorage.setItem('signup_form_data', JSON.stringify(dataToSave));
  }, [
    formData.fullName,
    formData.email,
    formData.phoneNumber,
    formData.subscribeNewsletter,
    currentStep,
  ]);

  // Save form data when it changes
  useEffect(() => {
    saveFormData();
  }, [saveFormData]);

  // Clear saved form data on successful account creation
  const clearSavedFormData = useCallback(() => {
    localStorage.removeItem('signup_form_data');
    localStorage.removeItem('signup_otp_cooldown');
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          setResendCooldown(resendCooldown - 1);
          if (resendCooldown - 1 === 0) {
            sessionStorage.removeItem('signup_otp_cooldown');
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Retry function for failed requests
  const retryRequest = useCallback(
    requestFunction => {
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          requestFunction();
        }, 1000 * retryCount); // Exponential backoff
      } else {
        setMessage({
          type: 'error',
          text: 'Maximum retry attempts reached. Please check your connection and try again.',
        });
        setRetryCount(0);
      }
    },
    [retryCount]
  );

  // Focus first input when step changes
  useEffect(() => {
    const firstInputs = {
      1: 'fullName',
      2: 'phoneNumber',
      3: 'otp',
    };
    const inputId = firstInputs[currentStep];
    if (inputId) {
      const element = document.getElementById(inputId);
      if (element) {
        element.focus();
      }
    }
  }, [currentStep]);

  // Session timeout warning for OTP step
  useEffect(() => {
    if (currentStep === 3 && otpSent) {
      const timeout = setTimeout(
        () => {
          if (mountedRef.current && currentStep === 3) {
            setMessage({
              type: 'info',
              text: 'OTP session will expire soon. Please enter the code or request a new one.',
            });
          }
        },
        8 * 60 * 1000
      ); // 8 minutes warning (OTP expires in 10 minutes)

      return () => clearTimeout(timeout);
    }
  }, [currentStep, otpSent]);

  const handleInputChange = useCallback(
    e => {
      const { name, value, type, checked } = e.target;

      // Sanitize input to prevent XSS
      const sanitizeInput = input => {
        return input
          .replace(/[<>]/g, '') // Remove < and > characters
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick=, onerror=, etc.)
          .replace(/data:/gi, '') // Remove data: protocol
          .replace(/vbscript:/gi, '') // Remove vbscript: protocol
          .replace(/expression\s*\(/gi, '') // Remove CSS expressions
          .trim();
      };

      if (name === 'phoneNumber') {
        const formattedPhone = formatPhoneNumber(value);
        setFormData(prev => ({
          ...prev,
          [name]: formattedPhone,
        }));
      } else if (name === 'fullName' || name === 'email') {
        const sanitizedValue = sanitizeInput(value);
        setFormData(prev => ({
          ...prev,
          [name]: sanitizedValue,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }));
      }

      // Clear validation errors when user starts typing
      if (validationErrors[name]) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: '',
        }));
      }

      // Clear message when user starts typing
      if (message.text) {
        setMessage({ type: '', text: '' });
      }
    },
    [validationErrors, message.text]
  );

  const focusFirst = useCallback(errors => {
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      const element = document.getElementById(firstKey);
      if (element) {
        element.focus();
      }
    }
  }, []);

  const validateStep1 = useCallback(() => {
    const errors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = getPasswordErrorMessage(passwordValidation);
      }
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  }, [
    formData.fullName,
    formData.email,
    formData.password,
    formData.confirmPassword,
  ]);

  const validateStep2 = useCallback(() => {
    const errors = {};

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!validateSriLankanPhone(formData.phoneNumber)) {
      errors.phoneNumber =
        'Please enter a valid Sri Lankan phone number (07XXXXXXXX or +947XXXXXXXX)';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    return errors;
  }, [formData.phoneNumber, formData.agreeToTerms]);

  const validateStep3 = useCallback(() => {
    const errors = {};

    if (!otp.trim()) {
      errors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp)) {
      errors.otp = 'OTP must be 6 digits';
    }

    return errors;
  }, [otp]);

  const handleNext = () => {
    if (loading || otpLoading) return; // Prevent action if already loading

    setMessage({ type: '', text: '' });
    if (currentStep === 1) {
      const errors = validateStep1();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        focusFirst(errors);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const errors = validateStep2();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        focusFirst(errors);
        return;
      }
      handleSendOTP();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
      setMessage({ type: '', text: '' });

      // Clear OTP-related states when going back
      if (currentStep === 3) {
        setOtp('');
        setResendCooldown(0);
        setOtpLoading(false);
        setOtpSent(false);
      }
    }
  };

  const handleSendOTP = async () => {
    try {
      setOtpLoading(true);
      setMessage({ type: '', text: '' });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        setMessage({
          type: 'error',
          text: 'Configuration error: API URL not configured',
        });
        return;
      }

      const phoneNumber = normalizePhoneForBackend(formData.phoneNumber);

      const response = await fetch(`${apiUrl}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (response.status === 429) {
        setMessage({
          type: 'error',
          text: 'Too many requests. Please wait before trying again.',
        });
        return;
      }

      // Handle server errors
      if (response.status >= 500) {
        setMessage({
          type: 'error',
          text: 'Server error. Please try again later.',
        });
        return;
      }

      if (result.success) {
        setOtpSent(true);
        setCurrentStep(3);
        setMessage({
          type: 'success',
          text: 'OTP sent successfully to your phone number!',
        });
        setResendCooldown(60);

        // Debug OTP logging (only if enabled)
        if (process.env.NEXT_PUBLIC_ENABLE_OTP_DEBUG === 'true') {
          console.log('OTP sent to:', phoneNumber);
          // Note: Server should log OTP for debugging purposes
        }
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to send OTP',
        });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMessage =
        error.message === 'Invalid response from server'
          ? 'Network error. Please check your connection and try again.'
          : 'Failed to send OTP. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const errors = validateStep3();
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
        setMessage({
          type: 'error',
          text: 'Configuration error: API URL not configured',
        });
        return;
      }

      const phoneNumber = normalizePhoneForBackend(formData.phoneNumber);

      const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: phoneNumber,
          otp,
          subscribeNewsletter: formData.subscribeNewsletter,
        }),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (result.success) {
        clearSavedFormData(); // Clear saved form data
        toast.success('Account created successfully! Redirecting to login...', {
          duration: 2000,
          position: 'top-center',
        });

        setTimeout(() => {
          if (mountedRef.current) {
            router.push('/login');
          }
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to create account',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage =
        error.message === 'Invalid response from server'
          ? 'Network error. Please check your connection and try again.'
          : 'An error occurred. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNext = () => {
    if (currentStep === 1) {
      const errors = validateStep1();
      return Object.keys(errors).length === 0;
    }
    if (currentStep === 2) {
      const errors = validateStep2();
      return Object.keys(errors).length === 0;
    }
    return false;
  };

  return (
    <div className='bg-gradient-to-r from-black via-gray-900 to-black min-h-screen'>
      <div className='flex items-center justify-center px-6 py-16 min-h-screen'>
        <div className='max-w-md w-full'>
          <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-8 shadow-2xl'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='flex justify-center mb-4'>
                <div className='bg-gradient-to-r from-amber-500 to-amber-300 p-2 rounded-lg'>
                  <div className='bg-black p-2 rounded-md'>
                    <span className='text-amber-400 font-bold text-2xl'>
                      DF
                    </span>
                  </div>
                </div>
              </div>
              <h1 className='text-2xl font-bold text-gray-200 mb-2'>
                Create Account
              </h1>
              <p className='text-gray-400'>Join Dai Fashion today</p>
            </div>

            {/* Progress Steps */}
            <div className='flex items-center justify-center mb-8'>
              <div className='flex items-center'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-600'
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  2
                </div>
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep >= 3 ? 'bg-orange-600' : 'bg-gray-600'
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 3
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  3
                </div>
              </div>
            </div>

            {/* Message Alert */}
            <MessageAlert message={message} />

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleNext();
                }}
                className='space-y-4'
                noValidate
              >
                <div>
                  <label
                    htmlFor='fullName'
                    className='block text-gray-400 text-sm font-medium mb-2'
                  >
                    Full Name *
                  </label>
                  <input
                    id='fullName'
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder='Enter your full name'
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      validationErrors.fullName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    disabled={loading}
                    aria-describedby={
                      validationErrors.fullName ? 'fullName-error' : undefined
                    }
                    aria-invalid={!!validationErrors.fullName}
                  />
                  {validationErrors.fullName && (
                    <p
                      id='fullName-error'
                      className='mt-1 text-sm text-red-400'
                      role='alert'
                    >
                      {validationErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-gray-400 text-sm font-medium mb-2'
                  >
                    Email Address *
                  </label>
                  <input
                    id='email'
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='Enter your email'
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      validationErrors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    disabled={loading}
                    aria-describedby={
                      validationErrors.email ? 'email-error' : undefined
                    }
                    aria-invalid={!!validationErrors.email}
                  />
                  {validationErrors.email && (
                    <p
                      id='email-error'
                      className='mt-1 text-sm text-red-400'
                      role='alert'
                    >
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='password'
                    className='block text-gray-400 text-sm font-medium mb-2'
                  >
                    Password *
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder='Create a password (min. 8 characters)'
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors pr-12 ${
                        validationErrors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                      disabled={loading}
                      aria-describedby={
                        validationErrors.password
                          ? 'password-error'
                          : 'password-hint'
                      }
                      aria-invalid={!!validationErrors.password}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors'
                      disabled={loading}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>

                  {/* Password Requirements Hint */}
                  <div
                    className='mt-2 text-xs text-gray-500'
                    id='password-hint'
                  >
                    Password must contain: at least 8 characters, uppercase
                    letter, lowercase letter, number, and symbol
                  </div>

                  <PasswordStrengthIndicator password={formData.password} />

                  {validationErrors.password && (
                    <p
                      id='password-error'
                      className='mt-1 text-sm text-red-400'
                      role='alert'
                    >
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-gray-400 text-sm font-medium mb-2'
                  >
                    Confirm Password *
                  </label>
                  <div className='relative'>
                    <input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder='Confirm your password'
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors pr-12 ${
                        validationErrors.confirmPassword
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                      }`}
                      disabled={loading}
                      aria-describedby={
                        validationErrors.confirmPassword
                          ? 'confirmPassword-error'
                          : undefined
                      }
                      aria-invalid={!!validationErrors.confirmPassword}
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors'
                      disabled={loading}
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>

                  {validationErrors.confirmPassword && (
                    <p
                      id='confirmPassword-error'
                      className='mt-1 text-sm text-red-400'
                      role='alert'
                    >
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={!canProceedToNext() || loading}
                  className='w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300'
                >
                  Next
                </button>
              </form>
            )}

            {/* Step 2: Phone & Terms */}
            {currentStep === 2 && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleNext();
                }}
                className='space-y-4'
                noValidate
              >
                <div>
                  <label
                    htmlFor='phoneNumber'
                    className='block text-gray-400 text-sm font-medium mb-2'
                  >
                    Phone Number *
                  </label>
                  <input
                    id='phoneNumber'
                    type='tel'
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder='07XXXXXXXX or +947XXXXXXXX'
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      validationErrors.phoneNumber
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    disabled={loading}
                    aria-describedby={
                      validationErrors.phoneNumber
                        ? 'phoneNumber-error'
                        : undefined
                    }
                    aria-invalid={!!validationErrors.phoneNumber}
                  />
                  {validationErrors.phoneNumber && (
                    <p
                      id='phoneNumber-error'
                      className='mt-1 text-sm text-red-400'
                      role='alert'
                    >
                      {validationErrors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className='flex items-start'>
                  <input
                    id='agreeToTerms'
                    type='checkbox'
                    name='agreeToTerms'
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700 mt-1'
                    disabled={loading}
                  />
                  <label
                    htmlFor='agreeToTerms'
                    className='ml-2 block text-sm text-gray-400 cursor-pointer'
                  >
                    I agree to the{' '}
                    <Link
                      href='/terms'
                      className='text-orange-400 hover:text-orange-300'
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href='/privacy'
                      className='text-orange-400 hover:text-orange-300'
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {validationErrors.agreeToTerms && (
                  <p className='mt-1 text-sm text-red-400' role='alert'>
                    {validationErrors.agreeToTerms}
                  </p>
                )}

                <div className='flex items-start'>
                  <input
                    id='subscribeNewsletter'
                    type='checkbox'
                    name='subscribeNewsletter'
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700 mt-1'
                    disabled={loading}
                  />
                  <label
                    htmlFor='subscribeNewsletter'
                    className='ml-2 block text-sm text-gray-400 cursor-pointer'
                  >
                    Subscribe to our newsletter for updates and offers
                  </label>
                </div>

                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={handleBack}
                    className='flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors'
                  >
                    Back
                  </button>
                  <button
                    type='submit'
                    disabled={!canProceedToNext() || loading || otpLoading}
                    className='flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
                  >
                    {otpLoading ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Sending...
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
              <form onSubmit={handleSubmit} className='space-y-4' noValidate>
                <div>
                  <label
                    htmlFor='otp'
                    className='block text-gray-400 text-sm font-medium mb-2'
                  >
                    Enter OTP *
                  </label>
                  <input
                    id='otp'
                    type='text'
                    name='otp'
                    value={otp}
                    onChange={e => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      if (validationErrors.otp) {
                        setValidationErrors(prev => ({ ...prev, otp: '' }));
                      }
                    }}
                    placeholder='Enter 6-digit OTP'
                    maxLength='6'
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                      validationErrors.otp
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    disabled={loading}
                    aria-describedby={
                      validationErrors.otp ? 'otp-error' : undefined
                    }
                    aria-invalid={!!validationErrors.otp}
                  />
                  {validationErrors.otp && (
                    <p
                      id='otp-error'
                      className='mt-1 text-sm text-red-400'
                      role='alert'
                    >
                      {validationErrors.otp}
                    </p>
                  )}
                </div>

                <div className='text-center'>
                  <p className='text-sm text-gray-400 mb-3'>
                    Didn't receive the OTP?
                  </p>
                  <button
                    type='button'
                    onClick={handleSendOTP}
                    disabled={resendCooldown > 0 || otpLoading || loading}
                    className='text-orange-400 hover:text-orange-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm font-medium transition-colors'
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend OTP'}
                  </button>
                </div>

                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={handleBack}
                    className='flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors'
                  >
                    Back
                  </button>
                  <button
                    type='submit'
                    disabled={!otp.trim() || otp.length !== 6 || loading}
                    className='flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
                  >
                    {loading ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Social Login */}
            {currentStep === 1 && (
              <>
                <div className='my-6'>
                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-t border-gray-600'></div>
                    </div>
                    <div className='relative flex justify-center text-sm'>
                      <span className='px-2 bg-gray-800 text-gray-400'>
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>
                <SocialLoginButtons loading={loading} />
              </>
            )}

            {/* Sign In Link */}
            <div className='mt-6 text-center'>
              <p className='text-gray-400'>
                Already have an account?{' '}
                <Link
                  href='/login'
                  className='text-orange-400 hover:text-orange-300 font-medium transition-colors'
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Links */}
          <div className='mt-8 text-center'>
            <div className='flex items-center justify-center space-x-6 text-sm text-gray-500'>
              <Link
                href='/privacy'
                className='hover:text-gray-400 transition-colors'
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                href='/terms'
                className='hover:text-gray-400 transition-colors'
              >
                Terms of Service
              </Link>
              <span>•</span>
              <Link
                href='/help'
                className='hover:text-gray-400 transition-colors'
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
