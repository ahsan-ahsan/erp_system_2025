"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Package,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Receipt,
  Scan,
  Calculator
} from "lucide-react"
import { useRouter } from "next/navigation"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SalesAnalytics } from "@/components/pos/sales-analytics"
import { QuickActions } from "@/components/pos/quick-actions"
import { POSSettings } from "@/components/pos/pos-settings"

export default function SalesDashboardPage() {
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)

  // Mock data for dashboard
  const todayStats = {
    sales: 2847.50,
    transactions: 47,
    customers: 32,
    averageOrder: 60.58
  }

  const recentTransactions = [
    { id: "TXN-001", customer: "John Doe", amount: 127.50, time: "2 min ago", status: "completed" },
    { id: "TXN-002", customer: "Sarah Johnson", amount: 89.99, time: "5 min ago", status: "completed" },
    { id: "TXN-003", customer: "Mike Wilson", amount: 299.99, time: "8 min ago", status: "completed" },
    { id: "TXN-004", customer: "Walk-in Customer", amount: 45.50, time: "12 min ago", status: "completed" },
    { id: "TXN-005", customer: "Lisa Brown", amount: 156.75, time: "15 min ago", status: "completed" }
  ]

  const quickActions = [
    {
      icon: ShoppingCart,
      label: "Start POS",
      description: "Open point of sale",
      action: () => router.push("/sales/pos"),
      color: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
    },
    {
      icon: BarChart3,
      label: "View Reports",
      description: "Sales analytics",
      action: () => router.push("/reports/sales"),
      color: "bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
    },
    {
      icon: Clock,
      label: "Transactions",
      description: "View transaction history",
      action: () => router.push("/sales/transactions"),
      color: "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800"
    },
    {
      icon: Users,
      label: "Customers",
      description: "Manage customers",
      action: () => router.push("/customers"),
      color: "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800"
    },
    {
      icon: Package,
      label: "Products",
      description: "Manage inventory",
      action: () => router.push("/products"),
      color: "bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800"
    },
    {
      icon: Settings,
      label: "Settings",
      description: "POS configuration",
      action: () => setShowSettings(true),
      color: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
      case "refunded":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
                <p className="text-muted-foreground">
                  Overview of your sales performance and POS system
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={() => router.push("/sales/pos")}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Open POS
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${todayStats.sales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.transactions}</div>
                <p className="text-xs text-muted-foreground">
                  +8% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.customers}</div>
                <p className="text-xs text-muted-foreground">
                  +5% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${todayStats.averageOrder.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +3% from yesterday
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common POS operations and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      >
                        <Button
                          onClick={action.action}
                          variant="outline"
                          className={`w-full h-auto p-4 flex flex-col items-center space-y-2 ${action.color}`}
                        >
                          <action.icon className="w-6 h-6" />
                          <div className="text-center">
                            <div className="font-medium text-sm">{action.label}</div>
                            <div className="text-xs text-muted-foreground">{action.description}</div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>
                        Latest POS transactions
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push("/sales/transactions")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <div>
                            <div className="text-sm font-medium">{transaction.customer}</div>
                            <div className="text-xs text-muted-foreground">{transaction.time}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium">${transaction.amount}</div>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <SalesAnalytics 
              currentSales={todayStats.sales}
              currentTransactions={todayStats.transactions}
              currentCustomers={todayStats.customers}
              targetSales={10000}
            />
          </motion.div>
        </div>

        {/* Settings Dialog */}
        <POSSettings 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </MainLayout>
    </ProtectedRoute>
  )
}
