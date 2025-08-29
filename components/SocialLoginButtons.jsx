'use client'
import { useState, useEffect, useCallback } from 'react';

/**
 * Generate cryptographically random CSRF state for OAuth
 * @returns {string} Random state string
 */
const generateCSRFState = () => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        // Use cryptographically secure random values when available
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
        // Fallback to Math.random for older browsers
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
};

const SocialLoginButtons = ({ loading = false }) => {
    const [submittingProvider, setSubmittingProvider] = useState(null);

    // Check API URL configuration
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error('NEXT_PUBLIC_API_URL is not configured');
        }
    }, []);

    // Generate cryptographically secure CSRF state
    const generateCSRFState = useCallback(() => {
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            // Use cryptographically secure random values
            const array = new Uint8Array(16);
            crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        } else {
            // Fallback to Math.random (less secure but better than nothing)
            return Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
        }
    }, []);

    const handleSocialLogin = useCallback(async (provider) => {
        if (submittingProvider) return; // Prevent multiple clicks
        
        try {
            setSubmittingProvider(provider);
            
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                setSubmittingProvider(null);
                console.error('API URL not configured');
                return;
            }

            // Generate and store CSRF state
            const state = generateCSRFState();
            localStorage.setItem('oauth_state', state);
            
            // Store additional metadata for enhanced security
            const stateData = {
                state,
                provider,
                timestamp: Date.now(),
                nonce: Math.random().toString(36).substring(2, 15)
            };
            localStorage.setItem('oauth_state_data', JSON.stringify(stateData));

            // Redirect to OAuth endpoint with state parameter
            const redirectUrl = `${apiUrl}/api/auth/${provider.toLowerCase()}?state=${encodeURIComponent(state)}`;
            window.location.href = redirectUrl;
            
        } catch (error) {
            console.error(`${provider} login error:`, error);
            setSubmittingProvider(null);
        }
    }, [submittingProvider, generateCSRFState]);

    const isDisabled = loading || submittingProvider;

    return (
        <div className="space-y-3">
            <button
                onClick={() => handleSocialLogin('google')}
                disabled={isDisabled}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submittingProvider === 'google' ? (
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                )}
                {submittingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
            </button>

            <button
                onClick={() => handleSocialLogin('facebook')}
                disabled={isDisabled}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submittingProvider === 'facebook' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                )}
                {submittingProvider === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
            </button>
        </div>
    );
};

export default SocialLoginButtons;
