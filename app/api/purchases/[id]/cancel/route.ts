import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/')[3] || '' // Extract PO ID from /api/purchases/[id]/cancel
    
    const { reason } = await request.json()

    // Check if purchase order exists
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
    })

    if (!purchaseOrder) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      )
    }

    // Check if purchase order can be cancelled
    if (['RECEIVED', 'CANCELLED'].includes(purchaseOrder.status)) {
      return NextResponse.json(
        { error: 'Cannot cancel a received or already cancelled purchase order' },
        { status: 409 }
      )
    }

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Update purchase order status
      await tx.purchaseOrder.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: reason ? `${purchaseOrder.notes || ''}\n\nCANCELLED: ${reason}` : purchaseOrder.notes,
        },
      })

      // Add timeline entry
      await tx.purchaseOrderTimeline.create({
        data: {
          poId: id,
          status: 'CANCELLED',
          description: reason || 'Purchase order cancelled',
        },
      })
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'CANCEL_PURCHASE_ORDER',
        description: `Cancelled purchase order: ${purchaseOrder.poNumber}`,
        module: 'PURCHASES',
        severity: 'MEDIUM',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Purchase order cancelled successfully',
    })
  } catch (error) {
    console.error('Cancel purchase order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})