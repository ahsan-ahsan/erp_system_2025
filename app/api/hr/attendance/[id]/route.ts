import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const PUT = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''
    
    const {
      checkIn,
      checkOut,
      status,
      notes,
    } = await request.json()

    // Check if attendance exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        },
      },
    })

    if (!existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      )
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: {
        checkIn: checkIn ? new Date(checkIn) : existingAttendance.checkIn,
        checkOut: checkOut ? new Date(checkOut) : existingAttendance.checkOut,
        status: status?.toUpperCase() || existingAttendance.status,
        notes,
      },
      include: {
        employee: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        },
        user: {
          select: { firstName: true, lastName: true }
        },
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_ATTENDANCE',
        description: `Updated attendance for: ${existingAttendance.employee.employeeId}`,
        module: 'HR',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Attendance updated successfully',
      data: updatedAttendance,
    })
  } catch (error) {
    console.error('Update attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})