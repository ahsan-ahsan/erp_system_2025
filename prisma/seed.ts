import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

// Define role permissions based on typical ERP system access levels
const rolePermissions = {
  ADMIN: [
    // User Management
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'users.manage_roles',
    
    // Customer Management
    'customers.create',
    'customers.read',
    'customers.update',
    'customers.delete',
    
    // Supplier Management
    'suppliers.create',
    'suppliers.read',
    'suppliers.update',
    'suppliers.delete',
    
    // Product Management
    'products.create',
    'products.read',
    'products.update',
    'products.delete',
    'products.manage_categories',
    
    // Sales & POS
    'sales.create',
    'sales.read',
    'sales.update',
    'sales.delete',
    'sales.process_refunds',
    'pos.access',
    
    // Purchase Management
    'purchases.create',
    'purchases.read',
    'purchases.update',
    'purchases.delete',
    'purchases.approve',
    
    // Inventory Management
    'inventory.read',
    'inventory.update',
    'inventory.adjust',
    'inventory.transfer',
    
    // HR Management
    'hr.employees.create',
    'hr.employees.read',
    'hr.employees.update',
    'hr.employees.delete',
    'hr.attendance.manage',
    'hr.payroll.manage',
    
    // Reports & Analytics
    'reports.sales',
    'reports.products',
    'reports.inventory',
    'reports.customers',
    'reports.purchases',
    'reports.hr',
    'reports.financial',
    
    // System Settings
    'settings.general',
    'settings.invoice',
    'settings.taxes',
    'settings.backup',
    'settings.company',
    
    // System Administration
    'system.audit_logs',
    'system.backup',
    'system.maintenance',
    'system.notifications'
  ],
  
  MANAGER: [
    // User Management (limited)
    'users.read',
    'users.update',
    
    // Customer Management
    'customers.create',
    'customers.read',
    'customers.update',
    'customers.delete',
    
    // Supplier Management
    'suppliers.create',
    'suppliers.read',
    'suppliers.update',
    'suppliers.delete',
    
    // Product Management
    'products.create',
    'products.read',
    'products.update',
    'products.delete',
    'products.manage_categories',
    
    // Sales & POS
    'sales.create',
    'sales.read',
    'sales.update',
    'sales.delete',
    'sales.process_refunds',
    'pos.access',
    
    // Purchase Management
    'purchases.create',
    'purchases.read',
    'purchases.update',
    'purchases.delete',
    'purchases.approve',
    
    // Inventory Management
    'inventory.read',
    'inventory.update',
    'inventory.adjust',
    'inventory.transfer',
    
    // HR Management
    'hr.employees.create',
    'hr.employees.read',
    'hr.employees.update',
    'hr.attendance.manage',
    'hr.payroll.read',
    
    // Reports & Analytics
    'reports.sales',
    'reports.products',
    'reports.inventory',
    'reports.customers',
    'reports.purchases',
    'reports.hr',
    
    // System Settings (limited)
    'settings.general',
    'settings.invoice',
    'settings.taxes'
  ],
  
  EMPLOYEE: [
    // Customer Management (limited)
    'customers.create',
    'customers.read',
    'customers.update',
    
    // Product Management (read-only)
    'products.read',
    
    // Sales & POS
    'sales.create',
    'sales.read',
    'pos.access',
    
    // Purchase Management (read-only)
    'purchases.read',
    
    // Inventory Management (limited)
    'inventory.read',
    
    // HR Management (own data only)
    'hr.employees.read_own',
    'hr.attendance.read_own',
    'hr.payroll.read_own',
    
    // Reports (limited)
    'reports.sales',
    'reports.products'
  ],
  
  VIEWER: [
    // Read-only access to most modules
    'customers.read',
    'suppliers.read',
    'products.read',
    'sales.read',
    'purchases.read',
    'inventory.read',
    'hr.employees.read',
    'reports.sales',
    'reports.products',
    'reports.inventory',
    'reports.customers',
    'reports.purchases'
  ]
}

const roleDescriptions = {
  ADMIN: 'Full system access with all permissions. Can manage users, settings, and all system functions.',
  MANAGER: 'Management level access with most permissions except user role management and system administration.',
  EMPLOYEE: 'Standard employee access with limited permissions for daily operations.',
  VIEWER: 'Read-only access for viewing data and reports without modification capabilities.'
}

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // Seed roles based on UserRole enum
    for (const roleName of Object.values(UserRole)) {
      const permissions = rolePermissions[roleName as keyof typeof rolePermissions]
      const description = roleDescriptions[roleName as keyof typeof roleDescriptions]
      
      if (!permissions) {
        console.warn(`⚠️  No permissions defined for role: ${roleName}`)
        continue
      }
      
      // Use upsert to ensure idempotency
      const role = await prisma.role.upsert({
        where: { name: roleName },
        update: {
          description,
          permissions,
          updatedAt: new Date()
        },
        create: {
          name: roleName,
          description,
          permissions
        }
      })
      
      console.log(`✅ Role "${roleName}" seeded successfully with ${permissions.length} permissions`)
    }
    
    // Display summary
    const totalRoles = await prisma.role.count()
    console.log(`\n🎉 Seeding completed successfully!`)
    console.log(`📊 Total roles in database: ${totalRoles}`)
    
    // List all roles with their permission counts
    const allRoles = await prisma.role.findMany({
      select: {
        name: true,
        description: true,
        permissions: true
      }
    })
    
    console.log('\n📋 Role Summary:')
    allRoles.forEach(role => {
      console.log(`  • ${role.name}: ${role.permissions.length} permissions`)
      console.log(`    ${role.description}`)
    })
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('💥 Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  })
