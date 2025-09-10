import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const groupBy = searchParams.get('groupBy') || 'day' // day, week, month
    const customerId = searchParams.get('customerId')

    // Build date range
    const dateRange: any = {}
    if (startDate && endDate) {
      dateRange.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    // Build where clause
    const where: any = { ...dateRange }
    if (customerId) {
      where.customerId = customerId
    }

    // Get sales data
    const sales = await prisma.sale.findMany({
      where,
      select: {
        id: true,
        total: true,
        subtotal: true,
        tax: true,
        createdAt: true,
        customer: {
          select: { id: true, firstName: true, lastName: true }
        },
        items: {
          select: {
            quantity: true,
            total: true,
            product: {
              select: { id: true, name: true, category: { select: { name: true } } }
            }
          }
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Get summary statistics
    const summary = await prisma.sale.aggregate({
      where,
      _count: { id: true },
      _sum: { total: true, subtotal: true, tax: true },
      _avg: { total: true },
    })

    // Group sales by date
    const salesByDate: { [key: string]: { sales: number, orders: number, revenue: number } } = {}
    
    sales.forEach(sale => {
      let dateKey: string
      const date = new Date(sale.createdAt)
      
      switch (groupBy) {
        case 'week':
          const week = Math.floor(date.getTime() / (1000 * 60 * 60 * 24 * 7))
          dateKey = `Week ${week}`
          break
        case 'month':
          dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          break
        default: // day
          dateKey = date.toISOString().split('T')[0]
      }

      if (!salesByDate[dateKey]) {
        salesByDate[dateKey] = { sales: 0, orders: 0, revenue: 0 }
      }
      
      salesByDate[dateKey].orders += 1
      salesByDate[dateKey].revenue += Number(sale.total)
      salesByDate[dateKey].sales += sale.items.reduce((sum, item) => sum + item.quantity, 0)
    })

    // Convert to array format
    const chartData = Object.entries(salesByDate).map(([date, data]) => ({
      date,
      ...data,
    }))

    // Get top products
    const productSales: { [key: string]: { name: string, quantity: number, revenue: number } } = {}
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const productId = item.product.id
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.product.name,
            quantity: 0,
            revenue: 0,
          }
        }
        productSales[productId].quantity += item.quantity
        productSales[productId].revenue += Number(item.total)
      })
    })

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Get category performance
    const categoryPerformance: { [key: string]: { revenue: number, quantity: number } } = {}
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const categoryName = item.product.category?.name || 'Uncategorized'
        if (!categoryPerformance[categoryName]) {
          categoryPerformance[categoryName] = { revenue: 0, quantity: 0 }
        }
        categoryPerformance[categoryName].revenue += Number(item.total)
        categoryPerformance[categoryName].quantity += item.quantity
      })
    })

    const categoryData = Object.entries(categoryPerformance).map(([name, data]) => ({
      name,
      ...data,
    }))

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalOrders: summary._count.id,
          totalRevenue: Number(summary._sum.total) || 0,
          totalSubtotal: Number(summary._sum.subtotal) || 0,
          totalTax: Number(summary._sum.tax) || 0,
          averageOrderValue: Number(summary._avg.total) || 0,
        },
        chartData,
        topProducts,
        categoryData,
      },
    })
  } catch (error) {
    console.error('Get sales report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})