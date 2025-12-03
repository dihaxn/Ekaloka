/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration
  images: {
    domains: ['localhost', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
          },
          // Temporarily disabled CSP to fix CSS loading issues
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes'; style-src 'self' 'unsafe-inline' 'unsafe-hashes'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' ws: wss:;"
          // },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ]
      }
    ]
  },
  
  // Security settings
  poweredByHeader: false,
  compress: true,
  
  // Server external packages for security
  serverExternalPackages: ['bcrypt'],

  // Ignore ESLint during builds (handled in separate CI job)
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
