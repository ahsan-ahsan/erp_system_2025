import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}
    
    if (categoryId) {
      where.categoryId = categoryId
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true }
        },
        supplier: {
          select: { id: true, name: true }
        },
        saleItems: {
          where: startDate && endDate ? {
            sale: {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              }
            }
          } : {},
          include: {
            sale: {
              select: { id: true, createdAt: true, total: true }
            }
          }
        },
        inventoryMovements: startDate && endDate ? {
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            }
          }
        } : false,
      },
      orderBy: { name: 'asc' },
    })

    // Calculate product performance
    const productPerformance = products.map(product => {
      const totalSold = product.saleItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalRevenue = product.saleItems.reduce((sum, item) => sum + Number(item.total), 0)
      const totalCost = product.saleItems.reduce((sum, item) => sum + (Number(product.cost) * item.quantity), 0)
      const profit = totalRevenue - totalCost
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

      return {
        ...product,
        totalSold,
        totalRevenue,
        totalCost,
        profit,
        profitMargin,
        currentValue: Number(product.price) * product.stock,
        currentCost: Number(product.cost) * product.stock,
      }
    })

    // Get top performing products
    const topProducts = productPerformance
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)

    // Get category performance
    const categoryPerformance = await prisma.product.groupBy({
      by: ['categoryId'],
      where,
      _count: { id: true },
      _sum: { stock: true },
    })

    const categoriesWithData = await Promise.all(
      categoryPerformance.map(async (item) => {
        const category = item.categoryId ? await prisma.category.findUnique({
          where: { id: item.categoryId },
          select: { name: true }
        }) : null

        const categoryProducts = productPerformance.filter(p => p.categoryId === item.categoryId)
        const categoryRevenue = categoryProducts.reduce((sum, p) => sum + p.totalRevenue, 0)
        const categoryProfit = categoryProducts.reduce((sum, p) => sum + p.profit, 0)

        return {
          categoryName: category?.name || 'Uncategorized',
          productCount: item._count.id,
          totalStock: item._sum.stock || 0,
          totalRevenue: categoryRevenue,
          totalProfit: categoryProfit,
          profitMargin: categoryRevenue > 0 ? (categoryProfit / categoryRevenue) * 100 : 0,
        }
      })
    )

    // Calculate summary
    const summary = {
      totalProducts: products.length,
      totalValue: products.reduce((sum, product) => sum + (Number(product.price) * product.stock), 0),
      totalCost: products.reduce((sum, product) => sum + (Number(product.cost) * product.stock), 0),
      totalRevenue: productPerformance.reduce((sum, product) => sum + product.totalRevenue, 0),
      totalProfit: productPerformance.reduce((sum, product) => sum + product.profit, 0),
      averageProfitMargin: productPerformance.length > 0 
        ? productPerformance.reduce((sum, product) => sum + product.profitMargin, 0) / productPerformance.length 
        : 0,
    }

    return NextResponse.json({
      success: true,
      data: {
        summary,
        products: productPerformance,
        topProducts,
        categoryPerformance: categoriesWithData,
      },
    })
  } catch (error) {
    console.error('Get products report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})