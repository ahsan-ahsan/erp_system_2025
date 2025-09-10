import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId') || ''
    const module = searchParams.get('module') || ''
    const severity = searchParams.get('severity') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }

    if (module) {
      where.module = module.toUpperCase()
    }

    if (severity) {
      where.severity = severity.toUpperCase()
    }

    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    // Get total count
    const total = await prisma.userActivityLog.count({ where })

    // Get activity logs
    const logs = await prisma.userActivityLog.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      },
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get activity logs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

