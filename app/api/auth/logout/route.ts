import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    
    if (user) {
      // Log logout activity
      await prisma.userActivityLog.create({
        data: {
          userId: user.userId,
          action: 'LOGOUT',
          description: 'User logged out successfully',
          module: 'AUTH',
          severity: 'LOW',
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      })
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    })

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
