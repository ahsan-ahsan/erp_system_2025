import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const employeeId = searchParams.get('employeeId') || ''
    const status = searchParams.get('status') || ''
    const payPeriod = searchParams.get('payPeriod') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (employeeId) {
      where.employeeId = employeeId
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    if (payPeriod) {
      where.payPeriod = payPeriod
    }

    // Get total count
    const total = await prisma.payroll.count({ where })

    // Get payroll records
    const payroll = await prisma.payroll.findMany({
      where,
      include: {
        employee: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        },
        user: {
          select: { firstName: true, lastName: true }
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        payroll,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get payroll error:', error)
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
      basicSalary,
      allowances,
      deductions,
      overtime,
      bonus,
      payPeriod,
      workingDays,
    } = await request.json()

    // Validate required fields
    if (!employeeId || !basicSalary || !payPeriod) {
      return NextResponse.json(
        { error: 'Employee ID, basic salary, and pay period are required' },
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

    // Calculate net salary
    const netSalary = parseFloat(basicSalary) + 
                     (parseFloat(allowances) || 0) + 
                     (parseFloat(overtime) || 0) + 
                     (parseFloat(bonus) || 0) - 
                     (parseFloat(deductions) || 0)

    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        userId: user.userId,
        basicSalary: parseFloat(basicSalary),
        allowances: parseFloat(allowances) || 0,
        deductions: parseFloat(deductions) || 0,
        overtime: parseFloat(overtime) || 0,
        bonus: parseFloat(bonus) || 0,
        netSalary,
        payPeriod,
        workingDays: parseInt(workingDays) || 0,
        status: 'PENDING',
      },
      include: {
        employee: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
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
        action: 'CREATE_PAYROLL',
        description: `Created payroll for: ${employee.employeeId}`,
        module: 'HR',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Payroll created successfully',
      data: payroll,
    }, { status: 201 })
  } catch (error) {
    console.error('Create payroll error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
