import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    // Get total count
    const total = await prisma.supplier.count({ where })

    // Get suppliers
    const suppliers = await prisma.supplier.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
        products: {
          select: { id: true, name: true, sku: true }
        },
        purchaseOrders: {
          select: { id: true, poNumber: true, total: true, status: true, createdAt: true }
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        suppliers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get suppliers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const {
      name,
      contact,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      categories,
      rating,
    } = await request.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if supplier already exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { email },
    })

    if (existingSupplier) {
      return NextResponse.json(
        { error: 'Supplier with this email already exists' },
        { status: 409 }
      )
    }

    // ✅ Create supplier with categories fix
    const supplier = await prisma.supplier.create({
      data: {
        name,
        contact,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        categories: categories
          ? (Array.isArray(categories)
              ? categories
              : categories.split(",").map((c: string) => c.trim()))
          : [],
        rating: rating ? parseFloat(rating) : null,
        createdById: user.userId,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'CREATE_SUPPLIER',
        description: `Created supplier: ${name}`,
        module: 'SUPPLIERS',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Supplier created successfully',
        data: supplier,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create supplier error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})


export const PATCH = requireAuth(async (request: NextRequest, user) => {
  try {
    const { supplierId, status } = await request.json()

    if (!supplierId || !status) {
      return NextResponse.json(
        { error: 'Supplier ID and status are required' },
        { status: 400 }
      )
    }

    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Update supplier status
    const supplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: { status },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_SUPPLIER_STATUS',
        description: `Updated supplier ${supplier.name} → ${status}`,
        module: 'SUPPLIERS',
        severity: 'MEDIUM',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Supplier status updated successfully',
      data: supplier,
    })
  } catch (error) {
    console.error('Update supplier status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

