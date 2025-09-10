"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Minus, 
  X, 
  Search, 
  Package,
  Calculator,
  Save,
  Send
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
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// Mock data
const mockSuppliers = [
  { id: 1, name: "TechCorp Industries", email: "orders@techcorp.com", phone: "(555) 123-4567" },
  { id: 2, name: "FurniCorp", email: "orders@furnicorp.com", phone: "(555) 234-5678" },
  { id: 3, name: "GameTech Solutions", email: "orders@gametech.com", phone: "(555) 345-6789" }
]

const mockProducts = [
  { id: 1, name: "Wireless Headphones", sku: "WH-001", price: 65.00, category: "Electronics" },
  { id: 2, name: "Gaming Mouse", sku: "GM-002", price: 25.00, category: "Electronics" },
  { id: 3, name: "Office Chair", sku: "OC-003", price: 200.00, category: "Furniture" },
  { id: 4, name: "Mechanical Keyboard", sku: "MK-004", price: 80.00, category: "Electronics" },
  { id: 5, name: "Standing Desk", sku: "SD-005", price: 350.00, category: "Furniture" }
]

interface CreatePODialogProps {
  isOpen: boolean
  onClose: () => void
}

interface POItem {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  total: number
}

export function CreatePODialog({ isOpen, onClose }: CreatePODialogProps) {
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [poItems, setPOItems] = useState<POItem[]>([])
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [notes, setNotes] = useState("")
  const [expectedDelivery, setExpectedDelivery] = useState("")

  // Calculate totals
  const subtotal = poItems.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  // Filter products based on search
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addProduct = (product: any) => {
    const existingItem = poItems.find(item => item.id === product.id)
    
    if (existingItem) {
      setPOItems(poItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      const newItem: POItem = {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: 1,
        total: product.price
      }
      setPOItems([...poItems, newItem])
    }
    
    setSearchTerm("")
    setShowProductSearch(false)
    toast.success(`${product.name} added to order`)
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    
    setPOItems(poItems.map(item => 
      item.id === id 
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ))
  }

  const removeItem = (id: number) => {
    setPOItems(poItems.filter(item => item.id !== id))
    toast.success("Item removed from order")
  }

  const handleSave = () => {
    if (!selectedSupplier) {
      toast.error("Please select a supplier")
      return
    }
    
    if (poItems.length === 0) {
      toast.error("Please add at least one item")
      return
    }

    // In a real app, this would save to the backend
    toast.success("Purchase order created successfully!")
    onClose()
    
    // Reset form
    setSelectedSupplier("")
    setPOItems([])
    setNotes("")
    setExpectedDelivery("")
  }

  const handleSend = () => {
    handleSave()
    toast.success("Purchase order sent to supplier!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Purchase Order</span>
          </DialogTitle>
          <DialogDescription>
            Create a new purchase order for your supplier
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Supplier Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Supplier</label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">{supplier.email}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Expected Delivery</label>
                    <Input
                      type="date"
                      value={expectedDelivery}
                      onChange={(e) => setExpectedDelivery(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">PO Number</label>
                    <Input value={`PO-${Date.now()}`} disabled />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover open={showProductSearch} onOpenChange={setShowProductSearch}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search products to add..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setShowProductSearch(e.target.value.length > 0)
                      }}
                      className="pl-10"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        {filteredProducts.slice(0, 5).map((product) => (
                          <CommandItem
                            key={product.id}
                            onSelect={() => addProduct(product)}
                            className="flex items-center space-x-3 p-3 cursor-pointer"
                          >
                            <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.sku} • ${product.price}
                              </div>
                            </div>
                            <Badge variant="outline">{product.category}</Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items ({poItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {poItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="w-10 h-10 bg-background rounded-md flex items-center justify-center">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.sku}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">${item.price}</div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <div className="w-16 text-center font-medium">{item.quantity}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="font-medium w-20 text-right">${item.total.toFixed(2)}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
                
                {poItems.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No items added yet</p>
                    <p className="text-sm">Search for products to add them to your order</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          {poItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Add any special instructions or notes for the supplier..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedSupplier || poItems.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSend} disabled={!selectedSupplier || poItems.length === 0}>
            <Send className="w-4 h-4 mr-2" />
            Send Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
