import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
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

    if (!purchaseOrder) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: purchaseOrder,
    })
  } catch (error) {
    console.error('Get purchase order error:', error)
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
    
    const { status, expectedDelivery, notes } = await request.json()

    // Check if purchase order exists
    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { id },
    })

    if (!existingPO) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      )
    }

    const updatedPO = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: status?.toUpperCase(),
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : undefined,
        notes,
      },
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
      },
    })

    // Add timeline entry if status changed
    if (status && status !== existingPO.status) {
      await prisma.purchaseOrderTimeline.create({
        data: {
          poId: id,
          status: status.toUpperCase(),
          description: `Status updated to ${status}`,
        },
      })
    }

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_PURCHASE_ORDER',
        description: `Updated purchase order: ${updatedPO.poNumber}`,
        module: 'PURCHASES',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Purchase order updated successfully',
      data: updatedPO,
    })
  } catch (error) {
    console.error('Update purchase order error:', error)
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

    // Only allow deletion of pending or cancelled purchase orders
    if (!['PENDING', 'CANCELLED'].includes(purchaseOrder.status)) {
      return NextResponse.json(
        { error: 'Can only delete pending or cancelled purchase orders' },
        { status: 409 }
      )
    }

    // Delete purchase order (cascade will delete items and timeline)
    await prisma.purchaseOrder.delete({
      where: { id },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'DELETE_PURCHASE_ORDER',
        description: `Deleted purchase order: ${purchaseOrder.poNumber}`,
        module: 'PURCHASES',
        severity: 'HIGH',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Purchase order deleted successfully',
    })
  } catch (error) {
    console.error('Delete purchase order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})