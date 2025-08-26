import {
  validators,
  validateObject,
  validateLoginCredentials,
  validateRegistrationData,
  validateProductData,
  validatePaginationParams
} from '../../src/lib/validation'
import { ValidationError } from '../../src/types/errors'

describe('Validation System', () => {
  describe('validators.required', () => {
    it('should return null for valid values', () => {
      expect(validators.required('test', 'field')).toBeNull()
      expect(validators.required(0, 'field')).toBeNull()
      expect(validators.required(false, 'field')).toBeNull()
    })

    it('should return ValidationError for null/undefined/empty values', () => {
      const error1 = validators.required(null, 'field')
      expect(error1).toBeInstanceOf(ValidationError)
      expect(error1?.message).toBe('field is required')

      const error2 = validators.required(undefined, 'field')
      expect(error2).toBeInstanceOf(ValidationError)
      expect(error2?.message).toBe('field is required')

      const error3 = validators.required('', 'field')
      expect(error3).toBeInstanceOf(ValidationError)
      expect(error3?.message).toBe('field is required')
    })
  })

  describe('validators.email', () => {
    it('should return null for valid email addresses', () => {
      expect(validators.email('test@example.com', 'email')).toBeNull()
      expect(validators.email('user.name+tag@domain.co.uk', 'email')).toBeNull()
      expect(validators.email('123@456.789', 'email')).toBeNull()
    })

    it('should return ValidationError for invalid email addresses', () => {
      const error1 = validators.email('invalid-email', 'email')
      expect(error1).toBeInstanceOf(ValidationError)
      expect(error1?.message).toBe('email must be a valid email address')

      const error2 = validators.email('test@', 'email')
      expect(error2).toBeInstanceOf(ValidationError)

      const error3 = validators.email('@example.com', 'email')
      expect(error3).toBeInstanceOf(ValidationError)
    })

    it('should return null for empty values (skip validation)', () => {
      expect(validators.email('', 'email')).toBeNull()
      expect(validators.email(null, 'email')).toBeNull()
    })
  })

  describe('validators.minLength', () => {
    it('should return null for strings with sufficient length', () => {
      const validator = validators.minLength(3, 'field')
      expect(validator('test')).toBeNull()
      
      const validator2 = validators.minLength(4, 'field')
      expect(validator2('test')).toBeNull()
    })

    it('should return ValidationError for strings that are too short', () => {
      const validator = validators.minLength(5, 'field')
      const error = validator('test')
      expect(error).toBeInstanceOf(ValidationError)
      expect(error?.message).toBe('field must be at least 5 characters long')
    })

    it('should return null for empty values (skip validation)', () => {
      const validator = validators.minLength(5, 'field')
      expect(validator('')).toBeNull()
      expect(validator(null)).toBeNull()
    })
  })

  describe('validators.maxLength', () => {
    it('should return null for strings within length limit', () => {
      const validator = validators.maxLength(5, 'field')
      expect(validator('test')).toBeNull()
      
      const validator2 = validators.maxLength(4, 'field')
      expect(validator2('test')).toBeNull()
    })

    it('should return ValidationError for strings that are too long', () => {
      const validator = validators.maxLength(3, 'field')
      const error = validator('test')
      expect(error).toBeInstanceOf(ValidationError)
      expect(error?.message).toBe('field must be no more than 3 characters long')
    })

    it('should return null for empty values (skip validation)', () => {
      const validator = validators.maxLength(5, 'field')
      expect(validator('')).toBeNull()
      expect(validator(null)).toBeNull()
    })
  })

  describe('validators.minValue', () => {
    it('should return null for numbers above minimum', () => {
      const validator = validators.minValue(3, 'field')
      expect(validator(5)).toBeNull()
      expect(validator(3)).toBeNull()
    })

    it('should return ValidationError for numbers below minimum', () => {
      const validator = validators.minValue(3, 'field')
      const error = validator(2)
      expect(error).toBeInstanceOf(ValidationError)
      expect(error?.message).toBe('field must be at least 3')
    })

    it('should return null for null/undefined values (skip validation)', () => {
      const validator = validators.minValue(3, 'field')
      expect(validator(null)).toBeNull()
      expect(validator(undefined)).toBeNull()
    })
  })

  describe('validators.maxValue', () => {
    it('should return null for numbers below maximum', () => {
      const validator = validators.maxValue(5, 'field')
      expect(validator(3)).toBeNull()
      expect(validator(5)).toBeNull()
    })

    it('should return ValidationError for numbers above maximum', () => {
      const validator = validators.maxValue(5, 'field')
      const error = validator(6)
      expect(error).toBeInstanceOf(ValidationError)
      expect(error?.message).toBe('field must be no more than 5')
    })

    it('should return null for null/undefined values (skip validation)', () => {
      const validator = validators.maxValue(5, 'field')
      expect(validator(null)).toBeNull()
      expect(validator(undefined)).toBeNull()
    })
  })

  describe('validators.positive', () => {
    it('should return null for positive numbers', () => {
      const validator = validators.positive('field')
      expect(validator(1)).toBeNull()
      expect(validator(0.1)).toBeNull()
    })

    it('should return ValidationError for non-positive numbers', () => {
      const validator = validators.positive('field')
      const error1 = validator(0)
      expect(error1).toBeInstanceOf(ValidationError)
      expect(error1?.message).toBe('field must be a positive number')

      const error2 = validator(-1)
      expect(error2).toBeInstanceOf(ValidationError)
      expect(error2?.message).toBe('field must be a positive number')
    })

    it('should return null for null/undefined values (skip validation)', () => {
      const validator = validators.positive('field')
      expect(validator(null)).toBeNull()
      expect(validator(undefined)).toBeNull()
    })
  })

  describe('validators.url', () => {
    it('should return null for valid URLs', () => {
      const validator = validators.url('field')
      expect(validator('https://example.com')).toBeNull()
      expect(validator('http://localhost:3000')).toBeNull()
      expect(validator('ftp://files.example.com')).toBeNull()
    })

    it('should return ValidationError for invalid URLs', () => {
      const validator = validators.url('field')
      const error1 = validator('not-a-url')
      expect(error1).toBeInstanceOf(ValidationError)
      expect(error1?.message).toBe('field must be a valid URL')

      const error2 = validator('http://')
      expect(error2).toBeInstanceOf(ValidationError)
    })

    it('should return null for empty values (skip validation)', () => {
      const validator = validators.url('field')
      expect(validator('')).toBeNull()
      expect(validator(null)).toBeNull()
    })
  })

  describe('validators.enum', () => {
    it('should return null for valid enum values', () => {
      const allowedValues = ['red', 'green', 'blue']
      const validator = validators.enum(allowedValues, 'field')
      expect(validator('red')).toBeNull()
      expect(validator('green')).toBeNull()
    })

    it('should return ValidationError for invalid enum values', () => {
      const allowedValues = ['red', 'green', 'blue']
      const validator = validators.enum(allowedValues, 'field')
      const error = validator('yellow')
      expect(error).toBeInstanceOf(ValidationError)
      expect(error?.message).toBe('field must be one of: red, green, blue')
    })
  })

  describe('validateObject', () => {
    it('should return valid result for valid data', () => {
      const data = { name: 'test', age: 25 }
      const schema = {
        name: [validators.required, validators.minLength(2, 'name')],
        age: [validators.required, validators.minValue(18, 'age')]
      }

      const result = validateObject(data, schema)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return invalid result with errors for invalid data', () => {
      const data = { name: '', age: 16 }
      const schema = {
        name: [validators.required, validators.minLength(2, 'name')],
        age: [validators.required, validators.minValue(18, 'age')]
      }

      const result = validateObject(data, schema)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
      expect(result.errors[0].field).toBe('name')
      expect(result.errors[1].field).toBe('age')
    })

    it('should handle missing fields gracefully', () => {
      const data = { name: 'test' }
      const schema = {
        name: [validators.required],
        age: [validators.required]
      }

      const result = validateObject(data, schema)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('age')
    })
  })

  describe('validateLoginCredentials', () => {
    it('should validate valid login credentials', () => {
      const credentials = { email: 'test@example.com', password: 'password123' }
      const result = validateLoginCredentials(credentials)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid email', () => {
      const credentials = { email: 'invalid-email', password: 'password123' }
      const result = validateLoginCredentials(credentials)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('email')
    })

    it('should reject short password', () => {
      const credentials = { email: 'test@example.com', password: '123' }
      const result = validateLoginCredentials(credentials)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('password')
    })

    it('should reject missing fields', () => {
      const credentials = { email: '', password: '' }
      const result = validateLoginCredentials(credentials)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
    })
  })

  describe('validateRegistrationData', () => {
    it('should validate valid registration data', () => {
      const data = { 
        email: 'test@example.com', 
        password: 'password123', 
        name: 'Test User' 
      }
      const result = validateRegistrationData(data)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject short name', () => {
      const data = { 
        email: 'test@example.com', 
        password: 'password123', 
        name: 'A' 
      }
      const result = validateRegistrationData(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('name')
    })

    it('should reject long name', () => {
      const data = { 
        email: 'test@example.com', 
        password: 'password123', 
        name: 'A'.repeat(51) 
      }
      const result = validateRegistrationData(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('name')
    })

    it('should reject short password', () => {
      const data = { 
        email: 'test@example.com', 
        password: '123', 
        name: 'Test User' 
      }
      const result = validateRegistrationData(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('password')
    })
  })

  describe('validateProductData', () => {
    it('should validate valid product data', () => {
      const data = { 
        name: 'Test Product', 
        price: 99.99, 
        description: 'A test product' 
      }
      const result = validateProductData(data)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject negative price', () => {
      const data = { 
        name: 'Test Product', 
        price: -10, 
        description: 'A test product' 
      }
      const result = validateProductData(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('price')
    })

    it('should reject very high price', () => {
      const data = { 
        name: 'Test Product', 
        price: 1000000, 
        description: 'A test product' 
      }
      const result = validateProductData(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('price')
    })

    it('should reject long description', () => {
      const data = { 
        name: 'Test Product', 
        price: 99.99, 
        description: 'A'.repeat(1001) 
      }
      const result = validateProductData(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('description')
    })
  })

  describe('validatePaginationParams', () => {
    it('should validate valid pagination parameters', () => {
      const params = { page: '1', limit: '10' }
      const result = validatePaginationParams(params)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate numeric pagination parameters', () => {
      const params = { page: 1, limit: 10 }
      const result = validatePaginationParams(params)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid page number', () => {
      const params = { page: '0', limit: '10' }
      const result = validatePaginationParams(params)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('page')
    })

    it('should reject invalid limit', () => {
      const params = { page: '1', limit: '101' }
      const result = validatePaginationParams(params)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('limit')
    })

    it('should reject non-numeric values', () => {
      const params = { page: 'abc', limit: 'def' }
      const result = validatePaginationParams(params)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
    })

    it('should handle missing parameters gracefully', () => {
      const params = {}
      const result = validatePaginationParams(params)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })
})
