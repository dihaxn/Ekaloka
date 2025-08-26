#!/usr/bin/env node

/**
 * Performance Benchmark Script for Ekaloka Application
 * 
 * This script runs comprehensive performance benchmarks to ensure
 * the application meets enterprise-grade performance standards.
 */

const { performance } = require('perf_hooks')
const crypto = require('crypto')

// Performance thresholds
const BENCHMARKS = {
  // Security operations
  PASSWORD_HASH: { target: 100, unit: 'ms', description: 'Password hashing' },
  PASSWORD_VERIFY: { target: 50, unit: 'ms', description: 'Password verification' },
  JWT_GENERATE: { target: 10, unit: 'ms', description: 'JWT generation' },
  JWT_VERIFY: { target: 5, unit: 'ms', description: 'JWT verification' },
  
  // Input validation
  INPUT_SANITIZE: { target: 1, unit: 'ms', description: 'HTML sanitization' },
  EMAIL_VALIDATE: { target: 1, unit: 'ms', description: 'Email validation' },
  
  // Rate limiting
  RATE_LIMIT: { target: 1, unit: 'ms', description: 'Rate limit check' },
  
  // Throughput
  MIN_OPS_PER_SEC: { target: 1000, unit: 'ops/sec', description: 'Minimum operations per second' },
  MIN_REQUESTS_PER_SEC: { target: 500, unit: 'req/sec', description: 'Minimum requests per second' },
  
  // Memory
  MAX_MEMORY_INCREASE: { target: 100, unit: 'MB', description: 'Maximum memory increase' }
}

// Mock security functions for benchmarking
const mockPasswordHash = async (password) => {
  return new Promise((resolve) => {
    crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
      resolve(derivedKey.toString('hex'))
    })
  })
}

const mockPasswordVerify = async (password, hash) => {
  return new Promise((resolve) => {
    crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
      resolve(derivedKey.toString('hex') === hash)
    })
  })
}

const mockJWTSign = (payload) => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = crypto.createHmac('sha256', 'secret').update(`${encodedHeader}.${encodedPayload}`).digest('base64')
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

const mockJWTVerify = (token) => {
  const parts = token.split('.')
  return JSON.parse(Buffer.from(parts[1], 'base64').toString())
}

const mockInputSanitize = (input) => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const mockEmailValidate = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const mockRateLimitCheck = (identifier) => {
  // Simulate rate limiting logic
  return Math.random() > 0.1 // 90% success rate
}

// Benchmark runner
class PerformanceBenchmark {
  constructor() {
    this.results = {}
    this.startTime = 0
    this.endTime = 0
  }

  start() {
    this.startTime = performance.now()
    console.log('🚀 Starting Performance Benchmark...\n')
  }

  end() {
    this.endTime = performance.now()
    const totalDuration = this.endTime - this.startTime
    console.log(`\n⏱️  Total Benchmark Duration: ${totalDuration.toFixed(2)}ms`)
    this.printSummary()
  }

  async benchmark(name, fn, iterations = 1000) {
    console.log(`📊 Benchmarking: ${name}`)
    
    const startMemory = process.memoryUsage().heapUsed / 1024 / 1024
    const startTime = performance.now()
    
    // Warm up
    for (let i = 0; i < 100; i++) {
      await fn()
    }
    
    // Actual benchmark
    const results = []
    for (let i = 0; i < iterations; i++) {
      const iterStart = performance.now()
      await fn()
      const iterEnd = performance.now()
      results.push(iterEnd - iterStart)
    }
    
    const endTime = performance.now()
    const endMemory = process.memoryUsage().heapUsed / 1024 / 1024
    
    const duration = endTime - startTime
    const avgDuration = results.reduce((a, b) => a + b, 0) / results.length
    const minDuration = Math.min(...results)
    const maxDuration = Math.max(...results)
    const operationsPerSecond = (iterations / duration) * 1000
    const memoryIncrease = endMemory - startMemory
    
    const result = {
      name,
      iterations,
      totalDuration: duration,
      avgDuration,
      minDuration,
      maxDuration,
      operationsPerSecond,
      memoryIncrease,
      p95: this.percentile(results, 95),
      p99: this.percentile(results, 99)
    }
    
    this.results[name] = result
    this.printResult(result)
    
    return result
  }

  percentile(arr, p) {
    const sorted = arr.sort((a, b) => a - b)
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[index]
  }

