import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const settings = await prisma.invoiceSettings.findFirst()

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.invoiceSettings.create({
        data: {
          prefix: 'INV',
          numberFormat: 'INV-{YYYY}-{MM}-{####}',
          nextNumber: 1001,
          showTax: true,
          showDiscount: true,
          showShipping: true,
          currency: 'USD',
          currencySymbol: '$',
          decimalPlaces: 2,
        },
      })

      return NextResponse.json({
        success: true,
        data: defaultSettings,
      })
    }

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Get invoice settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const PUT = requireRole(['ADMIN'])(async (request: NextRequest, user) => {
  try {
    const {
      prefix,
      numberFormat,
      nextNumber,
      footerText,
      terms,
      logo,
      showLogo,
      showTax,
      showDiscount,
      showShipping,
      currency,
      currencySymbol,
      decimalPlaces,
    } = await request.json()

    // Get existing settings or create if none exist
    let settings = await prisma.invoiceSettings.findFirst()

    if (!settings) {
      settings = await prisma.invoiceSettings.create({
        data: {
          prefix: prefix || 'INV',
          numberFormat: numberFormat || 'INV-{YYYY}-{MM}-{####}',
          nextNumber: nextNumber || 1001,
          footerText,
          terms,
          logo,
          showLogo: showLogo !== undefined ? showLogo : true,
          showTax: showTax !== undefined ? showTax : true,
          showDiscount: showDiscount !== undefined ? showDiscount : true,
          showShipping: showShipping !== undefined ? showShipping : true,
          currency: currency || 'USD',
          currencySymbol: currencySymbol || '$',
          decimalPlaces: decimalPlaces || 2,
        },
      })
    } else {
      settings = await prisma.invoiceSettings.update({
        where: { id: settings.id },
        data: {
          prefix,
          numberFormat,
          nextNumber,
          footerText,
          terms,
          logo,
          showLogo,
          showTax,
          showDiscount,
          showShipping,
          currency,
          currencySymbol,
          decimalPlaces,
        },
      })
    }

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_INVOICE_SETTINGS',
        description: 'Updated invoice settings',
        module: 'SETTINGS',
        severity: 'MEDIUM',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Invoice settings updated successfully',
      data: settings,
    })
  } catch (error) {
    console.error('Update invoice settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})