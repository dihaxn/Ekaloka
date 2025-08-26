import type { AppProps } from 'next/app'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { initializeErrorHandlers } from '../lib/errorHandler'
import { useEffect } from 'react'
import '../styles/globals.css'

// Initialize global error handlers
if (typeof window === 'undefined') {
  // Server-side initialization
  initializeErrorHandlers()
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Client-side initialization
    initializeErrorHandlers()
  }, [])

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
