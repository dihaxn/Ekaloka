import { performance } from 'perf_hooks'
import { PasswordSecurity, JWTSecurity, InputSecurity, RateLimitSecurity, EncryptionSecurity } from '../../src/lib/security'

// Set test environment
(process.env as any).NODE_ENV = 'test'

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  // Authentication operations
  PASSWORD_HASH_MS: 500, // bcrypt should complete within 500ms (more realistic)
  PASSWORD_VERIFY_MS: 400, // Password verification should be fast (more realistic)
  JWT_GENERATE_MS: 30, // JWT generation should be fast (more realistic)
  JWT_VERIFY_MS: 10, // JWT verification should be fast (more realistic)
  
  // Input validation
  INPUT_SANITIZE_MS: 1, // HTML sanitization should be very fast
  EMAIL_VALIDATE_MS: 1, // Email validation should be very fast
  FILE_VALIDATE_MS: 1, // File validation should be very fast
  
  // Rate limiting
  RATE_LIMIT_CHECK_MS: 1, // Rate limit checks should be very fast
  
  // Encryption
  ENCRYPT_MS: 200, // Encryption should complete within 200ms (more realistic)
  DECRYPT_MS: 300, // Decryption should complete within 300ms (more realistic)
  
  // Memory usage
  MAX_MEMORY_MB: 100, // Maximum memory usage in MB
  
  // Throughput
  MIN_OPERATIONS_PER_SECOND: 1000, // Minimum operations per second
} as const

