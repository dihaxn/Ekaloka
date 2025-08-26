import { NextRequest, NextResponse } from 'next/server'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: corsHeaders
  })
}

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Mock authentication logic
    let userRole = 'user'
    let userName = 'John Doe'
    
    // Check if it's an admin user
    if (email === 'jane@example.com' && password === 'password123') {
      userRole = 'admin'
      userName = 'Jane Smith'
    } else if (email === 'john@example.com' && password === 'password123') {
      userRole = 'user'
      userName = 'John Doe'
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401, headers: corsHeaders }
      )
    }

    // Generate token with role information
    const token = `mock-jwt-token-${userRole}-${Date.now()}`
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful!',
      token,
      user: {
        name: userName,
        email,
        role: userRole
      }
    })
    
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500, headers: corsHeaders }
    )
  }
}
