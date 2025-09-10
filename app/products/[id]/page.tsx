"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  TrendingUp, 
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Mock data for product detail
const mockProduct = {
  id: 1,
  name: "Wireless Headphones",
  sku: "WH-001",
  category: "Electronics",
  price: 99.99,
  cost: 65.00,
  stock: 150,
  status: "in_stock",
  description: "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
  specifications: {
    brand: "TechCorp",
    model: "TC-WH-001",
    weight: "250g",
    batteryLife: "30 hours",
    connectivity: "Bluetooth 5.0",
    color: "Black"
  },
  supplier: {
    name: "TechCorp Industries",
    contact: "John Smith",
    email: "john@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley, CA 94025"
  },
  inventory: {
    totalStock: 150,
    reserved: 25,
    available: 125,
    reorderPoint: 50,
    reorderQuantity: 200,
    lastRestocked: "2024-01-10",
    locations: [
      { warehouse: "Main Warehouse", quantity: 100 },
      { warehouse: "Retail Store A", quantity: 30 },
      { warehouse: "Retail Store B", quantity: 20 }
    ]
  },
  salesHistory: [
    { month: "Jan", sales: 45, revenue: 4499.55 },
    { month: "Feb", sales: 52, revenue: 5199.48 },
    { month: "Mar", sales: 38, revenue: 3799.62 },
    { month: "Apr", sales: 61, revenue: 6099.39 },
    { month: "May", sales: 49, revenue: 4899.51 },
    { month: "Jun", sales: 55, revenue: 5499.45 }
  ],
  recentTransactions: [
    { id: 1, type: "Sale", quantity: -2, date: "2024-01-15", reference: "ORD-001" },
    { id: 2, type: "Restock", quantity: +50, date: "2024-01-10", reference: "PO-123" },
    { id: 3, type: "Sale", quantity: -1, date: "2024-01-08", reference: "ORD-002" },
    { id: 4, type: "Return", quantity: +1, date: "2024-01-05", reference: "RET-001" }
  ]
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("info")

  const getStatusBadge = (status: string, stock: number) => {
    switch (status) {
      case "in_stock":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            In Stock ({stock})
          </Badge>
        )
      case "low_stock":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Low Stock ({stock})
          </Badge>
        )
      case "out_of_stock":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Out of Stock
          </Badge>
        )
      default:
        return null
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
                  <h1 className="text-3xl font-bold tracking-tight">{mockProduct.name}</h1>
                  <p className="text-muted-foreground">
                    SKU: {mockProduct.sku} • {mockProduct.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
                <Button variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Product Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold">${mockProduct.price}</div>
                      <div className="text-sm text-muted-foreground">Cost: ${mockProduct.cost}</div>
                      {getStatusBadge(mockProduct.status, mockProduct.stock)}
                    </div>
                    <p className="text-muted-foreground">{mockProduct.description}</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Supplier:</span>
                        <span className="ml-2 font-medium">{mockProduct.supplier.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stock Level:</span>
                        <span className="ml-2 font-medium">{mockProduct.stock} units</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabbed Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Product Info</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="sales">Sales History</TabsTrigger>
              </TabsList>

              {/* Product Info Tab */}
              <TabsContent value="info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(mockProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Supplier Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">{mockProduct.supplier.name}</h4>
                          <p className="text-sm text-muted-foreground">Contact: {mockProduct.supplier.contact}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{mockProduct.supplier.email}</span>
                            <Button variant="ghost" size="sm" className="h-auto p-0 ml-auto">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{mockProduct.supplier.phone}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span className="text-sm">{mockProduct.supplier.address}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stock Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total Stock:</span>
                          <span className="font-bold text-lg">{mockProduct.inventory.totalStock}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Reserved:</span>
                          <span className="font-medium">{mockProduct.inventory.reserved}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Available:</span>
                          <span className="font-medium text-green-600">{mockProduct.inventory.available}</span>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Stock Level</span>
                            <span>{Math.round((mockProduct.inventory.available / mockProduct.inventory.reorderPoint) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(mockProduct.inventory.available / mockProduct.inventory.reorderPoint) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Reorder Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reorder Point:</span>
                          <span className="font-medium">{mockProduct.inventory.reorderPoint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reorder Quantity:</span>
                          <span className="font-medium">{mockProduct.inventory.reorderQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Restocked:</span>
                          <span className="font-medium">{mockProduct.inventory.lastRestocked}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockProduct.recentTransactions.slice(0, 4).map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between text-sm">
                            <div>
                              <div className="font-medium">{transaction.type}</div>
                              <div className="text-muted-foreground">{transaction.date}</div>
                            </div>
                            <div className={`font-medium ${transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Stock Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Warehouse</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockProduct.inventory.locations.map((location, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{location.warehouse}</TableCell>
                            <TableCell>{location.quantity}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress 
                                  value={(location.quantity / mockProduct.inventory.totalStock) * 100} 
                                  className="flex-1 h-2"
                                />
                                <span className="text-sm text-muted-foreground">
                                  {Math.round((location.quantity / mockProduct.inventory.totalStock) * 100)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sales History Tab */}
              <TabsContent value="sales" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5" />
                        <span>Total Sales</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {mockProduct.salesHistory.reduce((sum, item) => sum + item.sales, 0)}
                      </div>
                      <p className="text-muted-foreground text-sm">Last 6 months</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5" />
                        <span>Total Revenue</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${mockProduct.salesHistory.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}
                      </div>
                      <p className="text-muted-foreground text-sm">Last 6 months</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span>Avg. Monthly Sales</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round(mockProduct.salesHistory.reduce((sum, item) => sum + item.sales, 0) / mockProduct.salesHistory.length)}
                      </div>
                      <p className="text-muted-foreground text-sm">Units per month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                    <CardDescription>Monthly sales performance over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProduct.salesHistory}>
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="var(--color-sales)" 
                            strokeWidth={2}
                            dot={{ fill: "var(--color-sales)", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
