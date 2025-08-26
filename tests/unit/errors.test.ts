import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError
} from '../../src/types/errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create AppError with default values', () => {
      const error = new AppError('Test error')
      
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.isOperational).toBe(true)
      expect(error.code).toBeUndefined()
      expect(error instanceof Error).toBe(true)
      expect(error instanceof AppError).toBe(true)
    })

    it('should create AppError with custom values', () => {
      const error = new AppError('Custom error', 400, 'CUSTOM_ERROR', false)
      
      expect(error.message).toBe('Custom error')
      expect(error.statusCode).toBe(400)
      expect(error.isOperational).toBe(false)
      expect(error.code).toBe('CUSTOM_ERROR')
    })

    it('should maintain proper prototype chain', () => {
      const error = new AppError('Test error')
      
      expect(Object.getPrototypeOf(error)).toBe(AppError.prototype)
      expect(error.constructor).toBe(AppError)
    })
  })

  describe('ValidationError', () => {
    it('should create ValidationError with default values', () => {
      const error = new ValidationError('Invalid input')
      
      expect(error.message).toBe('Invalid input')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.field).toBeUndefined()
      expect(error.value).toBeUndefined()
      expect(error instanceof AppError).toBe(true)
    })

    it('should create ValidationError with field and value', () => {
      const error = new ValidationError('Email is invalid', 'email', 'invalid-email')
      
      expect(error.message).toBe('Email is invalid')
      expect(error.field).toBe('email')
      expect(error.value).toBe('invalid-email')
      expect(error.statusCode).toBe(400)
    })

    it('should create ValidationError with custom status code', () => {
      const error = new ValidationError('Invalid input', 'field', 'value', 422)
      
      expect(error.statusCode).toBe(422)
    })
  })

  describe('AuthenticationError', () => {
    it('should create AuthenticationError with default message', () => {
      const error = new AuthenticationError()
      
      expect(error.message).toBe('Authentication failed')
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('AUTHENTICATION_ERROR')
    })

    it('should create AuthenticationError with custom message', () => {
      const error = new AuthenticationError('Invalid token')
      
      expect(error.message).toBe('Invalid token')
      expect(error.statusCode).toBe(401)
    })
  })

  describe('AuthorizationError', () => {
    it('should create AuthorizationError with default message', () => {
      const error = new AuthorizationError()
      
      expect(error.message).toBe('Access denied')
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('AUTHORIZATION_ERROR')
    })

    it('should create AuthorizationError with custom message', () => {
      const error = new AuthorizationError('Insufficient permissions')
      
      expect(error.message).toBe('Insufficient permissions')
      expect(error.statusCode).toBe(403)
    })
  })

  describe('NotFoundError', () => {
    it('should create NotFoundError with default message', () => {
      const error = new NotFoundError()
      
      expect(error.message).toBe('Resource not found')
      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND_ERROR')
    })

    it('should create NotFoundError with custom resource', () => {
      const error = new NotFoundError('User')
      
      expect(error.message).toBe('User not found')
      expect(error.statusCode).toBe(404)
    })
  })

  describe('ConflictError', () => {
    it('should create ConflictError with default message', () => {
      const error = new ConflictError()
      
      expect(error.message).toBe('Resource conflict')
      expect(error.statusCode).toBe(409)
      expect(error.code).toBe('CONFLICT_ERROR')
    })

    it('should create ConflictError with custom message', () => {
      const error = new ConflictError('Email already exists')
      
      expect(error.message).toBe('Email already exists')
      expect(error.statusCode).toBe(409)
    })
  })

  describe('RateLimitError', () => {
    it('should create RateLimitError with default message', () => {
      const error = new RateLimitError()
      
      expect(error.message).toBe('Too many requests')
      expect(error.statusCode).toBe(429)
      expect(error.code).toBe('RATE_LIMIT_ERROR')
    })

    it('should create RateLimitError with custom message', () => {
      const error = new RateLimitError('Rate limit exceeded')
      
      expect(error.message).toBe('Rate limit exceeded')
      expect(error.statusCode).toBe(429)
    })
  })

  describe('DatabaseError', () => {
    it('should create DatabaseError with default message', () => {
      const error = new DatabaseError()
      
      expect(error.message).toBe('Database operation failed')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('DATABASE_ERROR')
    })

    it('should create DatabaseError with custom message', () => {
      const error = new DatabaseError('Connection timeout')
      
      expect(error.message).toBe('Connection timeout')
      expect(error.statusCode).toBe(500)
    })
  })

  describe('ExternalServiceError', () => {
    it('should create ExternalServiceError with service name', () => {
      const error = new ExternalServiceError('Payment Gateway')
      
      expect(error.message).toBe('External service (Payment Gateway) is unavailable')
      expect(error.statusCode).toBe(502)
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR')
    })

    it('should create ExternalServiceError with custom message', () => {
      const error = new ExternalServiceError('Payment Gateway', 'Service timeout')
      
      expect(error.message).toBe('Service timeout')
      expect(error.statusCode).toBe(502)
    })
  })

  describe('Error inheritance', () => {
    it('should maintain proper inheritance chain', () => {
      const validationError = new ValidationError('Test')
      const authError = new AuthenticationError('Test')
      const notFoundError = new NotFoundError('Test')
      
      expect(validationError instanceof AppError).toBe(true)
      expect(validationError instanceof Error).toBe(true)
      
      expect(authError instanceof AppError).toBe(true)
      expect(authError instanceof Error).toBe(true)
      
      expect(notFoundError instanceof AppError).toBe(true)
      expect(notFoundError instanceof Error).toBe(true)
    })

    it('should have correct error names', () => {
      expect(new ValidationError('Test').name).toBe('ValidationError')
      expect(new AuthenticationError('Test').name).toBe('AuthenticationError')
      expect(new AuthorizationError('Test').name).toBe('AuthorizationError')
      expect(new NotFoundError('Test').name).toBe('NotFoundError')
      expect(new ConflictError('Test').name).toBe('ConflictError')
      expect(new RateLimitError('Test').name).toBe('RateLimitError')
      expect(new DatabaseError('Test').name).toBe('DatabaseError')
      expect(new ExternalServiceError('Test').name).toBe('ExternalServiceError')
    })
  })

  describe('Error serialization', () => {
    it('should serialize to JSON correctly', () => {
      const error = new ValidationError('Invalid email', 'email', 'test')
      const serialized = JSON.stringify(error)
      const parsed = JSON.parse(serialized)
      
      expect(parsed.message).toBe('Invalid email')
      expect(parsed.statusCode).toBe(400)
      expect(parsed.code).toBe('VALIDATION_ERROR')
      expect(parsed.field).toBe('email')
      expect(parsed.value).toBe('test')
    })

    it('should include stack trace in development', () => {
      const error = new AppError('Test error')
      
      expect(error.stack).toBeDefined()
      expect(typeof error.stack).toBe('string')
    })
  })
})
