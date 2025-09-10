"use client"


import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  Download, 
  Filter, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Users,
  Package,
  DollarSign,
  RefreshCw,
  ChevronDown,
  ChevronRight
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { SalesReportChart } from "@/components/reports/sales-report-chart"
import { ProductReportChart } from "@/components/reports/product-report-chart"
import { InventoryValuationChart } from "@/components/reports/inventory-valuation-chart"
import { ReportFilters } from "@/components/reports/report-filters"
import { ReportExport } from "@/components/reports/report-export"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<string>("sales")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Mock data for reports
  const salesData = [
    { date: "2024-01-01", sales: 1200, orders: 15 },
    { date: "2024-01-02", sales: 1900, orders: 22 },
    { date: "2024-01-03", sales: 1500, orders: 18 },
    { date: "2024-01-04", sales: 2100, orders: 25 },
    { date: "2024-01-05", sales: 1800, orders: 20 },
    { date: "2024-01-06", sales: 2400, orders: 28 },
    { date: "2024-01-07", sales: 2200, orders: 26 }
  ]

  const productData = [
    { name: "Laptop Pro", sales: 45, revenue: 67500 },
    { name: "Wireless Mouse", sales: 120, revenue: 2400 },
    { name: "Mechanical Keyboard", sales: 80, revenue: 12000 },
    { name: "Monitor 24\"", sales: 35, revenue: 17500 },
    { name: "Webcam HD", sales: 60, revenue: 6000 }
  ]

  const inventoryData = [
    { name: "Electronics", value: 45000, color: "#8884d8" },
    { name: "Accessories", value: 25000, color: "#82ca9d" },
    { name: "Software", value: 15000, color: "#ffc658" },
    { name: "Office Supplies", value: 10000, color: "#ff7c7c" }
  ]

  const reportTypes = [
    {
      id: "sales",
      name: "Sales Report",
      description: "Revenue and order trends over time",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      id: "products",
      name: "Product Report",
      description: "Top performing products by sales",
      icon: Package,
      color: "text-green-600"
    },
    {
      id: "inventory",
      name: "Inventory Valuation",
      description: "Current inventory value by category",
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      id: "customers",
      name: "Customer Report",
      description: "Customer purchase patterns and loyalty",
      icon: Users,
      color: "text-orange-600"
    }
  ]

  const handleExport = (format: "csv" | "pdf") => {
    console.log(`Exporting ${selectedReport} report as ${format}`)
    // Implementation for export functionality
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
              <p className="text-muted-foreground">
                Analyze your business performance with comprehensive reports
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <ReportExport onExport={handleExport} />
            </div>
          </div>

          {/* Report Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Report Type</CardTitle>
              <CardDescription>
                Choose the type of report you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon
                  return (
                    <motion.div
                      key={report.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all ${
                          selectedReport === report.id 
                            ? "ring-2 ring-primary" 
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedReport(report.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Icon className={`h-8 w-8 ${report.color}`} />
                            <div>
                              <h3 className="font-semibold">{report.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {report.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Filters</CardTitle>
                      <CardDescription>
                        Customize your report data with filters
                      </CardDescription>
                    </div>
                    {isFiltersOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <ReportFilters
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                  />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Report Content */}
          <Tabs value={selectedReport} onValueChange={setSelectedReport}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Report</CardTitle>
                  <CardDescription>
                    Revenue and order trends from {format(dateRange?.from || new Date(), "MMM dd")} to {format(dateRange?.to || new Date(), "MMM dd, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesReportChart data={salesData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>
                    Top performing products by sales volume and revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductReportChart data={productData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Valuation</CardTitle>
                  <CardDescription>
                    Current inventory value distribution by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InventoryValuationChart data={inventoryData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Analysis</CardTitle>
                  <CardDescription>
                    Customer purchase patterns and loyalty metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Customer report coming soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
