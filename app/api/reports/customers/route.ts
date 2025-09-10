import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build date range
    const dateRange: any = {}
    if (startDate && endDate) {
      dateRange.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    // Get customers with sales data
    const customers = await prisma.customer.findMany({
      where: dateRange,
      include: {
        sales: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          }
        },
        _count: {
          select: { sales: true }
        }
      },
      orderBy: { totalSpent: 'desc' },
    })

    // Calculate summary
    const summary = {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.totalOrders > 0).length,
      totalRevenue: customers.reduce((sum, customer) => sum + Number(customer.totalSpent), 0),
      averageOrderValue: customers.length > 0 
        ? customers.reduce((sum, customer) => sum + Number(customer.totalSpent), 0) / 
          customers.reduce((sum, customer) => sum + customer.totalOrders, 0) 
        : 0,
    }

    // Get top customers
    const topCustomers = customers
      .sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent))
      .slice(0, 10)
      .map(customer => ({
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        totalSpent: Number(customer.totalSpent),
        totalOrders: customer.totalOrders,
        lastOrder: customer.lastOrder,
      }))

    // Get customer acquisition over time
    const acquisitionData = await prisma.customer.groupBy({
      by: ['joinDate'],
      where: dateRange,
      _count: { id: true },
      orderBy: { joinDate: 'asc' },
    })

    const monthlyAcquisition = acquisitionData.reduce((acc: any, item) => {
      const month = item.joinDate.toISOString().substr(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + item._count.id
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        summary,
        customers: customers.map(customer => ({
          ...customer,
          totalSpent: Number(customer.totalSpent),
        })),
        topCustomers,
        monthlyAcquisition: Object.entries(monthlyAcquisition).map(([month, count]) => ({
          month,
          count,
        })),
      },
    })
  } catch (error) {
    console.error('Get customers report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})