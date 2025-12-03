'use client';
import { createContext, useCallback, useContext, useState } from 'react';

import { useConfig } from '../hooks/useConfig';

const CsrfContext = createContext();

export const useCsrf = () => {
  const context = useContext(CsrfContext);
  if (!context) {
    throw new Error('useCsrf must be used within a CsrfProvider');
  }
  return context;
};

export const CsrfProvider = ({ children }) => {
  const { apiUrl } = useConfig();
  const [csrfToken, setCsrfToken] = useState('');
  const [csrfTokenFetched, setCsrfTokenFetched] = useState(false);

  // Fetch CSRF token with error handling and return the token directly
  const fetchCsrfToken = useCallback(async () => {
    try {
      if (!apiUrl) return null;

      const response = await fetch(`${apiUrl}/api/auth/csrf-token`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        setCsrfToken(token);
        setCsrfTokenFetched(true);
        return token;
      }
    } catch (error) {
      console.warn('CSRF token fetch failed:', error);
    }
    return null;
  }, [apiUrl]);

  // Refresh CSRF token on 403 errors and return the new token
  const handleCsrfError = useCallback(async () => {
    console.log('CSRF token expired, refreshing...');
    const newToken = await fetchCsrfToken();
    return newToken; // Return the actual token, not just a boolean
  }, [fetchCsrfToken]);

  // Lazy fetch CSRF token - only fetch if not already fetched
  const getCsrfToken = useCallback(async () => {
    if (!csrfTokenFetched) {
      return await fetchCsrfToken();
    }
    return csrfToken;
  }, [csrfToken, csrfTokenFetched, fetchCsrfToken]);

  const value = {
    csrfToken,
    csrfTokenFetched,
    fetchCsrfToken,
    handleCsrfError,
    getCsrfToken,
  };

  return <CsrfContext.Provider value={value}>{children}</CsrfContext.Provider>;
};

export { CsrfContext };
