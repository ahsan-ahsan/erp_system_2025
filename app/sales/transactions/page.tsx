"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Receipt,
  Calendar,
  DollarSign,
  Package
} from "lucide-react"
import { useRouter } from "next/navigation"

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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { InvoiceComponent } from "@/components/pos/invoice-component"

// Mock transaction data
const mockTransactions = [
  {
    id: "TXN-001",
    invoiceId: "INV-001",
    date: "2024-01-15T10:30:00Z",
    customer: "John Doe",
    items: 3,
    subtotal: 249.97,
    tax: 19.99,
    total: 269.96,
    status: "completed",
    paymentMethod: "card",
    cashier: "Jane Smith"
  },
  {
    id: "TXN-002", 
    invoiceId: "INV-002",
    date: "2024-01-15T11:15:00Z",
    customer: "Walk-in Customer",
    items: 1,
    subtotal: 99.99,
    tax: 8.00,
    total: 107.99,
    status: "completed",
    paymentMethod: "cash",
    cashier: "John Doe"
  },
  {
    id: "TXN-003",
    invoiceId: "INV-003", 
    date: "2024-01-15T14:20:00Z",
    customer: "Sarah Johnson",
    items: 2,
    subtotal: 179.98,
    tax: 14.40,
    total: 194.38,
    status: "refunded",
    paymentMethod: "card",
    cashier: "Jane Smith"
  }
]

export default function TransactionsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showInvoice, setShowInvoice] = useState(false)

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
      case "refunded":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Refunded</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <DollarSign className="w-4 h-4" />
      case "cash":
        return <DollarSign className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const handleViewInvoice = (transaction: any) => {
    // Convert transaction to invoice format
    const invoice = {
      id: transaction.invoiceId,
      items: [], // Would be populated from actual data
      subtotal: transaction.subtotal,
      tax: transaction.tax,
      total: transaction.total,
      date: transaction.date,
      customer: transaction.customer,
      status: "paid" as const
    }
    setSelectedTransaction(invoice)
    setShowInvoice(true)
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
                  <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
                  <p className="text-muted-foreground">
                    View and manage all POS transactions
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
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
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
                    <CardDescription>
                      All POS transactions and sales records
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cashier</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction, index) => (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group"
                        >
                          <TableCell className="font-mono text-sm">
                            {transaction.id}
                          </TableCell>
                          <TableCell>{transaction.customer}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(transaction.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(transaction.date).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Package className="w-4 h-4 text-muted-foreground" />
                              <span>{transaction.items}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${transaction.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {getPaymentMethodIcon(transaction.paymentMethod)}
                              <span className="capitalize text-sm">
                                {transaction.paymentMethod}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell className="text-sm">
                            {transaction.cashier}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewInvoice(transaction)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Invoice Dialog */}
        {selectedTransaction && (
          <InvoiceComponent
            invoice={selectedTransaction}
            isOpen={showInvoice}
            onClose={() => setShowInvoice(false)}
            onDownloadPDF={() => console.log("Download PDF")}
          />
        )}
      </MainLayout>
    </ProtectedRoute>
  )
}
