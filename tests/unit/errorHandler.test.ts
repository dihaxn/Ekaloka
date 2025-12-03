import {
  handleApiError,
  sendErrorResponse,
  sendSuccessResponse,
  isOperationalError,
  setGlobalLogger,
  getGlobalLogger,
  consoleLogger,
  setupUnhandledRejectionHandler,
  setupUncaughtExceptionHandler,
  initializeErrorHandlers
} from '../../src/lib/errorHandler'
import {
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError
} from '../../src/types/errors'
import { NextApiResponse } from 'next'

// Mock NextApiResponse
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  setHeader: jest.fn().mockReturnThis()
} as unknown as NextApiResponse

// Mock request object
const mockRequest = {
  url: '/api/test',
  method: 'POST',
  headers: { 'user-agent': 'test-agent' },
  ip: '127.0.0.1'
}

describe('Error Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset global logger to console logger
    setGlobalLogger(consoleLogger)
  })

  describe('isOperationalError', () => {
    it('should return true for operational AppError', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR', true)
      expect(isOperationalError(error)).toBe(true)
    })

    it('should return false for non-operational AppError', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR', false)
      expect(isOperationalError(error)).toBe(false)
    })

    it('should return false for regular Error', () => {
      const error = new Error('Test error')
      expect(isOperationalError(error)).toBe(false)
    })
  })

  describe('handleApiError', () => {
    it('should handle AppError correctly', () => {
      const error = new ValidationError('Invalid input', 'field', 'value')
      const result = handleApiError(error, mockRequest)

      expect(result.ok).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error.message).toBe('Invalid input')
      expect(result.error.code).toBe('VALIDATION_ERROR')
      expect(result.error.statusCode).toBe(400)
      expect(result.error.field).toBe('field')
      expect(result.error.path).toBe('/api/test')
    })

    it('should convert ValidationError to AppError', () => {
      const error = new Error('Validation failed')
      error.name = 'ValidationError'
      
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.code).toBe('VALIDATION_ERROR')
      expect(result.error.statusCode).toBe(400)
    })

    it('should convert JWT errors to AuthenticationError', () => {
      const error = new Error('Invalid token')
      error.name = 'JsonWebTokenError'
      
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.code).toBe('AUTHENTICATION_ERROR')
      expect(result.error.statusCode).toBe(401)
    })

    it('should convert expired token errors to AuthenticationError', () => {
      const error = new Error('Token expired')
      error.name = 'TokenExpiredError'
      
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.code).toBe('AUTHENTICATION_ERROR')
      expect(result.error.statusCode).toBe(401)
    })

    it('should handle Prisma P2002 error as ConflictError', () => {
      const error = new Error('Unique constraint failed')
      error.name = 'PrismaClientKnownRequestError'
      ;(error as any).code = 'P2002'
      
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.code).toBe('CONFLICT_ERROR')
      expect(result.error.statusCode).toBe(409)
    })

    it('should handle Prisma P2025 error as NotFoundError', () => {
      const error = new Error('Record not found')
      error.name = 'PrismaClientKnownRequestError'
      ;(error as any).code = 'P2025'
      
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.code).toBe('NOT_FOUND_ERROR')
      expect(result.error.statusCode).toBe(404)
    })

    it('should handle other Prisma errors as DatabaseError', () => {
      const error = new Error('Database connection failed')
      error.name = 'PrismaClientKnownRequestError'
      ;(error as any).code = 'P1001'
      
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.code).toBe('DATABASE_ERROR')
      expect(result.error.statusCode).toBe(500)
    })

    it('should handle generic errors as internal server errors', () => {
      const error = new Error('Unknown error')
      
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.code).toBe('INTERNAL_ERROR')
      expect(result.error.statusCode).toBe(500)
    })

    it('should include request context in error response', () => {
      const error = new AppError('Test error')
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.path).toBe('/api/test')
      expect(result.error.timestamp).toBeDefined()
    })

    it('should handle errors without request context', () => {
      const error = new AppError('Test error')
      const result = handleApiError(error)
      
      expect(result.error.path).toBeUndefined()
      expect(result.error.timestamp).toBeDefined()
    })
  })

  describe('sendErrorResponse', () => {
    it('should send error response with correct status and data', () => {
      const error = new ValidationError('Invalid input', 'field', 'value')
      
      sendErrorResponse(mockResponse, error, mockRequest)
      
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          data: null,
          error: expect.objectContaining({
            message: 'Invalid input',
            statusCode: 400
          })
        })
      )
    })

    it('should handle errors without request context', () => {
      const error = new AppError('Test error')
      
      sendErrorResponse(mockResponse, error)
      
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalled()
    })
  })

  describe('sendSuccessResponse', () => {
    it('should send success response with default status code', () => {
      const data = { message: 'Success' }
      
      sendSuccessResponse(mockResponse, data)
      
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: true,
        data: { message: 'Success' },
        error: null
      })
    })

    it('should send success response with custom status code', () => {
      const data = { message: 'Created' }
      
      sendSuccessResponse(mockResponse, data, 201)
      
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith({
        ok: true,
        data: { message: 'Created' },
        error: null
      })
    })
  })

  describe('Logger Management', () => {
    it('should set and get global logger', () => {
      const customLogger = {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn()
      }
      
      setGlobalLogger(customLogger)
      const retrievedLogger = getGlobalLogger()
      
      expect(retrievedLogger).toBe(customLogger)
    })

    it('should use custom logger for error handling', () => {
      const customLogger = {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn()
      }
      
      setGlobalLogger(customLogger)
      
      const error = new AppError('Test error')
      handleApiError(error, mockRequest)
      
      expect(customLogger.error).toHaveBeenCalledWith(
        'API Error occurred',
        error,
        expect.objectContaining({
          statusCode: 500,
          path: '/api/test'
        })
      )
    })
  })

  describe('Global Error Handlers', () => {
    let originalProcess: any

    beforeEach(() => {
      originalProcess = { ...process }
      process.on = jest.fn()
    })

    afterEach(() => {
      process = originalProcess
    })

    it('should setup unhandled rejection handler', () => {
      setupUnhandledRejectionHandler()
      
      expect(process.on).toHaveBeenCalledWith('unhandledRejection', expect.any(Function))
    })

    it('should setup uncaught exception handler', () => {
      setupUncaughtExceptionHandler()
      
      expect(process.on).toHaveBeenCalledWith('uncaughtException', expect.any(Function))
    })

    it('should initialize all error handlers', () => {
      initializeErrorHandlers()
      
      expect(process.on).toHaveBeenCalledWith('unhandledRejection', expect.any(Function))
      expect(process.on).toHaveBeenCalledWith('uncaughtException', expect.any(Function))
    })

    it('should use custom logger for global handlers', () => {
      const customLogger = {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn()
      }
      
      setupUnhandledRejectionHandler(customLogger)
      
      expect(process.on).toHaveBeenCalledWith('unhandledRejection', expect.any(Function))
    })
  })

  describe('Error Response Structure', () => {
    it('should include all required error response fields', () => {
      const error = new ValidationError('Test error', 'field', 'value')
      const result = handleApiError(error, mockRequest)
      
      expect(result).toHaveProperty('ok', false)
      expect(result).toHaveProperty('data', null)
      expect(result).toHaveProperty('error')
      expect(result.error).toHaveProperty('message')
      expect(result.error).toHaveProperty('code')
      expect(result.error).toHaveProperty('statusCode')
      expect(result.error).toHaveProperty('timestamp')
      expect(result.error).toHaveProperty('path')
    })

    it('should include field information for ValidationError', () => {
      const error = new ValidationError('Invalid email', 'email', 'test')
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.field).toBe('email')
      expect((result.error as any).value).toBe('test')
    })

    it('should not include field information for non-ValidationError', () => {
      const error = new AuthenticationError('Invalid token')
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.field).toBeUndefined()
      expect((result.error as any).value).toBeUndefined()
    })
  })

  describe('Production vs Development Error Handling', () => {
    const originalEnv = process.env.NODE_ENV

    afterEach(() => {
      (process.env as any).NODE_ENV = originalEnv
    })

    it('should show generic message in production for unknown errors', () => {
      (process.env as any).NODE_ENV = 'production'
      
      const error = new Error('Sensitive error message')
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.message).toBe('Internal server error')
    })

    it('should show actual error message in development', () => {
      (process.env as any).NODE_ENV = 'development'
      
      const error = new Error('Sensitive error message')
      const result = handleApiError(error, mockRequest)
      
      expect(result.error.message).toBe('Sensitive error message')
    })
  })
})
