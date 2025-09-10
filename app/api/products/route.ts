import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = { name: category }
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    // Get total count
    const total = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true }
        },
        supplier: {
          select: { id: true, name: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    })

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get products error:', error)
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
      sku,
      description,
      categoryId,
      supplierId,
      price,
      cost,
      stock,
      minStock,
      maxStock,
      reorderPoint,
      reorderQuantity,
      image,
      specifications,
    } = await request.json()

    // Validate required fields
    if (!name || !sku || !price || !cost) {
      return NextResponse.json(
        { error: 'Name, SKU, price, and cost are required' },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 409 }
      )
    }

    // Determine status based on stock
    let status = 'IN_STOCK'
    if (stock === 0) {
      status = 'OUT_OF_STOCK'
    } else if (stock <= minStock) {
      status = 'LOW_STOCK'
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        categoryId,
        supplierId,
        price: parseFloat(price),
        cost: parseFloat(cost),
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 0,
        maxStock: parseInt(maxStock) || 0,
        status: status as 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED',
        reorderPoint: reorderPoint ? parseInt(reorderPoint) : null,
        reorderQuantity: reorderQuantity ? parseInt(reorderQuantity) : null,
        image,
        specifications,
        createdById: user.userId,
      },
      include: {
        category: {
          select: { id: true, name: true }
        },
        supplier: {
          select: { id: true, name: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'CREATE_PRODUCT',
        description: `Created product: ${name}`,
        module: 'PRODUCTS',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: product,
    }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})