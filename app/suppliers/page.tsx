"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Download,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Package,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ShieldCheck,
  ShieldX,
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { exportToExcel } from "@/utils/generalFuntions"
import { useRouter } from "next/navigation"

// ----------------- Interfaces -----------------
interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  status: string
  createdAt: string
  products: { id: string; name: string }[]
  purchaseOrders: { id: string; total: number; status: string }[]
}

// ----------------- Status Badge -----------------
const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
        >
          <ShieldCheck className="h-4 w-4" /> Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-800 dark:bg-red-900 dark:text-gray-300 flex items-center gap-1"
        >
          <ShieldX className="h-4 w-4" /> Inactive
        </Badge>
      )
    default:
      return null
  }
}

// ----------------- Add/Edit Supplier Modal -----------------
function AddSupplierModal({
  onSuccess,
  supplier,
  open,
  setOpen,
}: {
  onSuccess: () => void
  supplier?: Supplier | null
  open: boolean
  setOpen: (o: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    categories: "",
    rating: "",
  })

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name || "",
        contact: supplier.contact || "",
        email: supplier.email || "",
        phone: (supplier as any).phone || "",
        address: (supplier as any).address || "",
        city: (supplier as any).city || "",
        state: (supplier as any).state || "",
        zipCode: (supplier as any).zipCode || "",
        country: (supplier as any).country || "",
        categories: (supplier as any).categories || "",
        rating: (supplier as any).rating || "",
      })
    } else {
      setForm({
        name: "",
        contact: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        categories: "",
        rating: "",
      })
    }
  }, [supplier, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const method = supplier ? "PUT" : "POST"
      const url = supplier ? `/api/suppliers/${supplier.id}` : "/api/suppliers"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        onSuccess()
        setOpen(false)
        toast.success(supplier ? "Supplier updated successfully!" : "Supplier added successfully!")
      } else {
        toast.error(data.error || "Failed to save supplier")
      }
    } catch (err) {
      console.error("Save supplier error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <Input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <Input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <Input name="state" placeholder="State" value={form.state} onChange={handleChange} />
          <Input name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} />
          <Input name="country" placeholder="Country" value={form.country} onChange={handleChange} />
          <Input name="categories" placeholder="Categories" value={form.categories} onChange={handleChange} />
          <Input name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ----------------- Suppliers Page -----------------
export default function SuppliersPage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalSuppliers, setTotalSuppliers] = useState(0)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string }>({ open: false })

  const [modalOpen, setModalOpen] = useState(false)
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)

  const itemsPerPage = 10

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      })
      if (searchTerm) params.append("search", searchTerm)
      if (selectedStatus !== "all") params.append("status", selectedStatus)

      const res = await fetch(`/api/suppliers?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setSuppliers(data.data.suppliers)
        setTotalPages(data.data.pagination.pages)
        setTotalSuppliers(data.data.pagination.total)
      }
    } catch (err) {
      console.error("Fetch suppliers error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [searchTerm, selectedStatus, currentPage])

  const handleDelete = async (id?: string) => {
    if (!id) return
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        fetchSuppliers()
        setDeleteConfirm({ open: false })
        toast.success("Supplier deleted successfully!")
      } else {
        toast.error(data.error || "Failed to delete supplier")
      }
    } catch (err) {
      console.error("Delete supplier error:", err)
      toast.error("An error occurred while deleting supplier")
    }
  }

  // FRONTEND FUNCTION
  const handleStatusChange = async (supplierId: string, status: string) => {
    try {
      const res = await fetch("/api/suppliers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ supplierId, status }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update status")

      toast.success(data.message || "supplier status updated")
      fetchSuppliers()
    } catch (error: any) {
      console.error("Error updating status:", error.message)
      toast.error(error.message || "Failed to update status")
    }
  }



  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
              <p className="text-muted-foreground">
                Manage your supplier relationships and procurement.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => exportToExcel(suppliers, "suppliers")}>
                <Download className="w-4 h-4 mr-2" /> Export Excel
              </Button>
              <Button
                onClick={() => {
                  setEditSupplier(null)
                  setModalOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Supplier
              </Button>
            </div>
          </div>

          {/* Analytics Cards */}

          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSuppliers}</div>
                <p className="text-xs text-muted-foreground">All registered suppliers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {suppliers.filter((s) => s.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {suppliers.reduce(
                    (acc, s) =>
                      acc + s.purchaseOrders.filter((o) => o.status === "pending").length,
                    0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Orders awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                <DollarSign className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {suppliers
                    .reduce(
                      (acc, s) =>
                        acc +
                        s.purchaseOrders.reduce((sum, o) => sum + (o.total || 0), 0),
                      0
                    )
                    .toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Across all suppliers</p>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Suppliers List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6}>Loading...</TableCell>
                    </TableRow>
                  ) : suppliers.length > 0 ? (
                    suppliers.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.contact}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{getStatusBadge(s.status)}</TableCell>
                        <TableCell>{s.purchaseOrders.length}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={()=>{router.push(`/suppliers/${s.id}`)}}>
                                <Eye className="w-4 h-4 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(s.id, s.status === "active" ? "inactive" : "active")}>
                                {getStatusBadge(s.status === "active" ? "inactive" : "active")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditSupplier(s)
                                  setModalOpen(true)
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setDeleteConfirm({ open: true, id: s.id })
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>No suppliers found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteConfirm.open}
            onOpenChange={(o) => setDeleteConfirm({ open: o })}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this supplier?</p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm({ open: false })}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteConfirm.id)}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Reusable Add/Edit Modal */}
          <AddSupplierModal
            onSuccess={fetchSuppliers}
            supplier={editSupplier}
            open={modalOpen}
            setOpen={setModalOpen}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
