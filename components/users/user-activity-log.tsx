"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Clock, 
  User, 
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  LogIn, 
  LogOut,
  Key,
  Settings,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ActivityLog {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  action: string
  description: string
  timestamp: string
  ipAddress: string
  userAgent: string
  severity: "low" | "medium" | "high"
  module: string
}

interface UserActivityLogProps {
  activities: ActivityLog[]
  onFilterChange: (filters: any) => void
}

export function UserActivityLog({ activities, onFilterChange }: UserActivityLogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "login":
        return <LogIn className="h-4 w-4 text-green-600" />
      case "logout":
        return <LogOut className="h-4 w-4 text-gray-600" />
      case "create":
        return <User className="h-4 w-4 text-blue-600" />
      case "update":
        return <Edit className="h-4 w-4 text-yellow-600" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />
      case "permission":
        return <Key className="h-4 w-4 text-purple-600" />
      case "settings":
        return <Settings className="h-4 w-4 text-gray-600" />
      default:
        return <Eye className="h-4 w-4 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || activity.severity === severityFilter
    const matchesModule = moduleFilter === "all" || activity.module === moduleFilter
    
    return matchesSearch && matchesSeverity && matchesModule
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Activity Log</h2>
          <p className="text-muted-foreground">
            Monitor user activities and system access across your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Real-time
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Module</label>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All modules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log ({filteredActivities.length})</CardTitle>
          <CardDescription>
            Recent user activities and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                    <AvatarFallback>
                      {activity.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(activity.action)}
                      <span className="font-medium">{activity.userName}</span>
                      <Badge className={getSeverityColor(activity.severity)}>
                        {activity.severity}
                      </Badge>
                      <Badge variant="outline">
                        {activity.module}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>IP: {activity.ipAddress}</span>
                    <span>•</span>
                    <span className="truncate max-w-xs">
                      {activity.userAgent}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

