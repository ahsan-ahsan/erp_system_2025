import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
        products: {
          select: { id: true, name: true, sku: true, status: true }
        },
        purchaseOrders: {
          select: { 
            id: true, 
            poNumber: true,
            total: true, 
            status: true,
            createdAt: true 
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: supplier,
    })
  } catch (error) {
    console.error('Get supplier error:', error)
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
      contact,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      categories,
      rating,
    } = await request.json()

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id },
    })

    if (!existingSupplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Check if email is already taken by another supplier
    if (email && email !== existingSupplier.email) {
      const emailExists = await prisma.supplier.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        )
      }
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        contact,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        categories: categories || [],
        rating: rating ? parseFloat(rating) : null,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_SUPPLIER',
        description: `Updated supplier: ${updatedSupplier.name}`,
        module: 'SUPPLIERS',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    })
  } catch (error) {
    console.error('Update supplier error:', error)
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

    // Check if supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id },
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Check if supplier has products or purchase orders
    const [productCount, poCount] = await Promise.all([
      prisma.product.count({ where: { supplierId: id } }),
      prisma.purchaseOrder.count({ where: { supplierId: id } }),
    ])

    if (productCount > 0 || poCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete supplier with existing products or purchase orders' },
        { status: 409 }
      )
    }

    await prisma.supplier.delete({
      where: { id },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'DELETE_SUPPLIER',
        description: `Deleted supplier: ${supplier.name}`,
        module: 'SUPPLIERS',
        severity: 'MEDIUM',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully',
    })
  } catch (error) {
    console.error('Delete supplier error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

