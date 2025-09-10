import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const includeMovements = searchParams.get('includeMovements') === 'true'
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

    // Get products with inventory data
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true }
        },
        supplier: {
          select: { id: true, name: true }
        },
        inventoryMovements: includeMovements ? {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        } : false,
      },
      orderBy: { name: 'asc' },
    })

    // Calculate inventory summary
    const summary = {
      totalProducts: products.length,
      totalValue: products.reduce((sum, product) => sum + (Number(product.price) * product.stock), 0),
      totalCost: products.reduce((sum, product) => sum + (Number(product.cost) * product.stock), 0),
      lowStockItems: products.filter(p => p.status === 'LOW_STOCK').length,
      outOfStockItems: products.filter(p => p.status === 'OUT_OF_STOCK').length,
      inStockItems: products.filter(p => p.status === 'IN_STOCK').length,
    }

    // Get category breakdown
    const categoryBreakdown = await prisma.product.groupBy({
      by: ['categoryId'],
      where,
      _count: { id: true },
      _sum: { stock: true },
    })

    const categoriesWithNames = await Promise.all(
      categoryBreakdown.map(async (item) => {
        const category = item.categoryId ? await prisma.category.findUnique({
          where: { id: item.categoryId },
          select: { name: true }
        }) : null

        return {
          categoryName: category?.name || 'Uncategorized',
          productCount: item._count.id,
          totalStock: item._sum.stock || 0,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        summary,
        products,
        categoryBreakdown: categoriesWithNames,
      },
    })
  } catch (error) {
    console.error('Get inventory report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})