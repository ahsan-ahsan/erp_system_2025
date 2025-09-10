import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ProductStatus } from '@prisma/client'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true }
        },
        supplier: {
          select: { id: true, name: true, contact: true, email: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
        inventoryMovements: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Get product error:', error)
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
    const {
      name,
      sku,
      description,
      categoryId,
      supplierId,
      price,
      cost,
      stock,
      minStock,
      maxStock,
      reorderPoint,
      reorderQuantity,
      image,
      specifications,
    } = await request.json()

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if SKU already exists (excluding current product)
    if (sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku },
      })

      if (skuExists) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 409 }
        )
      }
    }

    // Determine status based on stock
    let status = 'IN_STOCK'
    if (stock === 0) {
      status = 'OUT_OF_STOCK'
    } else if (stock <= minStock) {
      status = 'LOW_STOCK'
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        description,
        categoryId,
        supplierId,
        price: parseFloat(price),
        cost: parseFloat(cost),
        stock: parseInt(stock),
        minStock: parseInt(minStock) || 0,
        maxStock: parseInt(maxStock) || 0,
        status: status as ProductStatus,
        reorderPoint: reorderPoint ? parseInt(reorderPoint) : null,
        reorderQuantity: reorderQuantity ? parseInt(reorderQuantity) : null,
        image,
        specifications,
      },
      include: {
        category: {
          select: { id: true, name: true }
        },
        supplier: {
          select: { id: true, name: true }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_PRODUCT',
        description: `Updated product: ${name}`,
        module: 'PRODUCTS',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    })
  } catch (error) {
    console.error('Update product error:', error)
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
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product is used in any sales or purchase orders
    const salesCount = await prisma.saleItem.count({
      where: { productId: id },
    })

    const purchaseCount = await prisma.purchaseOrderItem.count({
      where: { productId: id },
    })

    if (salesCount > 0 || purchaseCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product that has been used in sales or purchase orders' },
        { status: 409 }
      )
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'DELETE_PRODUCT',
        description: `Deleted product: ${product.name}`,
        module: 'PRODUCTS',
        severity: 'MEDIUM',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
