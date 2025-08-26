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

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock registration response for now
    const response = NextResponse.json({ 
      success: true, 
      message: 'Registration successful! Please log in.'
    })
    
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500, headers: corsHeaders }
    )
  }
}
