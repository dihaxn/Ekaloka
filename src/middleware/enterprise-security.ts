import { NextRequest, NextResponse } from 'next/server'
import { EnterpriseRateLimitSecurity } from '../lib/enterprise-rate-limit'
import { EnterpriseInputSecurity } from '../lib/enterprise-input-security'
import { EnterpriseSecurityAudit } from '../lib/enterprise-audit'
import { ENTERPRISE_SECURITY_CONFIG } from '../lib/enterprise-security-config'

// Enterprise Security Middleware
export class EnterpriseSecurityMiddleware {
  /**
   * Main security check function
   */
  static async securityCheck(request: NextRequest): Promise<NextResponse | null> {
    const url = new URL(request.url)
    const clientIP = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'Unknown'

    // 1. IP Blacklist/Whitelist Check
    if (!EnterpriseRateLimitSecurity.isIPAllowed(clientIP)) {
      await EnterpriseSecurityAudit.logSecurityViolation('ip_blocked', {
        ipAddress: clientIP,
        userAgent,
        url: request.url
      })
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      )
    }

    // 2. Rate Limiting Check
    const rateLimitResult = EnterpriseRateLimitSecurity.checkRateLimit(
      clientIP,
      this.getRateLimitForPath(url.pathname)
    )

    if (rateLimitResult.isLimited) {
      await EnterpriseSecurityAudit.logSecurityViolation('rate_limit_exceeded', {
        ipAddress: clientIP,
        userAgent,
        url: request.url,
        blockedUntil: rateLimitResult.blockedUntil
      })

      const response = NextResponse.json(
        { 
          success: false, 
          message: 'Too many requests',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )

      if (rateLimitResult.blockedUntil) {
        response.headers.set('Retry-After', Math.ceil((rateLimitResult.blockedUntil - Date.now()) / 1000).toString())
      }

      return response
    }

    // 3. Input Validation Check
    const inputValidationResult = await this.validateInput(request)
    if (inputValidationResult) {
      return inputValidationResult
    }

    // 4. Suspicious Pattern Detection
    const suspiciousPatternResult = this.detectSuspiciousPatterns(request)
    if (suspiciousPatternResult) {
      await EnterpriseSecurityAudit.logSuspiciousActivity('suspicious_pattern', {
        ipAddress: clientIP,
        userAgent,
        url: request.url,
        pattern: suspiciousPatternResult.pattern
      })
      return suspiciousPatternResult.response
    }

    // 5. Log legitimate request
    await EnterpriseSecurityAudit.logAPIAccess(
      'anonymous', // Will be updated with actual user ID if authenticated
      url.pathname,
      request.method,
      200, // Will be updated with actual status code
      Date.now(), // Will be updated with actual response time
      clientIP
    )

    return null // No security issues detected
  }

  /**
   * Get rate limit based on path
   */
  private static getRateLimitForPath(path: string): number {
    if (path.startsWith('/api/auth')) {
      return ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS.AUTH
    } else if (path.startsWith('/api/admin')) {
      return ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS.ADMIN
    } else if (path.startsWith('/api/')) {
      return ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS.API
    }
    return ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS.GENERAL
  }

  /**
   * Validate input for security threats
   */
  private static async validateInput(request: NextRequest): Promise<NextResponse | null> {
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    const pathname = url.pathname

    // Check URL parameters for SQL injection
    if (EnterpriseInputSecurity.detectSQLInjection(searchParams)) {
      await EnterpriseSecurityAudit.logSecurityViolation('sql_injection_attempt', {
        ipAddress: this.getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'Unknown',
        url: request.url,
        searchParams
      })
      return NextResponse.json(
        { success: false, message: 'Invalid request' },
        { status: 400 }
      )
    }

    // Check URL parameters for XSS
    if (EnterpriseInputSecurity.detectXSS(searchParams)) {
      await EnterpriseSecurityAudit.logSecurityViolation('xss_attempt', {
        ipAddress: this.getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'Unknown',
        url: request.url,
        searchParams
      })
      return NextResponse.json(
        { success: false, message: 'Invalid request' },
        { status: 400 }
      )
    }

    // Check pathname for directory traversal
    if (pathname.includes('..') || pathname.includes('\\') || pathname.includes('//')) {
      await EnterpriseSecurityAudit.logSecurityViolation('directory_traversal_attempt', {
        ipAddress: this.getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'Unknown',
        url: request.url,
        pathname
      })
      return NextResponse.json(
        { success: false, message: 'Invalid request' },
        { status: 400 }
      )
    }

    return null
  }

