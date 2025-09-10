import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status.toUpperCase()
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    // Get total count
    const total = await prisma.sale.count({ where })

    // Get sales
    const sales = await prisma.sale.findMany({
      where,
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true }
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
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        sales,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get sales error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const {
      customerId,
      items,
      subtotal,
      tax,
      discount = 0,
      shipping = 0,
      paymentMethod,
      cashier,
      register,
      notes,
    } = await request.json()

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = subtotal + tax + shipping - discount

    // Generate invoice ID
    const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create sale
      const sale = await tx.sale.create({
        data: {
          invoiceId,
          customerId,
          userId: user.userId,
          subtotal: parseFloat(subtotal).toString(),
          tax: parseFloat(tax).toString(),
          discount: parseFloat(discount).toString(),
          shipping: parseFloat(shipping).toString(),
          total: total.toString(),
          status: 'COMPLETED',
          paymentMethod: paymentMethod?.toUpperCase(),
          cashier,
          register,
          notes,
        },
      })

      // Create sale items and update inventory
      for (const item of items) {
        // Create sale item
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            total: parseFloat(item.price) * parseInt(item.quantity),
          },
        })

        // Update product stock
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        })

        if (product) {
          const newStock = product.stock - parseInt(item.quantity)
          let status = 'IN_STOCK'
          
          if (newStock === 0) {
            status = 'OUT_OF_STOCK'
          } else if (newStock <= product.minStock) {
            status = 'LOW_STOCK'
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: newStock,
              status: status as 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK',
            },
          })

          // Create inventory movement
          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              userId: user.userId,
              type: 'SALE',
              quantity: -parseInt(item.quantity),
              reference: sale.invoiceId,
              notes: `Sale: ${sale.invoiceId}`,
            },
          })
        }
      }

      // Update customer statistics if customer exists
      if (customerId) {
        const customerStats = await tx.sale.aggregate({
          where: { customerId },
          _count: { id: true },
          _sum: { total: true },
        })

        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalOrders: customerStats._count.id,
            totalSpent: customerStats._sum.total || 0,
            lastOrder: new Date(),
          },
        })
      }

      return sale
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'CREATE_SALE',
        description: `Created sale: ${invoiceId}`,
        module: 'SALES',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // Get complete sale data
    const completeSale = await prisma.sale.findUnique({
      where: { id: result.id },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true }
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
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Sale created successfully',
      data: completeSale,
    }, { status: 201 })
  } catch (error) {
    console.error('Create sale error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
