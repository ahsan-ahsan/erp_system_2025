import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    // Get date ranges
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

    // Get today's sales
    const todaySales = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lt: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
      _count: { id: true },
      _sum: { total: true },
    })

    // Get yesterday's sales for comparison
    const yesterdaySales = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: new Date(yesterday.setHours(0, 0, 0, 0)),
          lt: new Date(yesterday.setHours(23, 59, 59, 999)),
        },
      },
      _count: { id: true },
      _sum: { total: true },
    })

    // Get this month's sales
    const thisMonthSales = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: thisMonth,
        },
      },
      _count: { id: true },
      _sum: { total: true },
    })

    // Get last month's sales for comparison
    const lastMonthSales = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: lastMonth,
          lt: thisMonth,
        },
      },
      _count: { id: true },
      _sum: { total: true },
    })

    // Get inventory stats
    const inventoryStats = await prisma.product.groupBy({
      by: ['status'],
      _count: { id: true },
    })

    // Get low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        OR: [
          { status: 'LOW_STOCK' },
          { status: 'OUT_OF_STOCK' },
        ],
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        minStock: true,
        status: true,
      },
      take: 10,
      orderBy: { stock: 'asc' },
    })

    // Get customer stats
    const customerStats = await prisma.customer.aggregate({
      _count: { id: true },
    })

    // Get active customers (customers with orders in last 30 days)
    const activeCustomers = await prisma.customer.count({
      where: {
        lastOrder: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    })

    // Get recent transactions
    const recentTransactions = await prisma.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { firstName: true, lastName: true },
        },
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    })

    // Get pending purchase orders
    const pendingPOs = await prisma.purchaseOrder.count({
      where: {
        status: 'PENDING',
      },
    })

    // Get overdue purchase orders
    const overduePOs = await prisma.purchaseOrder.count({
      where: {
        status: { in: ['PENDING', 'CONFIRMED'] },
        expectedDelivery: {
          lt: new Date(),
        },
      },
    })

    // Calculate percentage changes
    const todayRevenueChange = yesterdaySales._sum.total
      ? ((Number(todaySales._sum.total) - Number(yesterdaySales._sum.total)) / Number(yesterdaySales._sum.total)) * 100
      : 0

    const monthlyRevenueChange = lastMonthSales._sum.total
      ? ((Number(thisMonthSales._sum.total) - Number(lastMonthSales._sum.total)) / Number(lastMonthSales._sum.total)) * 100
      : 0

    // Get sales chart data for last 7 days
    const salesChartData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const dailySales = await prisma.sale.aggregate({
        where: {
          createdAt: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lt: new Date(date.setHours(23, 59, 59, 999)),
          },
        },
        _sum: { total: true },
        _count: { id: true },
      })

      salesChartData.push({
        date: date.toISOString().split('T')[0],
        revenue: Number(dailySales._sum.total) || 0,
        orders: dailySales._count.id,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          todayRevenue: Number(todaySales._sum.total) || 0,
          todayOrders: todaySales._count.id,
          todayRevenueChange,
          monthlyRevenue: Number(thisMonthSales._sum.total) || 0,
          monthlyOrders: thisMonthSales._count.id,
          monthlyRevenueChange,
          totalCustomers: customerStats._count.id,
          activeCustomers,
          inventoryStats: inventoryStats.reduce((acc, stat) => {
            acc[stat.status.toLowerCase()] = stat._count.id
            return acc
          }, {} as any),
          pendingPOs,
          overduePOs,
        },
        lowStockProducts,
        recentTransactions: recentTransactions.map(transaction => ({
          id: transaction.id,
          invoiceId: transaction.invoiceId,
          total: Number(transaction.total),
          customer: transaction.customer
            ? `${transaction.customer.firstName} ${transaction.customer.lastName}`
            : 'Walk-in Customer',
          cashier: `${transaction.user.firstName} ${transaction.user.lastName}`,
          createdAt: transaction.createdAt,
          status: transaction.status,
        })),
        salesChartData,
      },
    })
  } catch (error) {
    console.error('Get dashboard data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})