  /**
   * Detect suspicious patterns
   */
  private static detectSuspiciousPatterns(request: NextRequest): { pattern: string; response: NextResponse } | null {
    const url = new URL(request.url)
    const userAgent = request.headers.get('user-agent') || ''

    // Check for common attack patterns
    const suspiciousPatterns = [
      { pattern: /\.\.\//, name: 'directory_traversal' },
      { pattern: /<script/i, name: 'xss_script_tag' },
      { pattern: /union\s+select/i, name: 'sql_union_select' },
      { pattern: /eval\s*\(/i, name: 'code_injection' },
      { pattern: /document\.cookie/i, name: 'cookie_access' },
      { pattern: /javascript:/i, name: 'javascript_protocol' },
      { pattern: /data:text\/html/i, name: 'data_url_injection' },
      { pattern: /vbscript:/i, name: 'vbscript_protocol' },
      { pattern: /on\w+\s*=/i, name: 'event_handler_injection' },
      { pattern: /<iframe/i, name: 'iframe_injection' },
      { pattern: /<object/i, name: 'object_injection' },
      { pattern: /<embed/i, name: 'embed_injection' },
      { pattern: /<form/i, name: 'form_injection' },
      { pattern: /<input/i, name: 'input_injection' },
      { pattern: /<textarea/i, name: 'textarea_injection' },
      { pattern: /<select/i, name: 'select_injection' },
      { pattern: /<button/i, name: 'button_injection' },
      { pattern: /<link/i, name: 'link_injection' },
      { pattern: /<meta/i, name: 'meta_injection' },
      { pattern: /<style/i, name: 'style_injection' },
      { pattern: /<svg/i, name: 'svg_injection' },
      { pattern: /<math/i, name: 'math_injection' },
      { pattern: /<xmp/i, name: 'xmp_injection' },
      { pattern: /<plaintext/i, name: 'plaintext_injection' },
      { pattern: /<listing/i, name: 'listing_injection' },
      { pattern: /<noframes/i, name: 'noframes_injection' },
      { pattern: /<noscript/i, name: 'noscript_injection' },
      { pattern: /<xss/i, name: 'xss_tag' },
      { pattern: /<img\s+src\s*=\s*["']?\s*javascript:/i, name: 'img_javascript_injection' },
      { pattern: /<img\s+onerror/i, name: 'img_onerror_injection' },
      { pattern: /<img\s+onload/i, name: 'img_onload_injection' },
    ]

    const fullUrl = url.toString()
    const combinedInput = `${fullUrl} ${userAgent}`

    for (const { pattern, name } of suspiciousPatterns) {
      if (pattern.test(combinedInput)) {
        return {
          pattern: name,
          response: NextResponse.json(
            { success: false, message: 'Request blocked for security reasons' },
            { status: 403 }
          )
        }
      }
    }

    return null
  }

  /**
   * Get client IP address
   */
  private static getClientIP(request: NextRequest): string {
    return (
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.ip ||
      'unknown'
    )
  }

  /**
   * Add security headers to response
   */
  static addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(ENTERPRISE_SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Add additional security headers
    response.headers.set('X-Request-ID', this.generateRequestId())
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')

    return response
  }

  /**
   * Generate unique request ID
   */
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Handle CORS for enterprise security
   */
  static handleCORS(request: NextRequest, response: NextResponse): NextResponse {
    const origin = request.headers.get('origin')
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400')

    return response
  }
}
