"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Key,
  Settings,
  ArrowLeft
} from "lucide-react"
import { useRouter } from "next/navigation"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RolePermissionsMatrix } from "@/components/users/role-permissions-matrix"

export default function UserRolesPage() {
  const router = useRouter()

  // Mock data
  const roles = [
    {
      id: "admin",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: ["users.create", "users.read", "users.update", "users.delete", "products.create", "products.read", "products.update", "products.delete", "sales.create", "sales.read", "sales.update", "sales.delete", "inventory.create", "inventory.read", "inventory.update", "inventory.delete", "reports.read", "reports.export"]
    },
    {
      id: "manager",
      name: "Manager",
      description: "Department management access with limited permissions",
      permissions: ["users.read", "products.create", "products.read", "products.update", "sales.create", "sales.read", "sales.update", "inventory.read", "reports.read"]
    },
    {
      id: "user",
      name: "User",
      description: "Basic user access with read-only permissions",
      permissions: ["products.read", "sales.read", "inventory.read"]
    }
  ]

  const permissions = [
    // Users module
    { id: "users.create", name: "Create Users", description: "Create new user accounts", module: "Users" },
    { id: "users.read", name: "View Users", description: "View user information and lists", module: "Users" },
    { id: "users.update", name: "Edit Users", description: "Modify user information and settings", module: "Users" },
    { id: "users.delete", name: "Delete Users", description: "Remove user accounts from the system", module: "Users" },
    
    // Products module
    { id: "products.create", name: "Create Products", description: "Add new products to inventory", module: "Products" },
    { id: "products.read", name: "View Products", description: "View product information and lists", module: "Products" },
    { id: "products.update", name: "Edit Products", description: "Modify product information and settings", module: "Products" },
    { id: "products.delete", name: "Delete Products", description: "Remove products from inventory", module: "Products" },
    
    // Sales module
    { id: "sales.create", name: "Create Sales", description: "Process new sales transactions", module: "Sales" },
    { id: "sales.read", name: "View Sales", description: "View sales data and reports", module: "Sales" },
    { id: "sales.update", name: "Edit Sales", description: "Modify sales transactions", module: "Sales" },
    { id: "sales.delete", name: "Delete Sales", description: "Remove sales transactions", module: "Sales" },
    
    // Inventory module
    { id: "inventory.create", name: "Create Inventory", description: "Add inventory items and adjustments", module: "Inventory" },
    { id: "inventory.read", name: "View Inventory", description: "View inventory levels and movements", module: "Inventory" },
    { id: "inventory.update", name: "Edit Inventory", description: "Modify inventory levels and settings", module: "Inventory" },
    { id: "inventory.delete", name: "Delete Inventory", description: "Remove inventory items", module: "Inventory" },
    
    // Reports module
    { id: "reports.read", name: "View Reports", description: "Access to reports and analytics", module: "Reports" },
    { id: "reports.export", name: "Export Reports", description: "Export reports to various formats", module: "Reports" }
  ]

  const handlePermissionChange = (roleId: string, permissionId: string, granted: boolean) => {
    console.log(`Permission ${permissionId} ${granted ? 'granted' : 'revoked'} for role ${roleId}`)
    // Implementation for permission change
  }

  const handleRoleCreate = (role: any) => {
    console.log("Creating new role:", role)
    // Implementation for role creation
  }

  const handleRoleUpdate = (roleId: string, role: any) => {
    console.log("Updating role:", roleId, role)
    // Implementation for role update
  }

  const handleRoleDelete = (roleId: string) => {
    console.log("Deleting role:", roleId)
    // Implementation for role deletion
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
                <p className="text-muted-foreground">
                  Configure user roles and permissions across your system
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Role Permissions Matrix */}
          <RolePermissionsMatrix
            roles={roles}
            permissions={permissions}
            onPermissionChange={handlePermissionChange}
            onRoleCreate={handleRoleCreate}
            onRoleUpdate={handleRoleUpdate}
            onRoleDelete={handleRoleDelete}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

