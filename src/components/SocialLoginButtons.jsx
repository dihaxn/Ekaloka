'use client'
import { useState, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

/**
 * Social Login Buttons Component
 * 
 * NOTE: This is a frontend-only implementation.
 * Backend OAuth routes need to be implemented for full functionality.
 * 
 * TODO: When implementing backend OAuth:
 * 1. Create /api/auth/google and /api/auth/facebook endpoints
 * 2. Implement OAuth callback handling
 * 3. Add CSRF state verification
 * 4. Handle user authentication and session management
 */
const SocialLoginButtons = () => {
    const [loading, setLoading] = useState(false);
    const [submittingProvider, setSubmittingProvider] = useState(null);

    const handleSocialLogin = useCallback(async (provider) => {
        if (submittingProvider) return;
        
        try {
            setSubmittingProvider(provider);
            
            // Generate cryptographically secure CSRF state
            const state = generateCSRFState();
            
            // Store state in localStorage for CSRF protection
            localStorage.setItem('oauth_state', state);
            
            // Store additional metadata for enhanced security
            const stateData = {
                state,
                provider,
                timestamp: Date.now(),
                nonce: Math.random().toString(36).substring(2, 15)
            };
            localStorage.setItem('oauth_state_data', JSON.stringify(stateData));
            
            // Redirect to our OAuth endpoint
            const oauthUrl = `/api/auth/${provider.toLowerCase()}?state=${encodeURIComponent(state)}`;
            window.location.href = oauthUrl;
            
        } catch (error) {
            console.error(`${provider} login error:`, error);
            toast.error('Something went wrong. Please try again.');
            setSubmittingProvider(null);
        }
    }, [submittingProvider]);

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

    const isDisabled = loading || submittingProvider;

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isDisabled}
                    className={`flex w-full items-center justify-center gap-2 rounded-md border border-gray-600 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                        submittingProvider === 'Google' ? 'bg-gray-100' : ''
                    }`}
                >
                    {submittingProvider === 'Google' ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : (
                        <FcGoogle className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Google</span>
                </button>

                <button
                    onClick={() => handleSocialLogin('Facebook')}
                    disabled={isDisabled}
                    className={`flex w-full items-center justify-center gap-2 rounded-md border border-gray-600 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                        submittingProvider === 'Facebook' ? 'bg-gray-100' : ''
                    }`}
                >
                    {submittingProvider === 'Facebook' ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : (
                        <FaFacebook className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="hidden sm:inline">Facebook</span>
                </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
                Social login coming soon! Please use email/password for now.
            </p>
        </div>
    );
};

export default SocialLoginButtons;
