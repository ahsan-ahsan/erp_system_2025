import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          select: { id: true, name: true, sku: true, status: true }
        },
        _count: {
          select: { products: true }
        }
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Get category error:', error)
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
    
    const { name, description, parentId } = await request.json()

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if name is already taken by another category
    if (name && name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name },
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Category name already exists' },
          { status: 409 }
        )
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        parentId,
      },
      include: {
        parent: true,
        children: true,
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_CATEGORY',
        description: `Updated category: ${updatedCategory.name}`,
        module: 'PRODUCTS',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    })
  } catch (error) {
    console.error('Update category error:', error)
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

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has products or subcategories
    const [productCount, childrenCount] = await Promise.all([
      prisma.product.count({ where: { categoryId: id } }),
      prisma.category.count({ where: { parentId: id } }),
    ])

    if (productCount > 0 || childrenCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products or subcategories' },
        { status: 409 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'DELETE_CATEGORY',
        description: `Deleted category: ${category.name}`,
        module: 'PRODUCTS',
        severity: 'MEDIUM',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})