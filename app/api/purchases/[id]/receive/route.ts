import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/')[3] || '' // Extract PO ID from /api/purchases/[id]/receive
    
    const { receivedItems, notes } = await request.json()

    // Check if purchase order exists
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!purchaseOrder) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      )
    }

    // Check if purchase order is in correct status
    if (!['CONFIRMED', 'SHIPPED'].includes(purchaseOrder.status)) {
      return NextResponse.json(
        { error: 'Purchase order must be confirmed or shipped to receive' },
        { status: 409 }
      )
    }

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Update purchase order status and received date
      await tx.purchaseOrder.update({
        where: { id },
        data: {
          status: 'RECEIVED',
          receivedDate: new Date(),
          notes: notes ? `${purchaseOrder.notes || ''}\n\nRECEIVED: ${notes}` : purchaseOrder.notes,
        },
      })

      // Process received items and update inventory
      for (const receivedItem of receivedItems) {
        const poItem = purchaseOrder.items.find(item => item.id === receivedItem.itemId)
        if (!poItem) continue

        const product = poItem.product
        if (!product) continue

        const receivedQuantity = receivedItem.quantity || poItem.quantity
        const newStock = product.stock + receivedQuantity
        
        let status = 'IN_STOCK'
        if (newStock === 0) {
          status = 'OUT_OF_STOCK'
        } else if (newStock <= product.minStock) {
          status = 'LOW_STOCK'
        }

        // Update product stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: newStock,
            status: status as any,
            lastRestocked: new Date(),
          },
        })

        // Create inventory movement
        await tx.inventoryMovement.create({
          data: {
            productId: product.id,
            userId: user.userId,
            type: 'PURCHASE',
            quantity: receivedQuantity,
            reference: purchaseOrder.poNumber,
            notes: `Received from PO: ${purchaseOrder.poNumber}`,
          },
        })
      }

      // Add timeline entry
      await tx.purchaseOrderTimeline.create({
        data: {
          poId: id,
          status: 'RECEIVED',
          description: 'Purchase order received and inventory updated',
        },
      })
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'RECEIVE_PURCHASE_ORDER',
        description: `Received purchase order: ${purchaseOrder.poNumber}`,
        module: 'PURCHASES',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Purchase order received successfully',
    })
  } catch (error) {
    console.error('Receive purchase order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

