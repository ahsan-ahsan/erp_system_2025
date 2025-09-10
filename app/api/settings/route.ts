import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const settings = await prisma.companySettings.findFirst()

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.companySettings.create({
        data: {
          name: 'Your Company',
          email: 'admin@yourcompany.com',
          phone: '',
          address: '',
          website: '',
          description: '',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          language: 'en',
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
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const PUT = requireRole(['ADMIN'])(async (request: NextRequest, user) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      website,
      description,
      logo,
      timezone,
      dateFormat,
      timeFormat,
      language,
      currency,
      currencySymbol,
      decimalPlaces,
      notifications,
      emailNotifications,
      smsNotifications,
      maintenanceMode,
    } = await request.json()

    // Get existing settings or create if none exist
    let settings = await prisma.companySettings.findFirst()

    if (!settings) {
      settings = await prisma.companySettings.create({
        data: {
          name: name || 'Your Company',
          email: email || 'admin@yourcompany.com',
          phone: phone || '',
          address: address || '',
          website: website || '',
          description: description || '',
          logo: logo || '',
          timezone: timezone || 'America/New_York',
          dateFormat: dateFormat || 'MM/DD/YYYY',
          timeFormat: timeFormat || '12h',
          language: language || 'en',
          currency: currency || 'USD',
          currencySymbol: currencySymbol || '$',
          decimalPlaces: decimalPlaces || 2,
          notifications: notifications !== undefined ? notifications : true,
          emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
          smsNotifications: smsNotifications !== undefined ? smsNotifications : false,
          maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : false,
        },
      })
    } else {
      settings = await prisma.companySettings.update({
        where: { id: settings.id },
        data: {
          name,
          email,
          phone,
          address,
          website,
          description,
          logo,
          timezone,
          dateFormat,
          timeFormat,
          language,
          currency,
          currencySymbol,
          decimalPlaces,
          notifications,
          emailNotifications,
          smsNotifications,
          maintenanceMode,
        },
      })
    }

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_SETTINGS',
        description: 'Updated company settings',
        module: 'SETTINGS',
        severity: 'MEDIUM',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})