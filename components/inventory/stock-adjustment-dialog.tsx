"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Minus, 
  X, 
  Package,
  Calculator,
  Save,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface StockAdjustmentDialogProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    sku: string
    currentStock: number
  }
}

export function StockAdjustmentDialog({ isOpen, onClose, product }: StockAdjustmentDialogProps) {
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">("increase")
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  const handleSave = () => {
    if (quantity <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    if (!reason) {
      toast.error("Please select a reason for the adjustment")
      return
    }

    // In a real app, this would save to the backend
    const adjustment = adjustmentType === "increase" ? quantity : -quantity
    const newStock = product.currentStock + adjustment

    if (newStock < 0) {
      toast.error("Adjustment would result in negative stock")
      return
    }

    toast.success(`Stock adjusted by ${adjustmentType === "increase" ? "+" : "-"}${quantity}`)
    onClose()
    
    // Reset form
    setQuantity(0)
    setReason("")
    setNotes("")
  }

  const newStock = product.currentStock + (adjustmentType === "increase" ? quantity : -quantity)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Stock Adjustment</span>
          </DialogTitle>
          <DialogDescription>
            Adjust stock levels for {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.sku}</div>
                  <div className="text-sm font-medium">Current Stock: {product.currentStock}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adjustment Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Adjustment Type</label>
            <Select value={adjustmentType} onValueChange={(value: "increase" | "decrease") => setAdjustmentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase">
                  <div className="flex items-center space-x-2">
                    <Plus className="w-4 h-4 text-green-500" />
                    <span>Increase Stock</span>
                  </div>
                </SelectItem>
                <SelectItem value="decrease">
                  <div className="flex items-center space-x-2">
                    <Minus className="w-4 h-4 text-red-500" />
                    <span>Decrease Stock</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                className="h-8 w-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="text-center"
                min="0"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="damaged">Damaged Goods</SelectItem>
                <SelectItem value="theft">Theft/Loss</SelectItem>
                <SelectItem value="found">Found Stock</SelectItem>
                <SelectItem value="return">Customer Return</SelectItem>
                <SelectItem value="transfer">Transfer In/Out</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              placeholder="Add any additional notes about this adjustment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Stock Preview */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Current Stock</div>
                  <div className="text-lg font-medium">{product.currentStock}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Adjustment</div>
                  <div className={`text-lg font-medium ${
                    adjustmentType === "increase" ? "text-green-600" : "text-red-600"
                  }`}>
                    {adjustmentType === "increase" ? "+" : "-"}{quantity}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">New Stock</div>
                  <div className={`text-lg font-medium ${
                    newStock < 0 ? "text-red-600" : "text-green-600"
                  }`}>
                    {newStock}
                  </div>
                </div>
              </div>
              
              {newStock < 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    Warning: This adjustment would result in negative stock
                  </span>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={quantity <= 0 || !reason || newStock < 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Apply Adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
