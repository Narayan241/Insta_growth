import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const pendingOrders = await db.order.findMany({
      where: {
        status: 'PENDING',
        scheduledFor: {
          lte: new Date()
        }
      },
      include: {
        user: true
      }
    })

    for (const order of pendingOrders) {
      await db.order.update({
        where: { id: order.id },
        data: {
          status: 'PROCESSING'
        }
      })

      setTimeout(async () => {
        try {
          await processOrder(order)
          
          await db.order.update({
            where: { id: order.id },
            data: {
              status: 'PAYMENT_DUE',
              completedAt: new Date()
            }
          })
        } catch (error) {
          console.error(`Failed to process order ${order.id}:`, error)
          
          await db.order.update({
            where: { id: order.id },
            data: {
              status: 'FAILED'
            }
          })
        }
      }, Math.random() * 300000 + 60000)
    }

    return NextResponse.json({ 
      message: `Processing ${pendingOrders.length} orders` 
    })

  } catch (error) {
    console.error('Order processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function processOrder(order: any) {
  console.log(`Processing order ${order.id}: ${order.serviceType} - ${order.quantity}`)
  
  switch (order.serviceType) {
    case 'FOLLOWERS':
      await simulateFollowers(order.quantity, order.targetUrl)
      break
    case 'LIKES':
      await simulateLikes(order.quantity, order.targetUrl)
      break
    case 'COMMENTS':
      await simulateComments(order.quantity, order.targetUrl)
      break
    case 'VIEWS':
      await simulateViews(order.quantity, order.targetUrl)
      break
    case 'SAVES':
      await simulateSaves(order.quantity, order.targetUrl)
      break
    default:
      throw new Error(`Unknown service type: ${order.serviceType}`)
  }
}

async function simulateFollowers(quantity: number, targetUrl: string) {
  console.log(`Adding ${quantity} followers to ${targetUrl}`)
  await new Promise(resolve => setTimeout(resolve, 2000))
}

async function simulateLikes(quantity: number, targetUrl: string) {
  console.log(`Adding ${quantity} likes to ${targetUrl}`)
  await new Promise(resolve => setTimeout(resolve, 1500))
}

async function simulateComments(quantity: number, targetUrl: string) {
  console.log(`Adding ${quantity} comments to ${targetUrl}`)
  const comments = [
    'Amazing post! 🔥',
    'Love this content! 💕',
    'Great work! 👏',
    'Inspiring! ✨',
    'Keep it up! 💪'
  ]
  
  for (let i = 0; i < quantity; i++) {
    const randomComment = comments[Math.floor(Math.random() * comments.length)]
    console.log(`Comment: ${randomComment}`)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

async function simulateViews(quantity: number, targetUrl: string) {
  console.log(`Adding ${quantity} views to ${targetUrl}`)
  await new Promise(resolve => setTimeout(resolve, 1000))
}

async function simulateSaves(quantity: number, targetUrl: string) {
  console.log(`Adding ${quantity} saves to ${targetUrl}`)
  await new Promise(resolve => setTimeout(resolve, 1800))
}