"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserCog, Shield, Users, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const roles = [
  {
    id: "admin",
    name: "Admin",
    description: "Full system access",
    icon: Shield,
    color: "bg-red-500",
  },
  {
    id: "manager",
    name: "Manager",
    description: "Management access",
    icon: UserCog,
    color: "bg-blue-500",
  },
  {
    id: "employee",
    name: "Employee",
    description: "Limited access",
    icon: Users,
    color: "bg-green-500",
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access",
    icon: Eye,
    color: "bg-gray-500",
  },
]

interface RoleSwitcherProps {
  currentRole: string
  onRoleChange: (role: string) => void
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const currentRoleData = roles.find(role => role.id === currentRole)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {currentRoleData && (
            <>
              <div className={`h-2 w-2 rounded-full ${currentRoleData.color}`} />
              <span className="capitalize">{currentRoleData.name}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.id}
            onClick={() => onRoleChange(role.id)}
            className="flex items-center gap-3"
          >
            <div className={`h-2 w-2 rounded-full ${role.color}`} />
            <div className="flex flex-col">
              <span className="font-medium">{role.name}</span>
              <span className="text-xs text-muted-foreground">{role.description}</span>
            </div>
            {currentRole === role.id && (
              <Badge variant="secondary" className="ml-auto text-xs">
                Current
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
