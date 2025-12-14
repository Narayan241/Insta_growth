import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { serviceType, quantity, targetUrl, username } = await request.json()

    if (!serviceType || !quantity || !targetUrl || !username) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const user = await db.instagramUser.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate price
    const servicePrices = {
      'FOLLOWERS': 0.01,
      'LIKES': 0.005,
      'COMMENTS': 0.05,
      'VIEWS': 0.001,
      'SAVES': 0.01
    }
    
    const price = (servicePrices[serviceType as keyof typeof servicePrices] || 0) * quantity

    const order = await db.order.create({
      data: {
        userId: user.id,
        serviceType,
        quantity,
        targetUrl,
        price,
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    })

    return NextResponse.json({ 
      message: 'Order placed successfully',
      order: {
        id: order.id,
        serviceType: order.serviceType,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        scheduledFor: order.scheduledFor
      }
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}