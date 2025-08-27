import { NextApiRequest, NextApiResponse } from 'next'
import { handleApiError, sendErrorResponse } from '../lib/errorHandler'

// Error handler middleware for API routes
export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (error) {
      // Handle the error and send appropriate response
      sendErrorResponse(res, error as Error, req)
    }
  }
}

// Rate limiting middleware
export function withRateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: {
    windowMs: number
    max: number
    message?: string
  } = { windowMs: 15 * 60 * 1000, max: 100 } // 15 minutes, 100 requests
) {
  const { windowMs, max, message } = options
  
  // Simple in-memory store (in production, use Redis or similar)
  const store = new Map<string, { count: number; resetTime: number }>()
  
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = (req as any).ip || (req as any).connection?.remoteAddress || 'unknown'
    const now = Date.now()
    
    // Get current rate limit info for this IP
    const current = store.get(ip)
    
    if (current && now < current.resetTime) {
      // Still within the window
      if (current.count >= max) {
        // Rate limit exceeded
        res.setHeader('Retry-After', Math.ceil(windowMs / 1000))
        res.setHeader('X-RateLimit-Limit', max)
        res.setHeader('X-RateLimit-Remaining', 0)
        res.setHeader('X-RateLimit-Reset', new Date(current.resetTime).toISOString())
        
        const errorResponse = handleApiError(
          new Error(message || `Rate limit exceeded. Try again in ${Math.ceil(windowMs / 1000)} seconds.`),
          req
        )
        return res.status(429).json(errorResponse)
      }
      
      // Increment count
      current.count++
    } else {
      // New window or expired window
      store.set(ip, {
        count: 1,
        resetTime: now + windowMs
      })
    }
    
    // Set remaining count header
    const currentInfo = store.get(ip)!
    res.setHeader('X-RateLimit-Limit', max)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - currentInfo.count))
    res.setHeader('X-RateLimit-Reset', new Date(currentInfo.resetTime).toISOString())
    
    try {
      await handler(req, res)
    } catch (error) {
      sendErrorResponse(res, error as Error, req)
    }
  }
}

// Authentication middleware
export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: {
    required?: boolean
    roles?: string[]
  } = {}
) {
  const { required = true, roles = [] } = options
  
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Extract token from headers or cookies
      const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.accessToken
      
      if (required && !token) {
        return sendErrorResponse(
          res, 
          new Error('Authentication required'), 
          req
        )
      }
      
      if (token) {
        try {
          // Verify token (you'll need to implement this based on your JWT setup)
          // const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
          
          // Check roles if specified
          if (roles.length > 0) {
            // const userRole = decoded.role
            // if (!roles.includes(userRole)) {
            //   return sendErrorResponse(
            //     res, 
            //     new Error('Insufficient permissions'), 
            //     req
            //   )
            // }
          }
          
          // Add user info to request
          // req.user = decoded
        } catch (error) {
          if (required) {
            return sendErrorResponse(
              res, 
              new Error('Invalid or expired token'), 
              req
            )
          }
        }
      }
      
      await handler(req, res)
    } catch (error) {
      sendErrorResponse(res, error as Error, req)
    }
  }
}

// Validation middleware
export function withValidation<T>(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  validator: (data: any) => { isValid: boolean; errors: any[] }
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Validate request body
      const validation = validator(req.body)
      if (!validation.isValid) {
        const firstError = validation.errors[0]
        return sendErrorResponse(
          res, 
          new Error(firstError.message || 'Validation failed'), 
          req
        )
      }
      
      await handler(req, res)
    } catch (error) {
      sendErrorResponse(res, error as Error, req)
    }
  }
}

// CORS middleware
export function withCORS(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: {
    origin?: string | string[]
    methods?: string[]
    credentials?: boolean
  } = {}
) {
  const { 
    origin = process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials = true
  } = options
  
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', Array.isArray(origin) ? origin[0] : origin)
      res.setHeader('Access-Control-Allow-Methods', methods.join(', '))
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      res.setHeader('Access-Control-Allow-Credentials', credentials.toString())
      res.setHeader('Access-Control-Max-Age', '86400') // 24 hours
      return res.status(200).end()
    }
    
    // Set CORS headers for actual requests
    res.setHeader('Access-Control-Allow-Origin', Array.isArray(origin) ? origin[0] : origin)
    res.setHeader('Access-Control-Allow-Credentials', credentials.toString())
    
    try {
      await handler(req, res)
    } catch (error) {
      sendErrorResponse(res, error as Error, req)
    }
  }
}

// Combine multiple middleware functions
export function composeMiddleware(...middlewares: Array<(handler: any) => any>) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}
