import { ValidationError, ValidationResult } from '../types/errors'

// Common validation functions
export const validators = {
  required: (value: any, fieldName: string): ValidationError | null => {
    if (value === null || value === undefined || value === '') {
      return new ValidationError(
        `${fieldName} is required`,
        fieldName,
        value
      )
    }
    return null
  },

  email: (value: string, fieldName: string): ValidationError | null => {
    if (!value) return null // Skip if empty
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return new ValidationError(
        `${fieldName} must be a valid email address`,
        fieldName,
        value
      )
    }
    return null
  },

  minLength: (minLength: number, fieldName: string) => (value: string): ValidationError | null => {
    if (!value) return null // Skip if empty
    
    if (value.length < minLength) {
      return new ValidationError(
        `${fieldName} must be at least ${minLength} characters long`,
        fieldName,
        value
      )
    }
    return null
  },

  maxLength: (maxLength: number, fieldName: string) => (value: string | undefined): ValidationError | null => {
    if (!value) return null // Skip if empty
    
    if (value.length > maxLength) {
      return new ValidationError(
        `${fieldName} must be no more than ${maxLength} characters long`,
        fieldName,
        value
      )
    }
    return null
  },

  minValue: (minValue: number, fieldName: string) => (value: number): ValidationError | null => {
    if (value === null || value === undefined) return null
    
    if (value < minValue) {
      return new ValidationError(
        `${fieldName} must be at least ${minValue}`,
        fieldName,
        value
      )
    }
    return null
  },

  maxValue: (maxValue: number, fieldName: string) => (value: number): ValidationError | null => {
    if (value === null || value === undefined) return null
    
    if (value > maxValue) {
      return new ValidationError(
        `${fieldName} must be no more than ${maxValue}`,
        fieldName,
        value
      )
    }
    return null
  },

  positive: (fieldName: string) => (value: number): ValidationError | null => {
    if (value === null || value === undefined) return null
    
    if (value <= 0) {
      return new ValidationError(
        `${fieldName} must be a positive number`,
        fieldName,
        value
      )
    }
    return null
  },

  url: (fieldName: string) => (value: string): ValidationError | null => {
    if (!value) return null // Skip if empty
    
    try {
      new URL(value)
    } catch {
      return new ValidationError(
        `${fieldName} must be a valid URL`,
        fieldName,
        value
      )
    }
    return null
  },

  enum: (allowedValues: any[], fieldName: string) => (value: any): ValidationError | null => {
    if (!allowedValues.includes(value)) {
      return new ValidationError(
        `${fieldName} must be one of: ${allowedValues.join(', ')}`,
        fieldName,
        value
      )
    }
    return null
  }
}

// Validation schema type
export type ValidationSchema<T> = {
  [K in keyof T]?: Array<(value: T[K], fieldName: string) => ValidationError | null>
}

// Validate an object against a schema
export function validateObject<T extends Record<string, any>>(
  data: T,
  schema: ValidationSchema<T>
): ValidationResult {
  const errors: ValidationError[] = []

  for (const [field, validators] of Object.entries(schema)) {
    if (validators) {
      for (const validator of validators) {
        const error = validator(data[field], field)
        if (error) {
          errors.push(error)
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate login credentials
export function validateLoginCredentials(data: { email: string; password: string }): ValidationResult {
  const schema: ValidationSchema<typeof data> = {
    email: [validators.required, validators.email],
    password: [validators.required, validators.minLength(6, 'password')]
  }

  return validateObject(data, schema)
}

// Validate registration data
export function validateRegistrationData(data: {
  email: string
  password: string
  name: string
}): ValidationResult {
  const schema: ValidationSchema<typeof data> = {
    email: [validators.required, validators.email],
    password: [validators.required, validators.minLength(8, 'password')],
    name: [validators.required, validators.minLength(2, 'name'), validators.maxLength(50, 'name')]
  }

  return validateObject(data, schema)
}

// Validate product data
export function validateProductData(data: {
  name: string
  price: number
  description?: string
}): ValidationResult {
  const schema: ValidationSchema<typeof data> = {
    name: [validators.required, validators.minLength(2, 'name'), validators.maxLength(100, 'name')],
    price: [validators.required, validators.positive('price'), validators.maxValue(999999.99, 'price')],
    description: [validators.maxLength(1000, 'description')]
  }

  return validateObject(data, schema)
}

// Validate pagination parameters
export function validatePaginationParams(data: {
  page?: string | number
  limit?: string | number
}): ValidationResult {
  const errors: ValidationError[] = []
  
  if (data.page !== undefined) {
    const page = typeof data.page === 'string' ? parseInt(data.page, 10) : data.page
    if (isNaN(page) || page < 1) {
      errors.push(new ValidationError('Page must be a positive number', 'page', data.page))
    }
  }
  
  if (data.limit !== undefined) {
    const limit = typeof data.limit === 'string' ? parseInt(data.limit, 10) : data.limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push(new ValidationError('Limit must be between 1 and 100', 'limit', data.limit))
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
