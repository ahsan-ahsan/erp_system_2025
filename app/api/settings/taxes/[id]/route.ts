import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const PUT = requireRole(['ADMIN'])(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''
    
    const { name, rate, type, isActive } = await request.json()

    // Check if tax exists
    const existingTax = await prisma.tax.findUnique({
      where: { id },
    })

    if (!existingTax) {
      return NextResponse.json(
        { error: 'Tax not found' },
        { status: 404 }
      )
    }

    // Validate rate if provided
    if (rate !== undefined && (rate < 0 || rate > 100)) {
      return NextResponse.json(
        { error: 'Rate must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Check if name is already taken by another tax
    if (name && name !== existingTax.name) {
      const nameExists = await prisma.tax.findFirst({
        where: { name },
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Tax with this name already exists' },
          { status: 409 }
        )
      }
    }

    const updatedTax = await prisma.tax.update({
      where: { id },
      data: {
        name: name || existingTax.name,
        rate: rate !== undefined ? parseFloat(rate) : existingTax.rate,
        type: type?.toUpperCase() || existingTax.type,
        isActive: isActive !== undefined ? isActive : existingTax.isActive,
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_TAX',
        description: `Updated tax: ${updatedTax.name}`,
        module: 'SETTINGS',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Tax updated successfully',
      data: updatedTax,
    })
  } catch (error) {
    console.error('Update tax error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const DELETE = requireRole(['ADMIN'])(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''

    // Check if tax exists
    const tax = await prisma.tax.findUnique({
      where: { id },
    })

    if (!tax) {
      return NextResponse.json(
        { error: 'Tax not found' },
        { status: 404 }
      )
    }

    // Instead of hard delete, deactivate the tax
    await prisma.tax.update({
      where: { id },
      data: {
        isActive: false,
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'DELETE_TAX',
        description: `Deactivated tax: ${tax.name}`,
        module: 'SETTINGS',
        severity: 'MEDIUM',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Tax deactivated successfully',
    })
  } catch (error) {
    console.error('Delete tax error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})