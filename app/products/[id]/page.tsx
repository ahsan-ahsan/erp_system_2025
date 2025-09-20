"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Edit, Trash2, Package, TrendingUp, BarChart3,
  Calendar, MapPin, Phone, Mail, ExternalLink
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("info")
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch real product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error("Failed to fetch product")
        const data = await res.json()
        setProduct(data.data)
      } catch (err: any) {
        setError(err.message || "Failed to load product details.")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id])

  const getStatusBadge = (status: string, stock: number) => {
    switch (status?.toLowerCase()) {
      case "in_stock":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            In Stock ({stock})
          </Badge>
        )
      case "low_stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Low Stock ({stock})
          </Badge>
        )
      case "out_of_stock":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Out of Stock
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-lg">Loading product details...</p>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    )
  }

  if (!product) return null

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                  <p className="text-muted-foreground">
                    SKU: {product.sku} • {product.category ?? "No Category"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" /> Edit Product
                </Button>
                <Button variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Product Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold">${product.price}</div>
                    <div className="text-sm text-muted-foreground">Cost: ${product.cost}</div>
                    {getStatusBadge(product.status, product.stock)}
                  </div>
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Stock Level:</span>
                      <span className="ml-2 font-medium">{product.stock} units</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created By:</span>
                      <span className="ml-2 font-medium">{product.createdBy?.firstName ?? "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs (Info / Inventory / Sales) */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Product Info</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="sales">Sales History</TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {product.specifications ?? "No specifications available."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <Card>
                <CardHeader><CardTitle>Inventory Movements</CardTitle></CardHeader>
                <CardContent>
                  {product.inventoryMovements?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.inventoryMovements.map((m: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell>{m.date}</TableCell>
                            <TableCell>{m.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No inventory records.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sales Tab */}
            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>No sales data yet.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Connect with sales API to display chart.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
