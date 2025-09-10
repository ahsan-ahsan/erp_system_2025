import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''

    const payroll = await prisma.payroll.findUnique({
      where: { id },
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

    if (!payroll) {
      return NextResponse.json(
        { error: 'Payroll record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: payroll,
    })
  } catch (error) {
    console.error('Get payroll error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const PUT = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''
    
    const {
      basicSalary,
      allowances,
      deductions,
      overtime,
      bonus,
      status,
      payDate,
      workingDays,
    } = await request.json()

    // Check if payroll exists
    const existingPayroll = await prisma.payroll.findUnique({
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

    if (!existingPayroll) {
      return NextResponse.json(
        { error: 'Payroll record not found' },
        { status: 404 }
      )
    }

    // Calculate net salary if salary components are updated
    let netSalary: number = Number(existingPayroll.netSalary)
    if (basicSalary || allowances || deductions || overtime || bonus) {
      const newBasicSalary = basicSalary ? parseFloat(basicSalary) : Number(existingPayroll.basicSalary)
      const newAllowances = allowances !== undefined ? parseFloat(allowances) : Number(existingPayroll.allowances)
      const newDeductions = deductions !== undefined ? parseFloat(deductions) : Number(existingPayroll.deductions)
      const newOvertime = overtime !== undefined ? parseFloat(overtime) : Number(existingPayroll.overtime)
      const newBonus = bonus !== undefined ? parseFloat(bonus) : Number(existingPayroll.bonus)
      
      netSalary = newBasicSalary + newAllowances + newOvertime + newBonus - newDeductions
    }

    const updatedPayroll = await prisma.payroll.update({
      where: { id },
      data: {
        basicSalary: basicSalary ? parseFloat(basicSalary) : existingPayroll.basicSalary,
        allowances: allowances !== undefined ? parseFloat(allowances) : existingPayroll.allowances,
        deductions: deductions !== undefined ? parseFloat(deductions) : existingPayroll.deductions,
        overtime: overtime !== undefined ? parseFloat(overtime) : existingPayroll.overtime,
        bonus: bonus !== undefined ? parseFloat(bonus) : existingPayroll.bonus,
        netSalary,
        status: status?.toUpperCase() || existingPayroll.status,
        payDate: payDate ? new Date(payDate) : existingPayroll.payDate,
        workingDays: workingDays !== undefined ? parseInt(workingDays) : existingPayroll.workingDays,
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
        action: 'UPDATE_PAYROLL',
        description: `Updated payroll for: ${existingPayroll.employee.employeeId}`,
        module: 'HR',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Payroll updated successfully',
      data: updatedPayroll,
    })
  } catch (error) {
    console.error('Update payroll error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

