"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  ShieldCheck,
  ShieldX,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CustomerModal } from "@/components/customer/CustomerModal"
import { toast } from "sonner"

// 🟢 Dialog (confirmation modal)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { exportToExcel } from "@/utils/generalFuntions"


const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
          <ShieldCheck className="h-4 w-4" /> Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-red-900 dark:text-gray-300 flex items-center gap-1">
          <ShieldX className="h-4 w-4" /> Inactive
        </Badge>
      )
    default:
      return null
  }
}

export default function CustomersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [customers, setCustomers] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
  const itemsPerPage = 10

  // 🔹 modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)

  // 🔹 delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        status: selectedStatus === "all" ? "" : selectedStatus,
      })
      const res = await fetch(`/api/customers?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setCustomers(data.data.customers)
        setTotalPages(data.data.pagination.pages)
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCustomers()
  }, [currentPage, searchTerm, selectedStatus])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map(c => c.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleSelectCustomer = (customerId: number, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId])
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId))
    }
  }

  // ✅ STATUS CHANGE
  const handleStatusChange = async (customerId: string, status: string) => {
    try {
      const res = await fetch("/api/customers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId, status }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update status")

      toast.success(data.message || "Customer status updated")
      fetchCustomers()
    } catch (error: any) {
      console.error("Error updating status:", error.message)
      toast.error(error.message || "Failed to update status")
    }
  }

  // ✅ DELETE CUSTOMER
  const handleDeleteCustomer = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/customers?id=${deleteTarget.id}`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete customer")

      toast.success(data.message || "Customer deleted successfully")
      setDeleteModalOpen(false)
      setDeleteTarget(null)
      fetchCustomers()
    } catch (error: any) {
      console.error("Error deleting customer:", error.message)
      toast.error(error.message || "Failed to delete customer")
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                <p className="text-muted-foreground">Manage your customer relationships and profiles.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => exportToExcel(customers,"customers")}>
                  <Download className="w-4 h-4 mr-2" /> Export Excel
                </Button>
                <Button
                  onClick={() => {
                    setSelectedCustomer(null)
                    setModalOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Customer
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Customers</CardTitle>
                <CardDescription>All registered customers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{customers.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active</CardTitle>
                <CardDescription>Currently active customers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{customers.filter(c => c.status === "active").length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inactive</CardTitle>
                <CardDescription>Currently inactive customers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{customers.filter(c => c.status === "inactive").length}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customers Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Customers ({customers.length})</CardTitle>
                    <CardDescription>{selectedCustomers.length > 0 && <span>{selectedCustomers.length} selected</span>}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedCustomers.length === customers.length && customers.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                        </TableRow>
                      ) : (
                        customers.map((customer, index) => (
                          <motion.tr
                            key={customer.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group"
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedCustomers.includes(customer.id)}
                                onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getInitials(customer.firstName, customer.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                                  <div className="text-sm text-muted-foreground">Email: {customer.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{customer.company}</TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Phone className="w-3 h-3 mr-2 text-muted-foreground" /> {customer.phone || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(customer.status)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(customer.createdAt).toLocaleDateString()}
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
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/customers/${customer.id}`)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" /> View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedCustomer(customer)
                                      setModalOpen(true)
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Edit Customer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => handleStatusChange(customer.id, customer.status === "active" ? "inactive" : "active")}
                                  >
                                    {getStatusBadge(customer.status === "active" ? "inactive" : "active")}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive cursor-pointer"
                                    onClick={() => {
                                      setDeleteTarget(customer)
                                      setDeleteModalOpen(true)
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
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

        {/* 🔹 Customer Modal */}
        <CustomerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          customer={selectedCustomer || undefined}
          onSuccess={() => {
            setCurrentPage(1)
            fetchCustomers()
          }}
        />

        {/* 🔹 Delete Confirmation Dialog */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Customer</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deleteTarget?.firstName} {deleteTarget?.lastName}</span>?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteCustomer}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </ProtectedRoute>
  )
}
