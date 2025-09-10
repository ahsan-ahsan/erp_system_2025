import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const employeeId = searchParams.get('employeeId') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (employeeId) {
      where.employeeId = employeeId
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    // Get total count
    const total = await prisma.attendance.count({ where })

    // Get attendance records
    const attendance = await prisma.attendance.findMany({
      where,
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
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        attendance,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const {
      employeeId,
      date,
      checkIn,
      checkOut,
      status,
      notes,
    } = await request.json()

    // Validate required fields
    if (!employeeId || !date || !status) {
      return NextResponse.json(
        { error: 'Employee ID, date, and status are required' },
        { status: 400 }
      )
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(date),
        },
      },
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance already recorded for this date' },
        { status: 409 }
      )
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        userId: user.userId,
        date: new Date(date),
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        status: status.toUpperCase(),
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
        action: 'CREATE_ATTENDANCE',
        description: `Recorded attendance for: ${employee.employeeId}`,
        module: 'HR',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Attendance recorded successfully',
      data: attendance,
    }, { status: 201 })
  } catch (error) {
    console.error('Create attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})