"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
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
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import AddProductModal from "@/components/product/AddProductModal"
import { useRouter } from "next/navigation"

const getStatusBadge = (status: string, stock: number) => {
  switch (status) {
    case "IN_STOCK":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          In Stock ({stock})
        </Badge>
      )
    case "LOW_STOCK":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Low Stock ({stock})
        </Badge>
      )
    case "OUT_OF_STOCK":
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          Out of Stock
        </Badge>
      )
    default:
      return null
  }
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // 🔹 Delete confirm state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        category: selectedCategory !== "all" ? selectedCategory : "",
        status: selectedStatus !== "all" ? selectedStatus : "",
        sortBy,
        sortOrder,
      })
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setProducts(data.data.products)
        setTotal(data.data.pagination.total)
      } else {
        toast.error(data.error || "Failed to fetch products")
      }
    } catch (err) {
      console.error(err)
      toast.error("Error loading products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder])

  const totalPages = Math.ceil(total / itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Fake upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast.success("Products uploaded successfully!")
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // 🔹 Ask before delete
  const handleAskDelete = (id: string) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  // 🔹 Final confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setConfirmOpen(false)

    try {
      const res = await fetch(`/api/products?id=${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("auth-token="))
              ?.split("=")[1] || ""
          }`,
        },
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to delete ❌")
      } else {
        toast.success("Product deleted ✅")
        fetchProducts()
      }
    } catch (err) {
      console.error(err)
      toast.error("Error deleting product ❌")
    } finally {
      setDeleteId(null)
    }
  }

  const categories = Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean)))
  const statuses = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Products</h1>
                <p className="text-muted-foreground">
                  Manage your product inventory and catalog.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk Upload Products</DialogTitle>
                      <DialogDescription>
                        Upload a CSV or Excel file to add multiple products at once.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed p-6 rounded-lg text-center">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="block text-sm font-medium">Drop or click to upload</span>
                            <span className="block text-xs text-muted-foreground">
                              CSV, Excel up to 10MB
                            </span>
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleBulkUpload}
                          />
                        </div>
                      </div>
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} />
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                {/* Add Product Button */}
                <Button onClick={() => setModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c || ""}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products ({total})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedProducts.length === products.length && products.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort("price")}>
                            Price <ArrowUpDown className="ml-1 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((p) => (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedProducts.includes(p.id)}
                              onCheckedChange={(checked) =>
                                handleSelectProduct(p.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                                <Package className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="font-medium">{p.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {p.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{p.sku}</TableCell>
                          <TableCell>{p.category?.name}</TableCell>
                          <TableCell>${p.price}</TableCell>
                          <TableCell>{getStatusBadge(p.status, p.stock)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/products/${p.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" /> View
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingProduct(p)
                                    setModalOpen(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleAskDelete(p.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

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
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Modal */}
        <AddProductModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setEditingProduct(null)
          }}
          onSuccess={fetchProducts}
          product={editingProduct}
        />

        {/* 🔹 Confirm Delete Dialog */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </ProtectedRoute>
  )
}
