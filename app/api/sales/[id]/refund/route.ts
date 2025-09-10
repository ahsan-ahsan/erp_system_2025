import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/')[3] || '' // Extract sale ID from /api/sales/[id]/refund
    
    const { reason, refundAmount, restoreInventory = true } = await request.json()

    // Check if sale exists
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!sale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      )
    }

    // Check if sale is already refunded
    if (sale.status === 'REFUNDED') {
      return NextResponse.json(
        { error: 'Sale is already refunded' },
        { status: 409 }
      )
    }

    // Validate refund amount
    const maxRefund = Number(sale.total)
    if (refundAmount && refundAmount > maxRefund) {
      return NextResponse.json(
        { error: 'Refund amount cannot exceed sale total' },
        { status: 400 }
      )
    }

    const actualRefundAmount = refundAmount || maxRefund

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Update sale status
      await tx.sale.update({
        where: { id },
        data: {
          status: 'REFUNDED',
          notes: sale.notes ? `${sale.notes}\n\nREFUND: ${reason}` : `REFUND: ${reason}`,
        },
      })

      // Restore inventory if requested
      if (restoreInventory) {
        for (const item of sale.items) {
          const product = item.product
          if (product) {
            const newStock = product.stock + item.quantity
            let status = 'IN_STOCK'
            
            if (newStock === 0) {
              status = 'OUT_OF_STOCK'
            } else if (newStock <= product.minStock) {
              status = 'LOW_STOCK'
            }

            await tx.product.update({
              where: { id: product.id },
              data: {
                stock: newStock,
                status: status as any,
              },
            })

            // Create inventory movement
            await tx.inventoryMovement.create({
              data: {
                productId: product.id,
                userId: user.userId,
                type: 'RETURN',
                quantity: item.quantity,
                reference: `REFUND_${sale.invoiceId}`,
                notes: `Refund: ${reason}`,
              },
            })
          }
        }
      }

      // Update customer statistics if customer exists
      if (sale.customerId) {
        const customerStats = await tx.sale.aggregate({
          where: { 
            customerId: sale.customerId,
            status: { not: 'REFUNDED' },
          },
          _count: { id: true },
          _sum: { total: true },
        })

        await tx.customer.update({
          where: { id: sale.customerId },
          data: {
            totalOrders: customerStats._count.id,
            totalSpent: customerStats._sum.total || 0,
          },
        })
      }
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'REFUND_SALE',
        description: `Refunded sale: ${sale.invoiceId} - Amount: $${actualRefundAmount}`,
        module: 'SALES',
        severity: 'MEDIUM',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Sale refunded successfully',
      data: {
        refundAmount: actualRefundAmount,
        reason,
        restoreInventory,
      },
    })
  } catch (error) {
    console.error('Refund sale error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

