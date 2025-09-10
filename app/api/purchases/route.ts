import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const supplierId = searchParams.get('supplierId') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status.toUpperCase()
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    // Get total count
    const total = await prisma.purchaseOrder.count({ where })

    // Get purchase orders
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: {
          select: { id: true, name: true, contact: true, email: true }
        },
        user: {
          select: { id: true, firstName: true, lastName: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        },
        timeline: {
          orderBy: { date: 'desc' }
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        purchaseOrders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get purchase orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const {
      supplierId,
      items,
      subtotal,
      tax,
      shipping = 0,
      expectedDelivery,
      notes,
    } = await request.json()

    // Validate required fields
    if (!supplierId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Supplier and at least one item are required' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = subtotal + tax + shipping

    // Generate PO number
    const poNumber = `PO-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create purchase order
      const purchaseOrder = await tx.purchaseOrder.create({
        data: {
          poNumber,
          supplierId,
          userId: user.userId,
          status: 'PENDING',
          subtotal: parseFloat(subtotal),
          tax: parseFloat(tax),
          shipping: parseFloat(shipping),
          total: parseFloat(total),
          expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
          notes,
        },
      })

      // Create purchase order items
      for (const item of items) {
        await tx.purchaseOrderItem.create({
          data: {
            poId: purchaseOrder.id,
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            total: parseFloat(item.price) * parseInt(item.quantity),
          },
        })
      }

      // Create initial timeline entry
      await tx.purchaseOrderTimeline.create({
        data: {
          poId: purchaseOrder.id,
          status: 'CREATED',
          description: 'Purchase order created',
        },
      })

      return purchaseOrder
    })

    // Update supplier statistics
    const supplierStats = await prisma.purchaseOrder.aggregate({
      where: { supplierId },
      _count: { id: true },
      _sum: { total: true },
    })

    await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        totalOrders: supplierStats._count.id,
        totalValue: supplierStats._sum.total || 0,
        lastOrder: new Date(),
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'CREATE_PURCHASE_ORDER',
        description: `Created purchase order: ${poNumber}`,
        module: 'PURCHASES',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // Get complete purchase order data
    const completePO = await prisma.purchaseOrder.findUnique({
      where: { id: result.id },
      include: {
        supplier: {
          select: { id: true, name: true, contact: true, email: true }
        },
        user: {
          select: { id: true, firstName: true, lastName: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        },
        timeline: {
          orderBy: { date: 'desc' }
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Purchase order created successfully',
      data: completePO,
    }, { status: 201 })
  } catch (error) {
    console.error('Create purchase order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})