import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import { handleApiError } from '@/lib/errorHandler';

const prisma = new PrismaClient();

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

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_ACCESS_SECRET || 'your-secret-key';

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret) as any;
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const where: any = {};

    // If user is not owner, only show their orders
    if (decoded.role !== 'owner') {
      where.userId = decoded.userId;
    } else if (userId) {
      where.userId = userId;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const response = NextResponse.json({
      success: true,
      data: { orders },
    });

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error fetching orders:', error);
    const errorResponse = handleApiError(error as Error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/orders
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_ACCESS_SECRET || 'your-secret-key';

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret) as any;
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, totalAmount } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order items are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!shippingAddress || !totalAmount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Shipping address and total amount are required',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '',
        totalAmount: parseFloat(totalAmount),
        status: 'pending',
        shippingAddress,
        paymentMethod,
        paymentStatus: 'pending',
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock and sales
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: parseInt(item.quantity),
          },
          totalSales: {
            increment: parseInt(item.quantity),
          },
        },
      });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    const errorResponse = handleApiError(error as Error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/orders
export async function PUT(request: NextRequest) {
  try {
    // Check authorization - only owners can update order status
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_ACCESS_SECRET || 'your-secret-key';

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret) as any;
      if (decoded.role !== 'owner') {
        return NextResponse.json(
          { success: false, message: 'Owner access required' },
          { status: 403, headers: corsHeaders }
        );
      }
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { orderId, status, paymentStatus } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: 'Order ID and status are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const updateData: any = { status };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: { order },
    });

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error updating order:', error);
    const errorResponse = handleApiError(error as Error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  } finally {
    await prisma.$disconnect();
  }
}
