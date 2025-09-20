"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  Truck,
  Warehouse,
  HelpCircle,
  LogOut,
  UserCog,
  ChevronDown,
  ChevronRight,
  UserPlus,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { RoleGuard } from "@/components/auth/role-guard"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["manager", "employee", "viewer"],
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    roles: ["manager", "employee"],
    subItems: [
      { title: "All Products", url: "/products", roles: ["manager", "employee"] },
    ],
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
    roles: ["manager", "employee"],
    subItems: [
      { title: "All Customers", url: "/customers", roles: ["manager", "employee"] },
    ],
  },
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Truck,
    roles: ["manager", "employee"],
  },
  {
    title: "Purchases",
    url: "/purchases",
    icon: Package,
    roles: ["manager", "employee"],
    subItems: [
      { title: "Purchase Orders", url: "/purchases", roles: ["manager", "employee"] },
    ],
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Warehouse,
    roles: ["manager", "employee"],
    subItems: [
      { title: "Stock Overview", url: "/inventory", roles: ["manager", "employee"] },
    ],
  },
  {
    title: "Sales",
    url: "/sales",
    icon: ShoppingCart,
    roles: ["manager", "employee"],
    subItems: [
      { title: "Dashboard", url: "/sales/dashboard", roles: ["manager", "employee"] },
      { title: "POS", url: "/sales/pos", roles: ["manager", "employee"] },
      { title: "Transactions", url: "/sales/transactions", roles: ["manager", "employee"] },
    ],
  },
  {
    title: "HR Management",
    url: "/hr",
    icon: UserCheck,
    roles: ["manager", "hr"],
    subItems: [
      { title: "Employee Management", url: "/hr", roles: ["manager", "hr"] },
      { title: "Attendance", url: "/hr", roles: ["manager", "hr"] },
      { title: "Payroll", url: "/hr", roles: ["manager", "hr"] },
    ],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    roles: ["manager", "employee", "viewer"],
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserCog,
    roles: ["manager", "employee", "viewer"],
  },
  {
    title: "Demo",
    url: "/demo",
    icon: HelpCircle,
    roles: ["manager", "employee", "viewer"],
  },
]

const adminMenuItems = [
  {
    title: "User Management",
    url: "/users",
    icon: UserPlus,
    roles: ["admin"], // sirf admin ke liye
    subItems: [
      { title: "All Users", url: "/users", roles: ["admin"] },
      { title: "Roles & Permissions", url: "/users/roles", roles: ["admin"] },
    ],
  },
]

const bottomMenuItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["manager"],
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
    roles: ["manager", "employee", "viewer"],
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
    roles: ["manager", "employee", "viewer"],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems(prev => 
      prev.includes(itemTitle) 
        ? prev.filter(item => item !== itemTitle)
        : [...prev, itemTitle]
    )
  }

  const isExpanded = (itemTitle: string) => expandedItems.includes(itemTitle)

  const renderMenuItem = (item: any, index: number, delay: number = 0) => (
    <RoleGuard
      key={item.title}
      allowedRoles={item.roles}
      userRole={user?.role ? user.role.toLowerCase() : "viewer"}
      showTooltip={true}
      tooltipMessage={`${item.title} - Permission Required`}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: delay + index * 0.05 }}
      >
        <SidebarMenuItem>
          {item.subItems ? (
            <Collapsible
              open={isExpanded(item.title)}
              onOpenChange={() => toggleExpanded(item.title)}
            >
              <div className="flex items-center">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  className="flex-1"
                >
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {isExpanded(item.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.subItems.map((subItem: any) => (
                    <RoleGuard
                      key={subItem.title}
                      allowedRoles={subItem.roles}
                      userRole={user?.role ? user.role.toLowerCase() : "viewer"}
                      showTooltip={true}
                      tooltipMessage={`${subItem.title} - Permission Required`}
                    >
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.url}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </RoleGuard>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuButton
              asChild
              isActive={pathname === item.url}
              tooltip={item.title}
            >
              <Link href={item.url}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </motion.div>
    </RoleGuard>
  )

  return (
    <Sidebar variant="inset" className="h-screen">
      <SidebarHeader className="border-b">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ERP</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">ERP System</span>
            <span className="text-xs text-muted-foreground">v1.0.0</span>
          </div>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-2">
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item, index) => renderMenuItem(item, index, 0.1))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item, index) => renderMenuItem(item, index, 0.3))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomMenuItems.map((item, index) => renderMenuItem(item, index, 0.5))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="p-4"
        >
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : "JD"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user ? `${user.firstName} ${user.lastName}` : "John Doe"}
              </p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {user?.role || "Admin"}
              </p>
            </div>
          </div>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  )
}
