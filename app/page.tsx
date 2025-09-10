"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ShoppingCart,
  UserPlus,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { RoleSwitcher } from "@/components/auth/role-switcher"
import { useAuth } from "@/components/auth/auth-context"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { FloatingActionButton } from "@/components/dashboard/floating-action-button"

// Dashboard Cards Data
const dashboardStats = [
  {
    title: "Sales Today",
    value: "$12,345",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "from yesterday",
    emoji: "💰"
  },
  {
    title: "Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive" as const,
    icon: BarChart3,
    description: "this month",
    emoji: "📊"
  },
  {
    title: "New Customers",
    value: "89",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: Users,
    description: "this week",
    emoji: "👥"
  },
  {
    title: "Low Stock",
    value: "12",
    change: "-3 items",
    changeType: "negative" as const,
    icon: AlertTriangle,
    description: "need restocking",
    emoji: "⚠️"
  }
]

export default function Home() {
  const { user, updateUser } = useAuth()

  const handleRoleChange = (newRole: string) => {
    if (user) {
      updateUser({ role: newRole as any })
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your business today.
                </p>
              </div>
              <RoleSwitcher 
                currentRole={user?.role || "viewer"} 
                onRoleChange={handleRoleChange}
              />
            </div>
          </motion.div>

          {/* Dashboard Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">{stat.emoji}</span>
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      {stat.changeType === "positive" ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span className={stat.changeType === "positive" ? "text-green-500" : "text-red-500"}>
                        {stat.change}
                      </span>
                      <span>{stat.description}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <DashboardCharts />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and activities in your system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New order received", time: "2 minutes ago", type: "order" },
                    { action: "Product stock updated", time: "15 minutes ago", type: "inventory" },
                    { action: "Payment processed", time: "1 hour ago", type: "payment" },
                    { action: "New customer registered", time: "2 hours ago", type: "customer" },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                          {activity.type}
                        </Badge>
                        <span className="text-sm">{activity.action}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton />
      </MainLayout>
    </ProtectedRoute>
  )
}
