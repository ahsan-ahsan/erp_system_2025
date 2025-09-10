"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// Mock data for inventory
const mockInventory = [
  {
    id: 1,
    name: "Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    currentStock: 15,
    minStock: 20,
    maxStock: 100,
    status: "low_stock",
    cost: 65.00,
    price: 99.99,
    supplier: "TechCorp",
    lastUpdated: "2024-01-15",
    movements: [
      { id: 1, type: "sale", quantity: -2, date: "2024-01-15", reference: "TXN-001", user: "John Doe" },
      { id: 2, type: "purchase", quantity: +50, date: "2024-01-10", reference: "PO-001", user: "Jane Smith" },
      { id: 3, type: "adjustment", quantity: -1, date: "2024-01-08", reference: "ADJ-001", user: "Mike Wilson" },
      { id: 4, type: "return", quantity: +1, date: "2024-01-05", reference: "RET-001", user: "Sarah Johnson" }
    ]
  },
  {
    id: 2,
    name: "Gaming Mouse",
    sku: "GM-002",
    category: "Electronics",
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    status: "low_stock",
    cost: 25.00,
    price: 49.99,
    supplier: "GameTech",
    lastUpdated: "2024-01-14",
    movements: [
      { id: 1, type: "sale", quantity: -1, date: "2024-01-14", reference: "TXN-002", user: "John Doe" },
      { id: 2, type: "purchase", quantity: +25, date: "2024-01-08", reference: "PO-002", user: "Jane Smith" }
    ]
  },
  {
    id: 3,
    name: "Office Chair",
    sku: "OC-003",
    category: "Furniture",
    currentStock: 0,
    minStock: 5,
    maxStock: 25,
    status: "out_of_stock",
    cost: 200.00,
    price: 299.99,
    supplier: "FurniCorp",
    lastUpdated: "2024-01-13",
    movements: [
      { id: 1, type: "sale", quantity: -1, date: "2024-01-13", reference: "TXN-003", user: "John Doe" },
      { id: 2, type: "purchase", quantity: +10, date: "2024-01-05", reference: "PO-003", user: "Jane Smith" }
    ]
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    sku: "MK-004",
    category: "Electronics",
    currentStock: 45,
    minStock: 20,
    maxStock: 80,
    status: "in_stock",
    cost: 80.00,
    price: 129.99,
    supplier: "TechCorp",
    lastUpdated: "2024-01-12",
    movements: [
      { id: 1, type: "sale", quantity: -3, date: "2024-01-12", reference: "TXN-004", user: "John Doe" },
      { id: 2, type: "purchase", quantity: +30, date: "2024-01-08", reference: "PO-004", user: "Jane Smith" }
    ]
  },
  {
    id: 5,
    name: "Standing Desk",
    sku: "SD-005",
    category: "Furniture",
    currentStock: 8,
    minStock: 5,
    maxStock: 20,
    status: "low_stock",
    cost: 350.00,
    price: 499.99,
    supplier: "FurniCorp",
    lastUpdated: "2024-01-11",
    movements: [
      { id: 1, type: "sale", quantity: -2, date: "2024-01-11", reference: "TXN-005", user: "John Doe" },
      { id: 2, type: "purchase", quantity: +15, date: "2024-01-05", reference: "PO-005", user: "Jane Smith" }
    ]
  }
]

const getStatusBadge = (status: string, currentStock: number, minStock: number) => {
  switch (status) {
    case "in_stock":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          In Stock ({currentStock})
        </Badge>
      )
    case "low_stock":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <AlertTriangle className="w-3 h-3 mr-1 animate-pulse" />
          Low Stock ({currentStock})
        </Badge>
      )
    case "out_of_stock":
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          Out of Stock
        </Badge>
      )
    default:
      return null
  }
}

const getMovementIcon = (type: string) => {
  switch (type) {
    case "sale":
      return <TrendingDown className="w-4 h-4 text-red-500" />
    case "purchase":
      return <TrendingUp className="w-4 h-4 text-green-500" />
    case "adjustment":
      return <RefreshCw className="w-4 h-4 text-blue-500" />
    case "return":
      return <RefreshCw className="w-4 h-4 text-purple-500" />
    default:
      return <Package className="w-4 h-4 text-gray-500" />
  }
}

const getMovementColor = (type: string) => {
  switch (type) {
    case "sale":
      return "text-red-600"
    case "purchase":
      return "text-green-600"
    case "adjustment":
      return "text-blue-600"
    case "return":
      return "text-purple-600"
    default:
      return "text-gray-600"
  }
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const itemsPerPage = 10

  // Filter and sort inventory
  const filteredInventory = useMemo(() => {
    let filtered = mockInventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      
      return matchesSearch && matchesStatus && matchesCategory
    })

    // Sort inventory
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a]
      let bValue = b[sortBy as keyof typeof b]
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchTerm, selectedStatus, selectedCategory, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage)
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedInventory.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    }
  }

  const toggleRowExpansion = (itemId: number) => {
    if (expandedRows.includes(itemId)) {
      setExpandedRows(expandedRows.filter(id => id !== itemId))
    } else {
      setExpandedRows([...expandedRows, itemId])
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const categories = [...new Set(mockInventory.map(item => item.category))]
  const statuses = [...new Set(mockInventory.map(item => item.status))]

  // Calculate stock level percentage
  const getStockLevel = (current: number, min: number, max: number) => {
    if (current <= min) return 0
    if (current >= max) return 100
    return ((current - min) / (max - min)) * 100
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
                <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                <p className="text-muted-foreground">
                  Track stock levels and manage inventory movements.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stock
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Low Stock Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                  <span>Low Stock Alerts</span>
                </CardTitle>
                <CardDescription className="text-yellow-700 dark:text-yellow-300">
                  {mockInventory.filter(item => item.status === "low_stock" || item.status === "out_of_stock").length} items need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockInventory
                    .filter(item => item.status === "low_stock" || item.status === "out_of_stock")
                    .slice(0, 3)
                    .map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border"
                      >
                        <div className="flex items-center space-x-3">
                          <Package className="w-4 h-4 text-yellow-600" />
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.sku}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{item.currentStock} / {item.minStock}</span>
                          <Button size="sm" variant="outline">
                            Reorder
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Inventory Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory ({filteredInventory.length})</CardTitle>
                    <CardDescription>
                      {selectedItems.length > 0 && (
                        <span>{selectedItems.length} selected</span>
                      )}
                    </CardDescription>
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Selected
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedItems.length === paginatedInventory.length && paginatedInventory.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('name')}
                            className="h-auto p-0 font-semibold"
                          >
                            Product
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('sku')}
                            className="h-auto p-0 font-semibold"
                          >
                            SKU
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Min/Max</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Stock Level</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedInventory.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-6 h-6 p-0"
                                  onClick={() => toggleRowExpansion(item.id)}
                                >
                                  {expandedRows.includes(item.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </Collapsible>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                                <Package className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">{item.supplier}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="font-medium">{item.currentStock}</TableCell>
                          <TableCell className="text-sm">{item.minStock} / {item.maxStock}</TableCell>
                          <TableCell>{getStatusBadge(item.status, item.currentStock, item.minStock)}</TableCell>
                          <TableCell>
                            <div className="w-20">
                              <Progress 
                                value={getStockLevel(item.currentStock, item.minStock, item.maxStock)} 
                                className="h-2"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Stock
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Item
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(page)
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(Math.min(totalPages, currentPage + 1))
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
