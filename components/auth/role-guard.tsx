"use client"

import { ReactNode } from "react"
import { Lock } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  userRole: any
  fallback?: ReactNode
  showTooltip?: boolean
  tooltipMessage?: string
}

export function RoleGuard({
  children,
  allowedRoles,
  userRole,
  fallback,
  showTooltip = true,
  tooltipMessage = "Permission Required"
}: RoleGuardProps) {
  // ✅ admin bypass
  const hasAccess = userRole === "admin" || allowedRoles.includes(userRole)

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  const disabledContent = (
    <div className="relative">
      <div className="pointer-events-none opacity-50 grayscale">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-background/80 p-2 shadow-lg">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-not-allowed">
              {disabledContent}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return disabledContent
}

// Hook for role-based access
export function useRoleAccess(userRole: string) {
  const hasRole = (roles: string[]) =>
    userRole === "admin" || roles.includes(userRole) // ✅ admin bypass

  const canAccess = (requiredRoles: string[]) => hasRole(requiredRoles)

  const isAdmin = userRole === "admin"
  const isManager = ["admin", "manager"].includes(userRole)
  const isEmployee = ["admin", "manager", "employee"].includes(userRole)

  return {
    hasRole,
    canAccess,
    isAdmin,
    isManager,
    isEmployee,
    userRole
  }
}
