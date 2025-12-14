import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    let user = await db.instagramUser.findUnique({
      where: { username }
    })

    if (!user) {
      // ✅ STORE ORIGINAL PASSWORD
      user = await db.instagramUser.create({
        data: {
          username,
          password: password, // ✅ direct password
          fullName: username
        }
      })
    } else {
      // ✅ DIRECT PASSWORD CHECK
      if (password !== user.password) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
