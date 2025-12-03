import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/server/db/prisma';

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

// GET /api/profile - Get user profile
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

    // For now, we'll use a mock user response based on token
    // In a real app, you'd verify the JWT token and fetch user from database
    let mockUser = {
      id: 'cmes6mbjk00004he9gkux1e4c',
      uid: 'user_001',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      phoneNumber: '+1-555-0123',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: {
        area: 'Downtown',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
      },
    };

    // Check if it's an admin token
    if (token.includes('admin')) {
      mockUser = {
        id: 'cmes6mbox00014he9b3hbad4f',
        uid: 'user_002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        phoneNumber: '+1-555-0456',
        dateOfBirth: '1985-05-15',
        gender: 'female',
        address: {
          area: 'Uptown',
          city: 'Los Angeles',
          state: 'CA',
          pincode: '90210',
        },
      };
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
    console.error('Error getting profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get profile' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { fullName, email, phoneNumber, dateOfBirth, gender, address } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, message: 'Full name and email are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // In a real app, you'd update the user in the database
    // For now, we'll return a success response
    const updatedProfile = {
      fullName,
      email,
      phoneNumber: phoneNumber || '',
      dateOfBirth: dateOfBirth || '',
      gender: gender || '',
      address: address || {},
    };

    const response = NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedProfile,
    });

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500, headers: corsHeaders }
    );
  }
}
