"use client"

import { motion } from "framer-motion"
import { Receipt, Download, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"

interface Invoice {
  id: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    sku: string
  }>
  subtotal: number
  tax: number
  total: number
  date: string
  customer?: string
  status: "pending" | "paid"
}

interface InvoiceComponentProps {
  invoice: Invoice | null
  isOpen: boolean
  onClose: () => void
  onDownloadPDF?: () => void
}

export function InvoiceComponent({ 
  invoice, 
  isOpen, 
  onClose, 
  onDownloadPDF 
}: InvoiceComponentProps) {
  if (!invoice) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5" />
            <span>Invoice #{invoice.id}</span>
            {invoice.status === "paid" && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="ml-auto"
              >
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <Check className="w-3 h-3 mr-1" />
                  PAID
                </Badge>
              </motion.div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Invoice Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center border-b pb-4"
          >
            <h2 className="text-2xl font-bold">Your Store Name</h2>
            <p className="text-muted-foreground">123 Business Street, City, State 12345</p>
            <p className="text-muted-foreground">Phone: (555) 123-4567 | Email: info@yourstore.com</p>
          </motion.div>

          {/* Invoice Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-2 gap-4 text-sm"
          >
            <div>
              <p><strong>Invoice #:</strong> {invoice.id}</p>
              <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(invoice.date).toLocaleTimeString()}</p>
            </div>
            <div>
              <p><strong>Cashier:</strong> John Doe</p>
              <p><strong>Register:</strong> POS-001</p>
              {invoice.customer && <p><strong>Customer:</strong> {invoice.customer}</p>}
            </div>
          </motion.div>

          {/* Items Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 font-medium">Item</th>
                        <th className="text-center py-2 font-medium">Qty</th>
                        <th className="text-right py-2 font-medium">Price</th>
                        <th className="text-right py-2 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="border-b"
                        >
                          <td className="py-3">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-muted-foreground text-xs">{item.sku}</div>
                            </div>
                          </td>
                          <td className="text-center py-3">{item.quantity}</td>
                          <td className="text-right py-3">${item.price.toFixed(2)}</td>
                          <td className="text-right py-3 font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Totals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="border-t pt-4 space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (8%):</span>
              <span>${invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Payment Status */}
          {invoice.status === "paid" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-800 dark:text-green-200">Payment Successful!</p>
              <p className="text-sm text-green-600 dark:text-green-300">
                Transaction completed at {new Date(invoice.date).toLocaleTimeString()}
              </p>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-center text-xs text-muted-foreground border-t pt-4"
          >
            <p>Thank you for your business!</p>
            <p>Return policy: 30 days with receipt</p>
            <p>Questions? Contact us at support@yourstore.com</p>
          </motion.div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <Button onClick={onDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
