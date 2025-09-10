"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

// Mock data for customer profile
const mockCustomer = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  company: "Tech Solutions Inc",
  status: "active",
  totalOrders: 12,
  totalSpent: 2499.99,
  lastOrder: "2024-01-15",
  joinDate: "2023-06-15",
  location: "New York, NY",
  address: "123 Business Ave, Suite 100, New York, NY 10001",
  notes: "VIP customer with excellent payment history. Prefers premium products and fast shipping.",
  timeline: [
    {
      id: 1,
      type: "order",
      title: "Order #ORD-001 placed",
      description: "Wireless Headphones, Gaming Mouse",
      amount: 149.98,
      date: "2024-01-15",
      status: "completed",
      icon: Package
    },
    {
      id: 2,
      type: "payment",
      title: "Payment received",
      description: "Payment for Order #ORD-001",
      amount: 149.98,
      date: "2024-01-15",
      status: "completed",
      icon: CheckCircle
    },
    {
      id: 3,
      type: "order",
      title: "Order #ORD-002 placed",
      description: "Office Chair, Mechanical Keyboard",
      amount: 429.98,
      date: "2024-01-10",
      status: "shipped",
      icon: Package
    },
    {
      id: 4,
      type: "invoice",
      title: "Invoice #INV-003 sent",
      description: "Monthly subscription renewal",
      amount: 99.99,
      date: "2024-01-05",
      status: "pending",
      icon: FileText
    },
    {
      id: 5,
      type: "order",
      title: "Order #ORD-003 placed",
      description: "Standing Desk, Monitor Stand",
      amount: 599.99,
      date: "2023-12-20",
      status: "completed",
      icon: Package
    }
  ],
  recentOrders: [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "completed",
      items: 2,
      total: 149.98
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "shipped",
      items: 2,
      total: 429.98
    },
    {
      id: "ORD-003",
      date: "2023-12-20",
      status: "completed",
      items: 2,
      total: 599.99
    }
  ]
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
          Inactive
        </Badge>
      )
    default:
      return null
  }
}

const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      )
    case "shipped":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          <Package className="w-3 h-3 mr-1" />
          Shipped
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    default:
      return null
  }
}

const getTimelineIcon = (type: string, status: string) => {
  const IconComponent = mockCustomer.timeline.find(item => item.type === type)?.icon || Package
  
  switch (status) {
    case "completed":
      return <IconComponent className="w-4 h-4 text-green-600" />
    case "shipped":
      return <IconComponent className="w-4 h-4 text-blue-600" />
    case "pending":
      return <IconComponent className="w-4 h-4 text-yellow-600" />
    default:
      return <IconComponent className="w-4 h-4 text-gray-600" />
  }
}

export default function CustomerProfilePage() {
  const params = useParams()
  const router = useRouter()

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
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {mockCustomer.firstName} {mockCustomer.lastName}
                  </h1>
                  <p className="text-muted-foreground">
                    Customer since {new Date(mockCustomer.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Customer
                </Button>
                <Button variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Customer Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(mockCustomer.firstName, mockCustomer.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold">
                        {mockCustomer.firstName} {mockCustomer.lastName}
                      </div>
                      {getStatusBadge(mockCustomer.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Company</div>
                        <div className="font-medium">{mockCustomer.company}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Orders</div>
                        <div className="font-medium">{mockCustomer.totalOrders}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                        <div className="font-medium">${mockCustomer.totalSpent.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{mockCustomer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{mockCustomer.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{mockCustomer.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{mockCustomer.totalOrders}</div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">${mockCustomer.totalSpent.toFixed(0)}</div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round((Date.now() - new Date(mockCustomer.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <p className="text-sm text-muted-foreground">Days as Customer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        ${(mockCustomer.totalSpent / mockCustomer.totalOrders).toFixed(0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Recent customer activity and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCustomer.timeline.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getTimelineIcon(item.type, item.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-sm font-medium">${item.amount.toFixed(2)}</div>
                            {getOrderStatusBadge(item.status)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCustomer.recentOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.items} items • {new Date(order.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${order.total.toFixed(2)}</div>
                          {getOrderStatusBadge(order.status)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Customer Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Customer Notes</CardTitle>
                <CardDescription>Internal notes and observations about this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{mockCustomer.notes}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}