import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/server/db/prisma'

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

// GET /api/orders - Get user orders
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authHeader.substring(7)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Mock orders data - in real app, fetch from database
    const mockOrders = [
      {
        id: "1",
        orderNumber: "ORD-001",
        date: "2025-08-25",
        status: "Delivered",
        amount: 299.99,
        items: [
          {
            product: { name: "Premium Wireless Headphones" },
            quantity: 1
          },
          {
            product: { name: "Gaming Controller" },
            quantity: 2
          }
        ],
        address: {
          fullName: "John Doe",
          area: "Downtown",
          city: "New York",
          state: "NY",
          phoneNumber: "+1-555-0123"
        }
      },
      {
        id: "2",
        orderNumber: "ORD-002",
        date: "2025-08-24",
        status: "Processing",
        amount: 149.99,
        items: [
          {
            product: { name: "Laptop Computer" },
            quantity: 1
          }
        ],
        address: {
          fullName: "Jane Smith",
          area: "Uptown",
          city: "Los Angeles",
          state: "CA",
          phoneNumber: "+1-555-0456"
        }
      }
    ]

    // Filter orders based on user role
    let userOrders = mockOrders
    if (token.includes('admin')) {
      // Admin sees all orders
      userOrders = mockOrders
    } else {
      // Regular users see their own orders
      userOrders = mockOrders.filter(order => 
        order.address.fullName === (token.includes('admin') ? 'Jane Smith' : 'John Doe')
      )
    }

    const response = NextResponse.json({
      success: true,
      orders: userOrders
    })

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Error getting orders:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to get orders' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      )
    }

    const body = await request.json()
    const { items, address, totalAmount } = body

    if (!items || !address || !totalAmount) {
      return NextResponse.json(
        { success: false, message: 'Items, address, and total amount are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

    const newOrder = {
      id: Date.now().toString(),
      orderNumber,
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
      amount: totalAmount,
      items,
      address
    }

    const response = NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    })

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500, headers: corsHeaders }
    )
  }
}
