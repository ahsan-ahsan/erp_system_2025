import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    // Build where clause
    const where: any = {}
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const taxes = await prisma.tax.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: taxes,
    })
  } catch (error) {
    console.error('Get taxes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireRole(['ADMIN'])(async (request: NextRequest, user) => {
  try {
    const { name, rate, type, isActive = true } = await request.json()

    // Validate required fields
    if (!name || rate === undefined) {
      return NextResponse.json(
        { error: 'Name and rate are required' },
        { status: 400 }
      )
    }

    // Validate rate
    if (rate < 0 || rate > 100) {
      return NextResponse.json(
        { error: 'Rate must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Check if tax with same name already exists
    const existingTax = await prisma.tax.findFirst({
      where: { name },
    })

    if (existingTax) {
      return NextResponse.json(
        { error: 'Tax with this name already exists' },
        { status: 409 }
      )
    }

    const tax = await prisma.tax.create({
      data: {
        name,
        rate: parseFloat(rate),
        type: type?.toUpperCase() || 'PERCENTAGE',
        isActive,
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'CREATE_TAX',
        description: `Created tax: ${name}`,
        module: 'SETTINGS',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Tax created successfully',
      data: tax,
    }, { status: 201 })
  } catch (error) {
    console.error('Create tax error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

