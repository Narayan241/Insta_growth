import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { orderId, username } = await request.json()

    if (!orderId || !username) {
      return NextResponse.json(
        { error: 'Order ID and username are required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await db.instagramUser.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get order
    const order = await db.order.findFirst({
      where: {
        id: orderId,
        userId: user.id
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.status !== 'PAYMENT_DUE') {
      return NextResponse.json(
        { error: 'Order is not ready for payment' },
        { status: 400 }
      )
    }

    // Update order status to paid
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paidAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: 'Payment successful',
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        paidAt: updatedOrder.paidAt,
        amount: updatedOrder.price
      }
    })

  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}