import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const GET = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { employeeId: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { user: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        }},
      ]
    }

    if (department) {
      where.department = department
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    // Get total count
    const total = await prisma.employee.count({ where })

    // Get employees
    const employees = await prisma.employee.findMany({
      where,
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
        subordinates: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          }
        },
        _count: {
          select: { subordinates: true }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        employees,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get employees error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireRole(['ADMIN', 'MANAGER'])(async (request: NextRequest, user) => {
  try {
    const {
      userId,
      employeeId,
      position,
      department,
      managerId,
      hireDate,
      salary,
      skills,
      emergencyContact,
    } = await request.json()

    // Validate required fields
    if (!userId || !employeeId || !position || !department || !hireDate || !salary) {
      return NextResponse.json(
        { error: 'User ID, employee ID, position, department, hire date, and salary are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if employee ID already exists
    const employeeIdExists = await prisma.employee.findUnique({
      where: { employeeId },
    })

    if (employeeIdExists) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 409 }
      )
    }

    // Check if user already has an employee record
    const userHasEmployee = await prisma.employee.findUnique({
      where: { userId },
    })

    if (userHasEmployee) {
      return NextResponse.json(
        { error: 'User already has an employee record' },
        { status: 409 }
      )
    }

    const employee = await prisma.employee.create({
      data: {
        userId,
        employeeId,
        position,
        department,
        managerId,
        hireDate: new Date(hireDate),
        salary: parseFloat(salary),
        skills: skills || [],
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
        action: 'CREATE_EMPLOYEE',
        description: `Created employee record for: ${userExists.firstName} ${userExists.lastName}`,
        module: 'HR',
        severity: 'LOW',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    }, { status: 201 })
  } catch (error) {
    console.error('Create employee error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})