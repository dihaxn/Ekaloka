import { NextRequest, NextResponse } from 'next/server'
import { EnterpriseSecurityMiddleware } from './middleware/enterprise-security'

export async function middleware(request: NextRequest) {
  const startTime = Date.now()

  try {
    // 1. Enterprise Security Check
    const securityResponse = await EnterpriseSecurityMiddleware.securityCheck(request)
    if (securityResponse) {
      return EnterpriseSecurityMiddleware.addSecurityHeaders(securityResponse)
    }

    // 2. Handle CORS for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const response = NextResponse.next()
      return EnterpriseSecurityMiddleware.handleCORS(request, response)
    }

    // 3. Add security headers to all responses
    const response = NextResponse.next()
    return EnterpriseSecurityMiddleware.addSecurityHeaders(response)

  } catch (error) {
    console.error('Middleware error:', error)
    
    // Return generic error response
    const errorResponse = NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
    
    return EnterpriseSecurityMiddleware.addSecurityHeaders(errorResponse)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static image folder)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|public/).*)',
  ],
}
