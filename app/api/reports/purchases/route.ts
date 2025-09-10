import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const supplierId = searchParams.get('supplierId')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}
    
    if (supplierId) {
      where.supplierId = supplierId
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    // Get purchase orders
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: {
          select: { id: true, name: true, contact: true }
        },
        user: {
          select: { firstName: true, lastName: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate summary
    const summary = {
      totalOrders: purchaseOrders.length,
      totalValue: purchaseOrders.reduce((sum, po) => sum + Number(po.total), 0),
      totalSubtotal: purchaseOrders.reduce((sum, po) => sum + Number(po.subtotal), 0),
      totalTax: purchaseOrders.reduce((sum, po) => sum + Number(po.tax), 0),
      totalShipping: purchaseOrders.reduce((sum, po) => sum + Number(po.shipping), 0),
      averageOrderValue: purchaseOrders.length > 0 
        ? purchaseOrders.reduce((sum, po) => sum + Number(po.total), 0) / purchaseOrders.length 
        : 0,
      statusBreakdown: purchaseOrders.reduce((acc, po) => {
        acc[po.status] = (acc[po.status] || 0) + 1
        return acc
      }, {} as any),
    }

    // Get supplier performance
    const supplierPerformance = await prisma.purchaseOrder.groupBy({
      by: ['supplierId'],
      where,
      _count: { id: true },
      _sum: { total: true },
    })

    const suppliersWithData = await Promise.all(
      supplierPerformance.map(async (item) => {
        const supplier = await prisma.supplier.findUnique({
          where: { id: item.supplierId },
          select: { name: true, contact: true }
        })

        return {
          supplierName: supplier?.name || 'Unknown',
          contact: supplier?.contact || '',
          orderCount: item._count.id,
          totalValue: Number(item._sum.total) || 0,
          averageOrderValue: item._count.id > 0 ? Number(item._sum.total) / item._count.id : 0,
        }
      })
    )

    // Get monthly trends
    const monthlyData = purchaseOrders.reduce((acc: any, po) => {
      const month = po.createdAt.toISOString().substr(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = { orders: 0, value: 0 }
      }
      acc[month].orders += 1
      acc[month].value += Number(po.total)
      return acc
    }, {})

    const monthlyTrends = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
      month,
      orders: data.orders,
      value: data.value,
    })).sort((a, b) => a.month.localeCompare(b.month))

    return NextResponse.json({
      success: true,
      data: {
        summary,
        purchaseOrders: purchaseOrders.map(po => ({
          ...po,
          total: Number(po.total),
          subtotal: Number(po.subtotal),
          tax: Number(po.tax),
          shipping: Number(po.shipping),
        })),
        supplierPerformance: suppliersWithData,
        monthlyTrends,
      },
    })
  } catch (error) {
    console.error('Get purchases report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})