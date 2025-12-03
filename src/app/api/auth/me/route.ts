import { NextRequest, NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/auth/me - Get current user details
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // For now, we'll use a mock user response
    // In a real app, you'd verify the JWT token and fetch user from database
    const mockUser = {
      id: 'cmes4of3e0000p5z0mji4bg94',
      uid: 'user_001',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    };

    // You can modify this to return different users based on the token
    // For demo purposes, let's check if it's an admin token
    if (token.includes('admin')) {
      mockUser.role = 'admin';
      mockUser.name = 'Jane Smith';
      mockUser.email = 'jane@example.com';
      mockUser.uid = 'user_002';
    }

    const response = NextResponse.json({
      success: true,
      user: mockUser,
    });

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error getting user details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get user details' },
      { status: 500, headers: corsHeaders }
    );
  }
}
