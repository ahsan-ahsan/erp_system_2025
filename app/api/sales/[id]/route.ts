import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''

    const sale = await prisma.sale.findUnique({
      where: { id },
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

    if (!sale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: sale,
    })
  } catch (error) {
    console.error('Get sale error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const PUT = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''
    
    const { status, notes } = await request.json()

    // Check if sale exists
    const existingSale = await prisma.sale.findUnique({
      where: { id },
    })

    if (!existingSale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      )
    }

    const updatedSale = await prisma.sale.update({
      where: { id },
      data: {
        status: status?.toUpperCase(),
        notes,
      },
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

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_SALE',
        description: `Updated sale: ${updatedSale.invoiceId}`,
        module: 'SALES',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Sale updated successfully',
      data: updatedSale,
    })
  } catch (error) {
    console.error('Update sale error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const DELETE = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''

    // Check if sale exists
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: true,
      },
    })

    if (!sale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of pending sales
    if (sale.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only delete pending sales' },
        { status: 409 }
      )
    }

    // Start transaction to delete sale and restore inventory
    await prisma.$transaction(async (tx) => {
      // Restore inventory for each item
      for (const item of sale.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        })

        if (product) {
          const newStock = product.stock + item.quantity
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
              status: status as any,
            },
          })

          // Create inventory movement
          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              userId: user.userId,
              type: 'RETURN',
              quantity: item.quantity,
              reference: `DELETED_SALE_${sale.invoiceId}`,
              notes: `Inventory restored from deleted sale: ${sale.invoiceId}`,
            },
          })
        }
      }

      // Delete sale (cascade will delete items)
      await tx.sale.delete({
        where: { id },
      })
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'DELETE_SALE',
        description: `Deleted sale: ${sale.invoiceId}`,
        module: 'SALES',
        severity: 'HIGH',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Sale deleted successfully',
    })
  } catch (error) {
    console.error('Delete sale error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})