import { NextApiResponse } from 'next'
import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  ErrorResponse,
  SuccessResponse
} from '../types/errors'

// Error logger interface
export interface ErrorLogger {
  error: (message: string, error?: Error, context?: Record<string, any>) => void
  warn: (message: string, context?: Record<string, any>) => void
  info: (message: string, context?: Record<string, any>) => void
}

// Default console logger
export const consoleLogger: ErrorLogger = {
  error: (message: string, error?: Error, context?: Record<string, any>) => {
    console.error(`[ERROR] ${message}`, {
      error: error?.message,
      stack: error?.stack,
      ...context
    })
  },
  warn: (message: string, context?: Record<string, any>) => {
    console.warn(`[WARN] ${message}`, context)
  },
  info: (message: string, context?: Record<string, any>) => {
    console.info(`[INFO] ${message}`, context)
  }
}

// Global error logger instance
let globalLogger: ErrorLogger = consoleLogger

// Set global logger
export function setGlobalLogger(logger: ErrorLogger) {
  globalLogger = logger
}

// Get global logger
export function getGlobalLogger(): ErrorLogger {
  return globalLogger
}

// Check if error is operational (expected) or programming error
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

// Handle and format errors for API responses
export function handleApiError(
  error: Error | AppError,
  req?: any,
  logger: ErrorLogger = globalLogger
): ErrorResponse {
  let appError: AppError

  // Convert to AppError if it's not already
  if (error instanceof AppError) {
    appError = error
  } else {
    // Handle common error types
    if (error.name === 'ValidationError') {
      appError = new ValidationError(error.message)
    } else if (error.name === 'JsonWebTokenError') {
      appError = new AuthenticationError('Invalid token')
    } else if (error.name === 'TokenExpiredError') {
      appError = new AuthenticationError('Token expired')
    } else if (error.name === 'PrismaClientKnownRequestError') {
      // Handle Prisma database errors
      const prismaError = error as any
      if (prismaError.code === 'P2002') {
        appError = new ConflictError('Resource already exists')
      } else if (prismaError.code === 'P2025') {
        appError = new NotFoundError('Resource not found')
      } else {
        appError = new DatabaseError(`Database error: ${prismaError.code}`)
      }
    } else {
      // Generic internal server error
      appError = new AppError(
        process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message,
        500,
        'INTERNAL_ERROR',
        false // Programming error
      )
    }
  }

  // Log the error
  logger.error('API Error occurred', error, {
    statusCode: appError.statusCode,
    code: appError.code,
    path: req?.url,
    method: req?.method,
    userAgent: req?.headers?.['user-agent'],
    ip: req?.ip || req?.connection?.remoteAddress
  })

  // Return formatted error response
  return {
    ok: false,
    data: null,
    error: {
      message: appError.message,
      code: appError.code,
      field: appError instanceof ValidationError ? appError.field : undefined,
      statusCode: appError.statusCode,
      timestamp: new Date().toISOString(),
      path: req?.url
    }
  }
}

// Send error response to Next.js API
export function sendErrorResponse(
  res: NextApiResponse,
  error: Error | AppError,
  req?: any
): void {
  const errorResponse = handleApiError(error, req)
  res.status(errorResponse.error.statusCode).json(errorResponse)
}

// Send success response to Next.js API
export function sendSuccessResponse<T>(
  res: NextApiResponse,
  data: T,
  statusCode: number = 200
): void {
  const successResponse: SuccessResponse<T> = {
    ok: true,
    data,
    error: null
  }
  res.status(statusCode).json(successResponse)
}

// Async error wrapper for API handlers
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  logger: ErrorLogger = globalLogger
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      logger.error('Unhandled error in API handler', error as Error)
      throw error
    }
  }
}

// Rate limiting error handler
export function handleRateLimitError(
  req: any,
  res: NextApiResponse,
  limit: number,
  windowMs: number
): void {
  const retryAfter = Math.ceil(windowMs / 1000)
  res.setHeader('Retry-After', retryAfter)
  res.setHeader('X-RateLimit-Limit', limit)
  res.setHeader('X-RateLimit-Remaining', 0)
  res.setHeader('X-RateLimit-Reset', new Date(Date.now() + windowMs).toISOString())
  
  const errorResponse = handleApiError(
    new RateLimitError(`Rate limit exceeded. Try again in ${retryAfter} seconds.`),
    req
  )
  res.status(429).json(errorResponse)
}

// Validation error handler
export function handleValidationErrors(
  errors: ValidationError[],
  req?: any
): ErrorResponse {
  // Use the first validation error for the response
  const firstError = errors[0]
  
  return {
    ok: false,
    data: null,
    error: {
      message: firstError.message,
      code: firstError.code,
      field: firstError.field,
      statusCode: firstError.statusCode,
      timestamp: new Date().toISOString(),
      path: req?.url
    }
  }
}

// Process unhandled rejections
export function setupUnhandledRejectionHandler(logger: ErrorLogger = globalLogger) {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', new Error('Unhandled Rejection'), {
      reason: reason?.message || reason,
      promise: promise.toString()
    })
    
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  })
}

// Process uncaught exceptions
export function setupUncaughtExceptionHandler(logger: ErrorLogger = globalLogger) {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error)
    
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  })
}

// Initialize global error handlers
export function initializeErrorHandlers(logger: ErrorLogger = globalLogger) {
  setupUnhandledRejectionHandler(logger)
  setupUncaughtExceptionHandler(logger)
}
