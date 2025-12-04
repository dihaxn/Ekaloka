'use client';
import { Eye, EyeOff, Shield, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import MessageAlert from '../../components/MessageAlert';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { CsrfContext } from '../../context/CsrfContext';
import { useConfig } from '../../hooks/useConfig';
import { useTelemetry } from '../../hooks/useTelemetry';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * Login Component
 *
 * SECURITY NOTES:
 * - Credentials are sent with credentials: 'include' for httpOnly cookie support
 * - Remember Me functionality requires backend to issue longer-lived refresh tokens
 * - Password validation should happen server-side (client-side is UX only)
 * - CSRF protection implemented with token handling and refresh on 403 errors
 * - Server should set httpOnly, SameSite, Secure cookies for session management
 * - Generic error messages prevent user enumeration attacks
 * - Password stored in useRef to avoid memory exposure
 * - Lazy CSRF token fetching to reduce unnecessary API calls
 * - MFA/2FA support for enhanced security
 * - Telemetry logging for audit compliance
 * - Internationalization support for multi-language deployment
 */
const Login = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { apiUrl } = useConfig();
  const { logEvent } = useTelemetry();

  // Safely get CSRF context with fallback
  const csrfContext = useContext(CsrfContext);
  const {
    csrfToken = '',
    fetchCsrfToken = null,
    handleCsrfError = null,
  } = csrfContext || {};

  const [formData, setFormData] = useState({
    email: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [retryAfter, setRetryAfter] = useState(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaData, setMfaData] = useState({
    type: '', // 'otp', 'webauthn', 'recovery'
    challenge: null,
    methods: [],
  });

  // Refs for password and form elements
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const successAnnouncementRef = useRef(null);
  const toastRef = useRef(null);
  const otpRef = useRef(null);

  // Check API URL configuration
  useEffect(() => {
    if (!apiUrl && process.env.NODE_ENV === 'production') {
      console.error('API URL is not configured');
      setMessage({
        type: 'error',
        text: t('errors.configuration'),
      });
    }
  }, [apiUrl, t]);

  const handleInputChange = useCallback(
    e => {
      const { name, value, type, checked } = e.target;

      // No need for client-side sanitization - React handles XSS protection
      // Server-side validation is the proper security measure
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));

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

      // Clear retry countdown when user starts typing
      if (retryAfter) {
        setRetryAfter(null);
      }
    },
    [validationErrors, message.text, retryAfter]
  );

  const validateForm = useCallback(() => {
    const errors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = t('validation.email.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = t('validation.email.invalid');
    }

    // Password validation
    if (!passwordRef.current?.value.trim()) {
      errors.password = t('validation.password.required');
    }

    setValidationErrors(errors);
    return errors;
  }, [formData.email, t]);

  const focusFirst = useCallback(errors => {
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      const element =
        firstKey === 'email' ? emailRef.current : passwordRef.current;
      if (element) {
        element.focus();
      }
    }
  }, []);

  // Clear password field only on authentication errors
  const clearPasswordField = useCallback(() => {
    if (passwordRef.current) {
      passwordRef.current.value = '';
      passwordRef.current.focus();
    }
  }, []);

  // Handle MFA challenge
  const handleMfaChallenge = useCallback(
    async mfaResponse => {
      try {
        setLoading(true);

        const response = await fetch(`${apiUrl}/api/auth/mfa/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(mfaResponse),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            logEvent('login_success', {
              method: 'mfa',
              mfaType: mfaData.type,
            });
            handleSuccessfulLogin();
          } else {
            setMessage({
              type: 'error',
              text: t('errors.mfa.invalid'),
            });
            if (otpRef.current) {
              otpRef.current.value = '';
              otpRef.current.focus();
            }
          }
        } else {
          setMessage({
            type: 'error',
            text: t('errors.mfa.failed'),
          });
        }
      } catch (error) {
        console.error('MFA verification error:', error);
        setMessage({
          type: 'error',
          text: t('errors.generic'),
        });
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, mfaData.type, t, logEvent]
  );

  // Handle successful login with proper accessibility and toast dismissal
  const handleSuccessfulLogin = useCallback(() => {
    // Announce success to screen readers before redirect
    if (successAnnouncementRef.current) {
      successAnnouncementRef.current.textContent = t(
        'login.success.announcement'
      );
    }

    // Show toast and wait for dismissal before redirect
    toastRef.current = toast.success(t('login.success.toast'), {
      duration: 3000,
      position: 'top-center',
      onDismiss: () => {
        router.push('/');
      },
    });

    // Fallback redirect after 4 seconds if toast doesn't dismiss
    setTimeout(() => {
      if (toastRef.current) {
        router.push('/');
      }
    }, 4000);
  }, [router, t]);

  // Abstract API call function
  const makeApiCall = useCallback(
    async (endpoint, options = {}) => {
      if (!apiUrl) {
        throw new Error(t('errors.configuration'));
      }

      const defaultOptions = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      };

      const response = await fetch(`${apiUrl}${endpoint}`, {
        ...defaultOptions,
        ...options,
      });

      return response;
    },
    [apiUrl, t]
  );

  const handleSubmit = async e => {
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
      setRetryAfter(null);
      setMfaRequired(false);

      // Log login attempt
      logEvent('login_attempt', {
        email: formData.email,
        rememberMe: formData.rememberMe,
      });

      // Prepare request data
      const requestData = {
        email: formData.email,
        password: passwordRef.current?.value || '',
        rememberMe: formData.rememberMe,
      };

      // Prepare request headers with CSRF token if available
      const headers = { 'Content-Type': 'application/json' };
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await makeApiCall('/api/auth/login', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
      });

      // Handle CSRF token expiration with proper token handling
      if (
        response.status === 403 &&
        response.headers.get('X-CSRF-Required') &&
        handleCsrfError
      ) {
        const newToken = await handleCsrfError();
        if (newToken) {
          // Retry the request with the new token
          const retryHeaders = { 'Content-Type': 'application/json' };
          if (newToken) {
            retryHeaders['X-CSRF-Token'] = newToken;
          }

          const retryResponse = await makeApiCall('/api/auth/login', {
            method: 'POST',
            headers: retryHeaders,
            body: JSON.stringify(requestData),
          });

          // Process retry response
          if (retryResponse.ok) {
            const result = await retryResponse.json();
            if (result.success) {
              logEvent('login_success', { method: 'password' });
              handleSuccessfulLogin();
              return;
            } else if (result.mfaRequired) {
              setMfaRequired(true);
              setMfaData(result.mfaData);
              logEvent('mfa_required', {
                methods: result.mfaData.methods,
              });
              return;
            }
          }
        }
      }

      let result;
      try {
        // Handle 204 No Content responses properly
        if (response.status === 204) {
          result = { success: true };
        } else {
          result = await response.json();
        }
      } catch (parseError) {
        // Better error handling for different response types
        if (response.status === 204) {
          result = { success: true };
        } else {
          throw new Error(t('errors.invalidResponse'));
        }
      }

      // Handle MFA requirement
      if (result.mfaRequired) {
        setMfaRequired(true);
        setMfaData(result.mfaData);
        logEvent('mfa_required', {
          methods: result.mfaData.methods,
        });
        return;
      }

      // Handle rate limiting with Retry-After header
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After');
        if (retryAfterHeader) {
          const seconds = parseInt(retryAfterHeader, 10);
          setRetryAfter(seconds);
          setMessage({
            type: 'error',
            text: t('errors.rateLimit.withTime', { seconds }),
          });
        } else {
          setMessage({
            type: 'error',
            text: t('errors.rateLimit.generic'),
          });
        }
        logEvent('login_rate_limited', {
          email: formData.email,
        });
        // Don't clear password on rate limiting - keep it for user convenience
        return;
      }

      // Handle authentication errors (401/403) - clear password
      if (response.status === 401 || response.status === 403) {
        setMessage({
          type: 'error',
          text: t('errors.invalidCredentials'),
        });
        logEvent('login_failed', {
          email: formData.email,
          reason: 'invalid_credentials',
        });
        clearPasswordField();
        return;
      }

      // Handle server errors (5xx) - don't clear password, use generic message
      if (response.status >= 500) {
        setMessage({
          type: 'error',
          text: t('errors.generic'),
        });
        logEvent('login_failed', {
          email: formData.email,
          reason: 'server_error',
          status: response.status,
        });
        return;
      }

      if (result.success) {
        logEvent('login_success', { method: 'password' });
        handleSuccessfulLogin();
      } else {
        // Generic error message to prevent user enumeration
        setMessage({
          type: 'error',
          text: t('errors.invalidCredentials'),
        });
        logEvent('login_failed', {
          email: formData.email,
          reason: 'invalid_credentials',
        });
        clearPasswordField();
      }
    } catch (error) {
      console.error('Login error:', error);
      // Use generic error message to prevent information leakage
      const errorMessage = t('errors.generic');

      setMessage({ type: 'error', text: errorMessage });
      logEvent('login_failed', {
        email: formData.email,
        reason: 'network_error',
        error: error.message,
      });
      // Don't clear password on network errors
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = useCallback(
    e => {
      e.preventDefault();
      const otpValue = otpRef.current?.value;
      if (!otpValue) {
        setMessage({
          type: 'error',
          text: t('validation.otp.required'),
        });
        return;
      }
      handleMfaChallenge({ type: 'otp', code: otpValue });
    },
    [handleMfaChallenge, t]
  );

  // Handle WebAuthn authentication
  const handleWebAuthn = useCallback(async () => {
    try {
      setLoading(true);
      const credential = await navigator.credentials.get({
        publicKey: mfaData.challenge,
      });

      await handleMfaChallenge({
        type: 'webauthn',
        credential,
      });
    } catch (error) {
      console.error('WebAuthn error:', error);
      setMessage({
        type: 'error',
        text: t('errors.mfa.webauthn'),
      });
      setLoading(false);
    }
  }, [mfaData.challenge, handleMfaChallenge, t]);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setTimeout(() => {
        setRetryAfter(prev => (prev > 0 ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retryAfter]);

  // Cleanup toast reference on unmount
  useEffect(() => {
    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, []);

  // MFA Challenge UI
  if (mfaRequired) {
    return (
      <div className='bg-gradient-to-r from-black via-gray-900 to-black min-h-screen'>
        <div className='flex items-center justify-center px-6 py-16 min-h-screen'>
          <div className='max-w-md w-full'>
            <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-8 shadow-2xl'>
              {/* Header */}
              <div className='text-center mb-8'>
                <div className='flex justify-center mb-4'>
                  <div className='bg-gradient-to-r from-amber-500 to-amber-300 p-2 rounded-lg'>
                    <Shield className='w-8 h-8 text-black' />
                  </div>
                </div>
                <h1 className='text-2xl font-bold text-gray-200 mb-2'>
                  {t('mfa.title')}
                </h1>
                <p className='text-gray-400'>{t('mfa.subtitle')}</p>
              </div>

              {/* Message Alert */}
              <MessageAlert message={message} />

              {/* MFA Methods */}
              <div className='space-y-4'>
                {mfaData.methods.includes('otp') && (
                  <form onSubmit={handleOtpSubmit} className='space-y-4'>
                    <div>
                      <label
                        htmlFor='otp'
                        className='block text-gray-400 text-sm font-medium mb-2'
                      >
                        {t('mfa.otp.label')}
                      </label>
                      <input
                        ref={otpRef}
                        id='otp'
                        type='text'
                        placeholder={t('mfa.otp.placeholder')}
                        className='w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:border-orange-500 focus:ring-orange-500 transition-colors'
                        disabled={loading}
                        autoComplete='one-time-code'
                        maxLength={6}
                      />
                    </div>
                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
                    >
                      {loading ? (
                        <>
                          <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                          {t('mfa.verifying')}
                        </>
                      ) : (
                        t('mfa.verify')
                      )}
                    </button>
                  </form>
                )}

                {mfaData.methods.includes('webauthn') && (
                  <button
                    onClick={handleWebAuthn}
                    disabled={loading}
                    className='w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
                  >
                    <Smartphone className='w-5 h-5' />
                    {loading ? t('mfa.verifying') : t('mfa.webauthn.button')}
                  </button>
                )}

                <button
                  onClick={() => {
                    setMfaRequired(false);
                    setMfaData({ type: '', challenge: null, methods: [] });
                  }}
                  className='w-full text-gray-400 hover:text-gray-300 transition-colors text-sm'
                >
                  {t('mfa.back')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-r from-black via-gray-900 to-black min-h-screen'>
      {/* Hidden success announcement for screen readers - only one live region */}
      <div
        ref={successAnnouncementRef}
        className='sr-only'
        aria-live='assertive'
        aria-atomic='true'
      />

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
                {t('login.title')}
              </h1>
              <p className='text-gray-400'>{t('login.subtitle')}</p>
            </div>

            {/* Message Alert - no aria-live to prevent double announcements */}
            <MessageAlert message={message} />

            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-6' noValidate>
              <div>
                <label
                  htmlFor='email'
                  className='block text-gray-400 text-sm font-medium mb-2'
                >
                  {t('login.email.label')}
                </label>
                <input
                  ref={emailRef}
                  id='email'
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('login.email.placeholder')}
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                    validationErrors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                  }`}
                  disabled={loading || retryAfter > 0}
                  aria-describedby={
                    validationErrors.email ? 'email-error' : undefined
                  }
                  aria-invalid={!!validationErrors.email}
                  autoComplete='email'
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
                  {t('login.password.label')}
                </label>
                <div className='relative'>
                  <input
                    ref={passwordRef}
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder={t('login.password.placeholder')}
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors pr-12 ${
                      validationErrors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                    disabled={loading || retryAfter > 0}
                    aria-describedby={
                      validationErrors.password ? 'password-error' : undefined
                    }
                    aria-invalid={!!validationErrors.password}
                    autoComplete='current-password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors'
                    disabled={loading || retryAfter > 0}
                    aria-label={
                      showPassword
                        ? t('login.password.hide')
                        : t('login.password.show')
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>

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

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='rememberMe'
                    type='checkbox'
                    name='rememberMe'
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-700'
                    disabled={loading || retryAfter > 0}
                  />
                  <label
                    htmlFor='rememberMe'
                    className='ml-2 block text-sm text-gray-400 cursor-pointer'
                  >
                    {t('login.rememberMe')}
                  </label>
                </div>
                <Link
                  href='/forgot-password'
                  className='text-sm text-orange-400 hover:text-orange-300 transition-colors'
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>

              <button
                type='submit'
                disabled={loading || retryAfter > 0}
                className='w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
                aria-describedby={
                  loading
                    ? 'loading-description'
                    : retryAfter > 0
                      ? 'retry-description'
                      : undefined
                }
              >
                {loading ? (
                  <>
                    <div
                      className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'
                      aria-hidden='true'
                    ></div>
                    <span id='loading-description'>{t('login.signingIn')}</span>
                  </>
                ) : retryAfter > 0 ? (
                  <>
                    <span id='retry-description'>
                      {t('login.waitTime', { seconds: retryAfter })}
                    </span>
                  </>
                ) : (
                  t('login.signIn')
                )}
              </button>
            </form>

            {/* Divider */}
            <div className='my-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-600'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-gray-800 text-gray-400'>
                    {t('login.orContinueWith')}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
            <SocialLoginButtons loading={loading || retryAfter > 0} />

            {/* Sign Up Link */}
            <div className='mt-6 text-center'>
              <p className='text-gray-400'>
                {t('login.noAccount')}{' '}
                <Link
                  href='/signup'
                  className='text-orange-400 hover:text-orange-300 font-medium transition-colors'
                >
                  {t('login.signUp')}
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
                {t('footer.privacy')}
              </Link>
              <span aria-hidden='true'>•</span>
              <Link
                href='/terms'
                className='hover:text-gray-400 transition-colors'
              >
                {t('footer.terms')}
              </Link>
              <span aria-hidden='true'>•</span>
              <Link
                href='/help'
                className='hover:text-gray-400 transition-colors'
              >
                {t('footer.help')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
