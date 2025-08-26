// Custom error classes for different types of errors
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly code?: string

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational: boolean = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational
    this.name = 'AppError'

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }

    Object.setPrototypeOf(this, AppError.prototype)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      code: this.code,
      stack: this.stack,
    }
  }
}

export class ValidationError extends AppError {
  public readonly field?: string
  public readonly value?: any

  constructor(
    message: string,
    field?: string,
    value?: any,
    statusCode: number = 400
  ) {
    super(message, statusCode, 'VALIDATION_ERROR')
    this.field = field
    this.value = value
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      value: this.value,
    }
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR')
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR')
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR')
    this.name = 'RateLimitError'
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR')
    this.name = 'DatabaseError'
    Object.setPrototypeOf(this, DatabaseError.prototype)
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(
      message || `External service (${service}) is unavailable`,
      502,
      'EXTERNAL_SERVICE_ERROR'
    )
    this.name = 'ExternalServiceError'
    Object.setPrototypeOf(this, ExternalServiceError.prototype)
  }
}

// Error response interface
export interface ErrorResponse {
  ok: false
  data: null
  error: {
    message: string
    code?: string
    field?: string
    statusCode: number
    timestamp: string
    path?: string
  }
}

// Success response interface
export interface SuccessResponse<T = any> {
  ok: true
  data: T
  error: null
}

// API response union type
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

// Error handler function type
export type ErrorHandler = (error: Error | AppError) => void

// Validation result interface
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}
