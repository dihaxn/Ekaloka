'use client';

import React, { ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorInfo {
  componentStack: string;
}

// Custom hook for error boundary functionality
function useErrorBoundary() {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
      setErrorInfo({
        componentStack: event.error?.stack || 'Unknown error location',
      });

      // Log error to console
      console.error(
        'ErrorBoundary caught an error:',
        event.error,
        event.error?.stack
      );

      // In production, you might want to log this to an error reporting service
      // logErrorToService(event.error, { componentStack: event.error?.stack })
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));
      setError(error);
      setErrorInfo({ componentStack: error.stack || 'Unknown error location' });

      console.error(
        'ErrorBoundary caught an unhandled rejection:',
        error,
        error.stack
      );
    };

    // Add global error handlers
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, []);

  const resetError = () => {
    setHasError(false);
    setError(null);
    setErrorInfo(null);
  };

  return { hasError, error, errorInfo, resetError };
}

// Functional Error Boundary Component
export function ErrorBoundary({ children, fallback, onError }: Props) {
  const { hasError, error, errorInfo, resetError } = useErrorBoundary();

  // Call custom error handler if provided
  useEffect(() => {
    if (hasError && error && onError) {
      onError(error, errorInfo || { componentStack: 'Unknown error location' });
    }
  }, [hasError, error, errorInfo, onError]);

  if (hasError) {
    // Custom fallback UI
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default error UI
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6'>
          <div className='flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full'>
            <svg
              className='w-6 h-6 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <div className='mt-4 text-center'>
            <h3 className='text-lg font-medium text-gray-900'>
              Something went wrong
            </h3>
            <p className='mt-2 text-sm text-gray-500'>
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && error && (
              <details className='mt-4 text-left'>
                <summary className='cursor-pointer text-sm font-medium text-gray-700'>
                  Error details (development only)
                </summary>
                <div className='mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto'>
                  <div className='mb-2'>
                    <strong>Error:</strong> {error.toString()}
                  </div>
                  {errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className='mt-1 whitespace-pre-wrap'>
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            <div className='mt-6 space-x-3'>
              <button
                onClick={resetError}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);

    // In production, you might want to log this to an error reporting service
    // logErrorToService(error, errorInfo)

    // You could also show a toast notification or update global error state
  };

  return { handleError };
}
