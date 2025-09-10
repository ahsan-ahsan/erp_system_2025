"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  AlertTriangle
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

// Mock data for suppliers
const mockSuppliers = [
  {
    id: 1,
    name: "TechCorp Industries",
    contact: "John Smith",
    email: "john@techcorp.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    totalOrders: 45,
    totalValue: 125000.00,
    lastOrder: "2024-01-15",
    joinDate: "2023-01-15",
    location: "Silicon Valley, CA",
    rating: 4.8,
    categories: ["Electronics", "Computers"]
  },
  {
    id: 2,
    name: "FurniCorp Manufacturing",
    contact: "Sarah Johnson",
    email: "sarah@furnicorp.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    totalOrders: 32,
    totalValue: 89000.00,
    lastOrder: "2024-01-12",
    joinDate: "2023-03-20",
    location: "Detroit, MI",
    rating: 4.6,
    categories: ["Furniture", "Office Supplies"]
  },
  {
    id: 3,
    name: "GameTech Solutions",
    contact: "Mike Chen",
    email: "mike@gametech.com",
    phone: "+1 (555) 345-6789",
    status: "active",
    totalOrders: 28,
    totalValue: 67000.00,
    lastOrder: "2024-01-10",
    joinDate: "2023-05-10",
    location: "Austin, TX",
    rating: 4.9,
    categories: ["Gaming", "Electronics"]
  },
  {
    id: 4,
    name: "OfficeMax Supplies",
    contact: "Lisa Brown",
    email: "lisa@officemax.com",
    phone: "+1 (555) 456-7890",
    status: "inactive",
    totalOrders: 15,
    totalValue: 23000.00,
    lastOrder: "2023-11-20",
    joinDate: "2023-02-28",
    location: "Chicago, IL",
    rating: 4.2,
    categories: ["Office Supplies", "Stationery"]
  },
  {
    id: 5,
    name: "Premium Materials Co",
    contact: "David Wilson",
    email: "david@premiummaterials.com",
    phone: "+1 (555) 567-8901",
    status: "active",
    totalOrders: 38,
    totalValue: 156000.00,
    lastOrder: "2024-01-14",
    joinDate: "2023-04-15",
    location: "Portland, OR",
    rating: 4.7,
    categories: ["Raw Materials", "Manufacturing"]
  }
]

const getInitials = (name: string) => {
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      )
    default:
      return null
  }
}

const getRatingStars = (rating: number) => {
  return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
}

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([])
  const itemsPerPage = 10

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter(supplier => {
      const matchesSearch = 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = selectedStatus === "all" || supplier.status === selectedStatus
      
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, selectedStatus])

  // Pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage)
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSuppliers(paginatedSuppliers.map(s => s.id))
    } else {
      setSelectedSuppliers([])
    }
  }

  const handleSelectSupplier = (supplierId: number, checked: boolean) => {
    if (checked) {
      setSelectedSuppliers([...selectedSuppliers, supplierId])
    } else {
      setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId))
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
                <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
                <p className="text-muted-foreground">
                  Manage your supplier relationships and procurement.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{mockSuppliers.length}</div>
                      <p className="text-sm text-muted-foreground">Total Suppliers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}