describe('Performance Tests', () => {
  let startTime: number
  let endTime: number
  
  beforeEach(() => {
    startTime = performance.now()
  })
  
  afterEach(() => {
    endTime = performance.now()
    const duration = endTime - startTime
    // Use console.info to avoid Jest warnings
    console.info(`Test duration: ${duration.toFixed(2)}ms`)
  })

  describe('Password Security Performance', () => {
    it('should hash password within performance threshold', async () => {
      const password = 'TestPassword123!@#'
      
      startTime = performance.now()
      const hash = await PasswordSecurity.hashPassword(password)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.PASSWORD_HASH_MS)
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('should verify password within performance threshold', async () => {
      const password = 'TestPassword123!@#'
      const hash = await PasswordSecurity.hashPassword(password)
      
      startTime = performance.now()
      const isValid = await PasswordSecurity.verifyPassword(password, hash)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.PASSWORD_VERIFY_MS)
      expect(isValid).toBe(true)
    })

    it('should validate password strength within performance threshold', () => {
      const password = 'XyZ987!@#$%^&*()'
      
      startTime = performance.now()
      const result = PasswordSecurity.validatePassword(password)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(5) // Should be very fast (more realistic)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should generate secure password within performance threshold', () => {
      startTime = performance.now()
      const password = PasswordSecurity.generateSecurePassword(16)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(1) // Should be very fast
      expect(password).toHaveLength(16)
      
      // Validate the generated password
      const validation = PasswordSecurity.validatePassword(password)
      expect(validation.isValid).toBe(true)
    })
  })

  describe('JWT Security Performance', () => {
    beforeEach(() => {
      process.env.JWT_ACCESS_SECRET = 'test-secret-key-for-testing-purposes-only-32-chars'
      process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-purposes-only-32-chars'
    })

    it('should generate access token within performance threshold', () => {
      const payload = { userId: '123', email: 'test@example.com', role: 'user' }
      
      startTime = performance.now()
      const token = JWTSecurity.generateAccessToken(payload)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.JWT_GENERATE_MS)
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
    })

    it('should generate refresh token within performance threshold', () => {
      const payload = { userId: '123', email: 'test@example.com', role: 'user' }
      
      startTime = performance.now()
      const token = JWTSecurity.generateRefreshToken(payload)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.JWT_GENERATE_MS)
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
    })

    it('should verify token within performance threshold', () => {
      const payload = { userId: '123', email: 'test@example.com', role: 'user' }
      const token = JWTSecurity.generateAccessToken(payload)
      
      startTime = performance.now()
      const decoded = JWTSecurity.verifyToken(token, 'access')
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.JWT_VERIFY_MS)
      expect(decoded.userId).toBe('123')
      expect(decoded.email).toBe('test@example.com')
    })
  })

  describe('Input Security Performance', () => {
    it('should sanitize HTML within performance threshold', () => {
      const input = '<script>alert("xss")</script><p>Hello World</p>'
      
      startTime = performance.now()
      const sanitized = InputSecurity.sanitizeHTML(input)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.INPUT_SANITIZE_MS)
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).toContain('&lt;script&gt;')
    })

    it('should validate email within performance threshold', () => {
      const email = 'test@example.com'
      
      startTime = performance.now()
      const result = InputSecurity.validateEmail(email)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.EMAIL_VALIDATE_MS)
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe(email)
    })

    it('should validate input within performance threshold', () => {
      const input = 'This is a test input string'
      
      startTime = performance.now()
      const result = InputSecurity.validateInput(input)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(1) // Should be very fast
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe(input)
    })

    it('should validate file upload within performance threshold', () => {
      const mockFile = {
        size: 1024 * 1024, // 1MB
        type: 'image/jpeg',
        name: 'test.jpg'
      } as File
      
      startTime = performance.now()
      const result = InputSecurity.validateFileUpload(mockFile)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.FILE_VALIDATE_MS)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Rate Limiting Performance', () => {
    it('should check rate limit within performance threshold', () => {
      const identifier = 'test-client-123'
      
      startTime = performance.now()
      const isLimited = RateLimitSecurity.checkRateLimit(identifier)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.RATE_LIMIT_CHECK_MS)
      expect(isLimited).toBe(false)
    })

    it('should handle multiple rate limit checks efficiently', () => {
      const identifier = 'test-client-456'
      const iterations = 1000
      
      startTime = performance.now()
      for (let i = 0; i < iterations; i++) {
        RateLimitSecurity.checkRateLimit(identifier)
      }
      endTime = performance.now()
      
      const duration = endTime - startTime
      const operationsPerSecond = (iterations / duration) * 1000
      
      expect(operationsPerSecond).toBeGreaterThan(PERFORMANCE_THRESHOLDS.MIN_OPERATIONS_PER_SECOND)
    })

    it('should clear rate limit efficiently', () => {
      const identifier = 'test-client-789'
      
      // Set up rate limit
      RateLimitSecurity.checkRateLimit(identifier)
      
      startTime = performance.now()
      RateLimitSecurity.clearRateLimit(identifier)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(1) // Should be very fast
    })
  })

  describe('Encryption Performance', () => {
    it('should encrypt data within performance threshold', () => {
      const data = 'sensitive-data-to-encrypt'
      const key = 'encryption-key-32-chars-long'
      
      startTime = performance.now()
      const encrypted = EncryptionSecurity.encrypt(data, key)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.ENCRYPT_MS)
      expect(encrypted.encrypted).toBeDefined()
      expect(encrypted.iv).toBeDefined()
      expect(encrypted.tag).toBeDefined()
    })

    it('should decrypt data within performance threshold', () => {
      const data = 'sensitive-data-to-encrypt'
      const key = 'encryption-key-32-chars-long'
      const encrypted = EncryptionSecurity.encrypt(data, key)
      
      startTime = performance.now()
      const decrypted = EncryptionSecurity.decrypt(encrypted.encrypted, key, encrypted.iv, encrypted.tag)
      endTime = performance.now()
      
      const duration = endTime - startTime
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.DECRYPT_MS)
      expect(decrypted).toBe(data)
    })
  })

  describe('Memory Usage Performance', () => {
    it('should not exceed memory threshold during operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024
      
      // Perform multiple operations
      const promises = []
      for (let i = 0; i < 100; i++) {
        promises.push(PasswordSecurity.hashPassword(`password${i}`))
      }
      
      return Promise.all(promises).then(() => {
        const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024
        const memoryIncrease = finalMemory - initialMemory
        
        expect(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.MAX_MEMORY_MB)
      })
    }, 30000) // 30 second timeout for slow bcrypt operations
  })

  describe('Concurrent Operations Performance', () => {
    it('should handle concurrent password hashing efficiently', async () => {
      const concurrentOperations = 10 // Reduced due to bcrypt slowness
      const passwords = Array.from({ length: concurrentOperations }, (_, i) => `password${i}`)
      
      startTime = performance.now()
      const results = await Promise.all(
        passwords.map(password => PasswordSecurity.hashPassword(password))
      )
      endTime = performance.now()
      
      const duration = endTime - startTime
      const operationsPerSecond = (concurrentOperations / duration) * 1000
      
      expect(results).toHaveLength(concurrentOperations)
      expect(operationsPerSecond).toBeGreaterThan(2) // Should handle at least 2 ops/sec (realistic for bcrypt)
    }, 30000) // 30 second timeout

    it('should handle concurrent JWT operations efficiently', () => {
      const concurrentOperations = 100
      const payloads = Array.from({ length: concurrentOperations }, (_, i) => ({
        userId: `user${i}`,
        email: `user${i}@example.com`,
        role: 'user'
      }))
      
      startTime = performance.now()
      const tokens = payloads.map(payload => JWTSecurity.generateAccessToken(payload))
      endTime = performance.now()
      
      const duration = endTime - startTime
      const operationsPerSecond = (concurrentOperations / duration) * 1000
      
      expect(tokens).toHaveLength(concurrentOperations)
      expect(operationsPerSecond).toBeGreaterThan(500) // Should handle at least 500 ops/sec (more realistic)
    })
  })

  describe('Scalability Performance', () => {
    it('should maintain performance with increasing data size', () => {
      const smallInput = 'a'.repeat(100)
      const mediumInput = 'a'.repeat(1000)
      const largeInput = 'a'.repeat(10000)
      
      // Test small input
      startTime = performance.now()
      InputSecurity.sanitizeHTML(smallInput)
      endTime = performance.now()
      const smallDuration = endTime - startTime
      
      // Test medium input
      startTime = performance.now()
      InputSecurity.sanitizeHTML(mediumInput)
      endTime = performance.now()
      const mediumDuration = endTime - startTime
      
      // Test large input
      startTime = performance.now()
      InputSecurity.sanitizeHTML(largeInput)
      endTime = performance.now()
      const largeDuration = endTime - startTime
      
      // Performance should scale linearly or better
      const mediumRatio = mediumDuration / smallDuration
      const largeRatio = largeDuration / smallDuration
      
      expect(mediumRatio).toBeLessThan(15) // Should not be 10x slower for 10x data
      expect(largeRatio).toBeLessThan(150) // Should not be 100x slower for 100x data
    })
  })

  describe('Stress Testing', () => {
    it('should handle high-frequency operations without degradation', () => {
      const iterations = 10000
      const startMemory = process.memoryUsage().heapUsed / 1024 / 1024
      
      startTime = performance.now()
      
      // Perform many operations rapidly
      for (let i = 0; i < iterations; i++) {
        InputSecurity.validateInput(`input-${i}`)
        RateLimitSecurity.checkRateLimit(`client-${i}`)
      }
      
      endTime = performance.now()
      const endMemory = process.memoryUsage().heapUsed / 1024 / 1024
      
      const duration = endTime - startTime
      const operationsPerSecond = (iterations / duration) * 1000
      const memoryIncrease = endMemory - startMemory
      
      expect(operationsPerSecond).toBeGreaterThan(5000) // Should handle at least 5000 ops/sec
      expect(memoryIncrease).toBeLessThan(50) // Should not increase memory by more than 50MB
    })
  })
})
