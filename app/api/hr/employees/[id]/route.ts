import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() || ''

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
            address: true,
          }
        },
        manager: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        },
        subordinates: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        payroll: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: employee,
    })
  } catch (error) {
    console.error('Get employee error:', error)
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
      position,
      department,
      managerId,
      salary,
      status,
      skills,
      emergencyContact,
    } = await request.json()

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        position,
        department,
        managerId,
        salary: salary ? parseFloat(salary) : undefined,
        status: status?.toUpperCase(),
        skills: skills || existingEmployee.skills,
        emergencyContact,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
          }
        },
        manager: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        },
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_EMPLOYEE',
        description: `Updated employee: ${existingEmployee.user.firstName} ${existingEmployee.user.lastName}`,
        module: 'HR',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    })
  } catch (error) {
    console.error('Update employee error:', error)
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

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Instead of hard delete, set status to TERMINATED
    await prisma.employee.update({
      where: { id },
      data: {
        status: 'TERMINATED',
      },
    })

    // Also update user status
    await prisma.user.update({
      where: { id: employee.userId },
      data: {
        status: 'TERMINATED',
      },
    })

    // Log activity
    await prisma.userActivityLog.create({
      data: {
        userId: user.userId,
        action: 'TERMINATE_EMPLOYEE',
        description: `Terminated employee: ${employee.user.firstName} ${employee.user.lastName}`,
        module: 'HR',
        severity: 'HIGH',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Employee terminated successfully',
    })
  } catch (error) {
    console.error('Delete employee error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})