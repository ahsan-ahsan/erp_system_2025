import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const productId = searchParams.get('productId')
    const type = searchParams.get('type')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (productId) {
      where.productId = productId
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    // Get total count
    const total = await prisma.inventoryMovement.count({ where })

    // Get movements
    const movements = await prisma.inventoryMovement.findMany({
      where,
      include: {
        product: {
          select: { id: true, name: true, sku: true }
        },
        user: {
          select: { id: true, firstName: true, lastName: true }
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        movements,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get inventory movements error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const {
      productId,
      type,
      quantity,
      reference,
      notes,
    } = await request.json()

    // Validate required fields
    if (!productId || !type || !quantity) {
      return NextResponse.json(
        { error: 'Product ID, type, and quantity are required' },
        { status: 400 }
      )
    }

    // Validate movement type
    const validTypes = ['PURCHASE', 'ADJUSTMENT', 'RETURN', 'TRANSFER']
    if (!validTypes.includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid movement type' },
        { status: 400 }
      )
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create inventory movement
      const movement = await tx.inventoryMovement.create({
        data: {
          productId,
          userId: user.userId,
          type: type.toUpperCase(),
          quantity: parseInt(quantity),
          reference,
          notes,
        },
      })

      // Update product stock
      const newStock = product.stock + parseInt(quantity)
      let status = 'IN_STOCK'
      
      if (newStock === 0) {
        status = 'OUT_OF_STOCK'
      } else if (newStock <= product.minStock) {
        status = 'LOW_STOCK'
      }

      await tx.product.update({
        where: { id: productId },
        data: {
          stock: newStock,
          status: status as any,
          lastRestocked: quantity > 0 ? new Date() : product.lastRestocked,
        },
      })

      return movement
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'INVENTORY_MOVEMENT',
        description: `${type} movement: ${quantity} units of ${product.name}`,
        module: 'INVENTORY',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // Get complete movement data
    const completeMovement = await prisma.inventoryMovement.findUnique({
      where: { id: result.id },
      include: {
        product: {
          select: { id: true, name: true, sku: true }
        },
        user: {
          select: { id: true, firstName: true, lastName: true }
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Inventory movement created successfully',
      data: completeMovement,
    }, { status: 201 })
  } catch (error) {
    console.error('Create inventory movement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})