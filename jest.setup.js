import '@testing-library/jest-dom'

// Set up DOM environment for React testing
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
})

global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator
global.location = dom.window.location
global.history = dom.window.history

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Only mock browser APIs if we're in a browser-like environment
if (typeof window !== 'undefined') {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }
}

// Mock console methods in tests to reduce noise
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalConsoleError.call(console, ...args)
  }
  
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: componentWillReceiveProps') ||
       args[0].includes('Warning: componentWillUpdate'))
    ) {
      return
    }
    originalConsoleWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Global test utilities
global.testUtils = {
  // Helper to create mock data
  createMockUser: (overrides = {}) => ({
    id: 'user-1',
    uid: 'uid-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  }),
  
  // Helper to create mock product
  createMockProduct: (overrides = {}) => ({
    id: 'product-1',
    name: 'Test Product',
    price: 99.99,
    description: 'A test product',
    category: 'electronics',
    ...overrides,
  }),
  
  // Helper to create mock API response
  createMockApiResponse: (data, ok = true, error = null) => ({
    ok,
    data,
    error,
  }),
  
  // Helper to create mock error
  createMockError: (message, code = 'TEST_ERROR', statusCode = 500) => ({
    message,
    code,
    statusCode,
    name: 'Error',
    stack: 'Error stack trace',
  }),
}

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_ACCESS_SECRET = 'test-access-secret'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'
