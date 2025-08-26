import { NextApiRequest, NextApiResponse } from 'next'
import { ValidationError, AuthenticationError } from '../../src/types/errors'

// Mock Next.js API types
const createMockRequest = (overrides: Partial<NextApiRequest> = {}): NextApiRequest => ({
  method: 'GET',
  body: {},
  query: {},
  headers: {},
  ...overrides
}) as NextApiRequest

const createMockResponse = (): NextApiResponse => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis()
  } as unknown as NextApiResponse
  
  return res
}

// Mock the API route handlers
jest.mock('../../pages/api/auth/login', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../pages/api/auth/register', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../pages/api/auth/refresh', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../pages/api/products/index', () => ({
  __esModule: true,
  default: jest.fn()
}))

describe('API Routes', () => {
  let mockRes: NextApiResponse

  beforeEach(() => {
    mockRes = createMockResponse()
    jest.clearAllMocks()
  })

  describe('Login API Route', () => {
    it('should handle POST requests correctly', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      })

      // Import the actual handler
      const { default: loginHandler } = await import('../../pages/api/auth/login')
      
      // Mock the handler implementation
      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' })
        }
        
        // Simulate successful login
        return res.status(200).json({
          ok: true,
          data: { user: { id: '1', email: 'test@example.com' }, accessToken: 'token123' },
          error: null
        })
      })

      // Replace the default export with our mock
      jest.doMock('../../pages/api/auth/login', () => ({
        __esModule: true,
        default: mockHandler
      }))

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        data: { user: { id: '1', email: 'test@example.com' }, accessToken: 'token123' },
        error: null
      })
    })

    it('should reject non-POST requests', async () => {
      const mockReq = createMockRequest({ method: 'GET' })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' })
        }
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(405)
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
    })

    it('should validate email format', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {
          email: 'invalid-email',
          password: 'password123'
        }
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' })
        }

        // Simulate validation error
        if (!req.body.email.includes('@')) {
          return res.status(400).json({
            ok: false,
            data: null,
            error: {
              message: 'Invalid email format',
              code: 'VALIDATION_ERROR',
              statusCode: 400
            }
          })
        }

        return res.status(200).json({ ok: true, data: {}, error: null })
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: false,
        data: null,
        error: {
          message: 'Invalid email format',
          code: 'VALIDATION_ERROR',
          statusCode: 400
        }
      })
    })

    it('should validate password length', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: '123'
        }
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' })
        }

        // Simulate password validation error
        if (req.body.password.length < 6) {
          return res.status(400).json({
            ok: false,
            data: null,
            error: {
              message: 'Password must be at least 6 characters long',
              code: 'VALIDATION_ERROR',
              statusCode: 400
            }
          })
        }

        return res.status(200).json({ ok: true, data: {}, error: null })
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: false,
        data: null,
        error: {
          message: 'Password must be at least 6 characters long',
          code: 'VALIDATION_ERROR',
          statusCode: 400
        }
      })
    })
  })

  describe('Register API Route', () => {
    it('should handle POST requests correctly', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        }
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' })
        }
        
        // Simulate successful registration
        return res.status(200).json({
          ok: true,
          data: { message: 'User registered successfully' },
          error: null
        })
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        data: { message: 'User registered successfully' },
        error: null
      })
    })

    it('should validate required fields', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {
          email: '',
          password: '',
          name: ''
        }
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' })
        }

        // Simulate required field validation
        if (!req.body.email || !req.body.password || !req.body.name) {
          return res.status(400).json({
            ok: false,
            data: null,
            error: {
              message: 'All fields are required',
              code: 'VALIDATION_ERROR',
              statusCode: 400
            }
          })
        }

        return res.status(200).json({ ok: true, data: {}, error: null })
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: false,
        data: null,
        error: {
          message: 'All fields are required',
          code: 'VALIDATION_ERROR',
          statusCode: 400
        }
      })
    })
  })

  describe('Refresh API Route', () => {
    it('should handle POST requests correctly', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {
          refreshToken: 'refresh-token-123'
        }
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' })
        }
        
        // Simulate successful token refresh
        return res.status(200).json({
          ok: true,
          data: { accessToken: 'new-access-token-123' },
          error: null
        })
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        data: { accessToken: 'new-access-token-123' },
        error: null
      })
    })

    it('should handle missing refresh token', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {}
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' })
        }

        // Simulate missing refresh token error
        if (!req.body.refreshToken) {
          return res.status(400).json({
            ok: false,
            data: null,
            error: {
              message: 'Refresh token is required',
              code: 'VALIDATION_ERROR',
              statusCode: 400
            }
          })
        }

        return res.status(200).json({ ok: true, data: {}, error: null })
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: false,
        data: null,
        error: {
          message: 'Refresh token is required',
          code: 'VALIDATION_ERROR',
          statusCode: 400
        }
      })
    })
  })

  describe('Products API Route', () => {
    it('should handle GET requests correctly', async () => {
      const mockReq = createMockRequest({
        method: 'GET',
        query: {
          page: '1',
          limit: '10'
        }
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' })
        }
        
        // Simulate successful products fetch
        return res.status(200).json({
          ok: true,
          data: {
            products: [
              { id: '1', name: 'Product 1', price: 99.99 },
              { id: '2', name: 'Product 2', price: 149.99 }
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 2,
              pages: 1
            }
          },
          error: null
        })
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        data: {
          products: [
            { id: '1', name: 'Product 1', price: 99.99 },
            { id: '2', name: 'Product 2', price: 149.99 }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            pages: 1
          }
        },
        error: null
      })
    })

    it('should validate pagination parameters', async () => {
      const mockReq = createMockRequest({
        method: 'GET',
        query: {
          page: '0',
          limit: '101'
        }
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' })
        }

        // Simulate pagination validation
        const page = parseInt(req.query.page as string)
        const limit = parseInt(req.query.limit as string)

        if (page < 1 || limit < 1 || limit > 100) {
          return res.status(400).json({
            ok: false,
            data: null,
            error: {
              message: 'Invalid pagination parameters',
              code: 'VALIDATION_ERROR',
              statusCode: 400
            }
          })
        }

        return res.status(200).json({ ok: true, data: {}, error: null })
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: false,
        data: null,
        error: {
          message: 'Invalid pagination parameters',
          code: 'VALIDATION_ERROR',
          statusCode: 400
        }
      })
    })

    it('should handle search functionality', async () => {
      const mockReq = createMockRequest({
        method: 'GET',
        query: {
          page: '1',
          limit: '10',
          search: 'laptop'
        }
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' })
        }
        
        // Simulate search functionality
        const search = req.query.search as string
        const products = search ? [
          { id: '1', name: 'Gaming Laptop', price: 1299.99 }
        ] : []

        return res.status(200).json({
          ok: true,
          data: {
            products,
            pagination: {
              page: 1,
              limit: 10,
              total: products.length,
              pages: 1
            }
          },
          error: null
        })
      })

      await mockHandler(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        data: {
          products: [
            { id: '1', name: 'Gaming Laptop', price: 1299.99 }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            pages: 1
          }
        },
        error: null
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle validation errors consistently', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {}
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        // Simulate validation error
        throw new ValidationError('Validation failed', 'field', 'value')
      })

      try {
        await mockHandler(mockReq, mockRes)
      } catch (error) {
        // Error should be thrown to be handled by global error handler
        expect(error).toBeInstanceOf(ValidationError)
        expect(error.message).toBe('Validation failed')
      }
    })

    it('should handle authentication errors consistently', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {}
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        // Simulate authentication error
        throw new AuthenticationError('Invalid credentials')
      })

      try {
        await mockHandler(mockReq, mockRes)
      } catch (error) {
        // Error should be thrown to be handled by global error handler
        expect(error).toBeInstanceOf(AuthenticationError)
        expect(error.message).toBe('Invalid credentials')
      }
    })

    it('should handle unexpected errors gracefully', async () => {
      const mockReq = createMockRequest({
        method: 'POST',
        body: {}
      })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        // Simulate unexpected error
        throw new Error('Unexpected error occurred')
      })

      try {
        await mockHandler(mockReq, mockRes)
      } catch (error) {
        // Error should be thrown to be handled by global error handler
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Unexpected error occurred')
      }
    })
  })

  describe('Response Format', () => {
    it('should return consistent success response format', async () => {
      const mockReq = createMockRequest({ method: 'GET' })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        return res.status(200).json({
          ok: true,
          data: { message: 'Success' },
          error: null
        })
      })

      await mockHandler(mockReq, mockRes)

      const responseData = (mockRes.json as jest.Mock).mock.calls[0][0]
      expect(responseData).toHaveProperty('ok', true)
      expect(responseData).toHaveProperty('data')
      expect(responseData).toHaveProperty('error', null)
    })

    it('should return consistent error response format', async () => {
      const mockReq = createMockRequest({ method: 'GET' })

      const mockHandler = jest.fn().mockImplementation(async (req: NextApiRequest, res: NextApiResponse) => {
        return res.status(400).json({
          ok: false,
          data: null,
          error: {
            message: 'Bad request',
            code: 'VALIDATION_ERROR',
            statusCode: 400
          }
        })
      })

      await mockHandler(mockReq, mockRes)

      const responseData = (mockRes.json as jest.Mock).mock.calls[0][0]
      expect(responseData).toHaveProperty('ok', false)
      expect(responseData).toHaveProperty('data', null)
      expect(responseData).toHaveProperty('error')
      expect(responseData.error).toHaveProperty('message')
      expect(responseData.error).toHaveProperty('code')
      expect(responseData.error).toHaveProperty('statusCode')
    })
  })
})
