
## Summary

I've created a comprehensive Prisma seed file that:

1. **Creates default roles** based on your `UserRole` enum (ADMIN, MANAGER, EMPLOYEE, VIEWER)
2. **Assigns granular permissions** to each role based on typical ERP system access levels
3. **Is idempotent** - uses `upsert` operations to prevent duplicates when run multiple times
4. **Includes detailed permissions** for all major modules (users, customers, suppliers, products, sales, purchases, inventory, HR, reports, settings)
5. **Provides clear role descriptions** for each role level

### Key Features:

- **ADMIN**: Full system access with all permissions including user management and system administration
- **MANAGER**: Management level access with most permissions except user role management
- **EMPLOYEE**: Standard employee access with limited permissions for daily operations
- **VIEWER**: Read-only access for viewing data and reports

### To use the seed:

1. Install the `tsx` dependency: `pnpm add tsx`
2. Run the seed: `pnpm db:seed`
3. Or reset and seed: `pnpm db:reset`

The seed file is designed to be easily extensible - you can add new roles to the enum and new permissions to the role definitions as your system grows.

