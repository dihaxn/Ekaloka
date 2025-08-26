import { NextApiRequest, NextApiResponse } from 'next'
import { SECURITY_HEADERS, RateLimitSecurity, SecurityAudit, InputSecurity } from '../lib/security'

// Security middleware composition
export function withSecurity(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Apply security headers
      applySecurityHeaders(res)
      
      // Rate limiting
      const clientId = getClientIdentifier(req)
      if (RateLimitSecurity.checkRateLimit(clientId)) {
        SecurityAudit.logSuspiciousActivity('rate_limit_exceeded', {
          clientId,
          ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
          endpoint: req.url
        })
        return res.status(429).json({ error: 'Too many requests' })
      }
      
      // Input sanitization
      sanitizeRequestInput(req)
      
      // Continue to handler
      await handler(req, res)
      
    } catch (error) {
      SecurityAudit.logSecurityViolation('middleware_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: req.url,
        method: req.method
      })
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

// Apply security headers
function applySecurityHeaders(res: NextApiResponse): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value)
  })
}

// Get client identifier for rate limiting
function getClientIdentifier(req: NextApiRequest): string {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  const userAgent = req.headers['user-agent'] || 'unknown'
  return `${ip}-${userAgent}`
}

// Sanitize request input
function sanitizeRequestInput(req: NextApiRequest): void {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = InputSecurity.sanitizeHTML(req.body[key])
      }
    })
  }
  
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = InputSecurity.sanitizeHTML(req.query[key] as string)
      }
    })
  }
}

// CORS configuration
export const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}

// Authentication middleware
export function withAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>, options: { roles?: string[] } = {}) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        SecurityAudit.logSecurityViolation('missing_auth_token', {
          endpoint: req.url,
          method: req.method,
          ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        })
        return res.status(401).json({ error: 'Authentication required' })
      }
      
      // Verify token and check roles
      // Implementation depends on your JWT setup
      
      await handler(req, res)
      
    } catch (error) {
      SecurityAudit.logSecurityViolation('auth_middleware_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: req.url
      })
      res.status(401).json({ error: 'Authentication failed' })
    }
  }
}