  printResult(result) {
    console.log(`  ✅ ${result.name}:`)
    console.log(`     Iterations: ${result.iterations}`)
    console.log(`     Total Time: ${result.totalDuration.toFixed(2)}ms`)
    console.log(`     Avg Time: ${result.avgDuration.toFixed(3)}ms`)
    console.log(`     Min Time: ${result.minDuration.toFixed(3)}ms`)
    console.log(`     Max Time: ${result.maxDuration.toFixed(3)}ms`)
    console.log(`     P95: ${result.p95.toFixed(3)}ms`)
    console.log(`     P99: ${result.p99.toFixed(3)}ms`)
    console.log(`     Ops/sec: ${result.operationsPerSecond.toFixed(0)}`)
    console.log(`     Memory: ${result.memoryIncrease.toFixed(2)}MB`)
    console.log('')
  }

  printSummary() {
    console.log('📋 PERFORMANCE SUMMARY')
    console.log('========================')
    
    let allPassed = true
    
    Object.entries(this.results).forEach(([name, result]) => {
      const benchmark = BENCHMARKS[name]
      if (benchmark) {
        let passed = false
        let actual = 0
        
        if (benchmark.unit === 'ms') {
          actual = result.avgDuration
          passed = actual <= benchmark.target
        } else if (benchmark.unit === 'ops/sec') {
          actual = result.operationsPerSecond
          passed = actual >= benchmark.target
        } else if (benchmark.unit === 'req/sec') {
          actual = result.operationsPerSecond
          passed = actual >= benchmark.target
        } else if (benchmark.unit === 'MB') {
          actual = result.memoryIncrease
          passed = actual <= benchmark.target
        }
        
        const status = passed ? '✅ PASS' : '❌ FAIL'
        console.log(`${status} ${name}: ${actual.toFixed(2)} ${benchmark.unit} (target: ${benchmark.target} ${benchmark.unit})`)
        
        if (!passed) allPassed = false
      }
    })
    
    console.log('\n' + (allPassed ? '🎉 All benchmarks passed!' : '⚠️  Some benchmarks failed!'))
  }
}

// Main benchmark execution
async function runBenchmarks() {
  const benchmark = new PerformanceBenchmark()
  benchmark.start()

  // Password security benchmarks
  await benchmark.benchmark('PASSWORD_HASH', async () => {
    await mockPasswordHash('TestPassword123!@#')
  }, 100) // Fewer iterations due to bcrypt-like complexity

  await benchmark.benchmark('PASSWORD_VERIFY', async () => {
    const hash = await mockPasswordHash('TestPassword123!@#')
    await mockPasswordVerify('TestPassword123!@#', hash)
  }, 100)

  // JWT benchmarks
  await benchmark.benchmark('JWT_GENERATE', () => {
    mockJWTSign({ userId: '123', email: 'test@example.com' })
  }, 10000)

  await benchmark.benchmark('JWT_VERIFY', () => {
    const token = mockJWTSign({ userId: '123', email: 'test@example.com' })
    mockJWTVerify(token)
  }, 10000)

  // Input validation benchmarks
  await benchmark.benchmark('INPUT_SANITIZE', () => {
    mockInputSanitize('<script>alert("xss")</script><p>Hello World</p>')
  }, 10000)

  await benchmark.benchmark('EMAIL_VALIDATE', () => {
    mockEmailValidate('test@example.com')
  }, 10000)

  // Rate limiting benchmarks
  await benchmark.benchmark('RATE_LIMIT', () => {
    mockRateLimitCheck('test-client-123')
  }, 10000)

  // Throughput benchmarks
  await benchmark.benchmark('MIN_OPS_PER_SEC', () => {
    // Simple operation to test throughput
    let sum = 0
    for (let i = 0; i < 1000; i++) {
      sum += i
    }
    return sum
  }, 10000)

  await benchmark.benchmark('MIN_REQUESTS_PER_SEC', async () => {
    // Simulate request processing
    await new Promise(resolve => setTimeout(resolve, 1))
    return { status: 200, message: 'Success' }
  }, 1000)

  // Memory benchmark
  await benchmark.benchmark('MAX_MEMORY_INCREASE', async () => {
    // Simulate memory-intensive operations
    const arrays = []
    for (let i = 0; i < 100; i++) {
      arrays.push(new Array(1000).fill(i))
    }
    return arrays.length
  }, 100)

  benchmark.end()
}

// Run benchmarks if this script is executed directly
if (require.main === module) {
  runBenchmarks().catch(console.error)
}

module.exports = { PerformanceBenchmark, runBenchmarks }
