"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Calculator, 
  Scan, 
  CreditCard, 
  Receipt, 
  User, 
  Package,
  X,
  Check,
  Download
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
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
import { toast } from "sonner"

// Mock products data (reusing from products page)
const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    price: 99.99,
    stock: 150,
    status: "in_stock",
    image: "/api/placeholder/60/60",
    description: "High-quality wireless headphones with noise cancellation",
    barcode: "1234567890123"
  },
  {
    id: 2,
    name: "Gaming Mouse",
    sku: "GM-002",
    category: "Electronics",
    price: 49.99,
    stock: 25,
    status: "low_stock",
    image: "/api/placeholder/60/60",
    description: "Professional gaming mouse with RGB lighting",
    barcode: "1234567890124"
  },
  {
    id: 3,
    name: "Office Chair",
    sku: "OC-003",
    category: "Furniture",
    price: 299.99,
    stock: 0,
    status: "out_of_stock",
    image: "/api/placeholder/60/60",
    description: "Ergonomic office chair with lumbar support",
    barcode: "1234567890125"
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    sku: "MK-004",
    category: "Electronics",
    price: 129.99,
    stock: 75,
    status: "in_stock",
    image: "/api/placeholder/60/60",
    description: "Mechanical keyboard with blue switches",
    barcode: "1234567890126"
  },
  {
    id: 5,
    name: "Standing Desk",
    sku: "SD-005",
    category: "Furniture",
    price: 499.99,
    stock: 12,
    status: "low_stock",
    image: "/api/placeholder/60/60",
    description: "Height-adjustable standing desk",
    barcode: "1234567890127"
  }
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  sku: string
}

interface Invoice {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  date: string
  customer?: string
  status: "pending" | "paid"
}

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [showInvoice, setShowInvoice] = useState(false)
  const [editingQuantity, setEditingQuantity] = useState<number | null>(null)
  const [tempQuantity, setTempQuantity] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm)
    )
  }, [searchTerm])

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  // Add product to cart
  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        sku: product.sku
      }
      setCart([...cart, newItem])
    }
    
    setSearchTerm("")
    setShowProductSearch(false)
    toast.success(`${product.name} added to cart`)
  }

  // Update quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity } : item
    ))
  }

  // Remove from cart
  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
    toast.success("Item removed from cart")
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    toast.success("Cart cleared")
  }

  // Process payment
  const processPayment = () => {
    const invoice: Invoice = {
      id: `INV-${Date.now()}`,
      items: [...cart],
      subtotal,
      tax,
      total,
      date: new Date().toISOString(),
      status: "paid"
    }
    
    setCurrentInvoice(invoice)
    setShowInvoice(true)
    setCart([])
    toast.success("Payment processed successfully!")
  }

  // Handle quantity editing
  const startEditingQuantity = (itemId: number, currentQuantity: number) => {
    setEditingQuantity(itemId)
    setTempQuantity(currentQuantity.toString())
  }

  const finishEditingQuantity = () => {
    if (editingQuantity !== null) {
      const newQuantity = parseInt(tempQuantity) || 1
      updateQuantity(editingQuantity, newQuantity)
      setEditingQuantity(null)
      setTempQuantity("")
    }
  }

  // Barcode scanner simulation
  const handleBarcodeSearch = () => {
    // Simulate barcode scan
    const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)]
    setSearchTerm(randomProduct.barcode)
    addToCart(randomProduct)
    toast.success("Barcode scanned!")
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-full flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-6 border-b bg-white dark:bg-gray-900"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
              <p className="text-muted-foreground">Process sales and manage transactions</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleBarcodeSearch}>
                <Scan className="w-4 h-4 mr-2" />
                Scan Barcode
              </Button>
              <Button variant="outline">
                <Calculator className="w-4 h-4 mr-2" />
                Calculator
              </Button>
            </div>
          </motion.div>

          <div className="flex-1 flex">
            {/* Product Search & Cart */}
            <div className="flex-1 p-6 space-y-6">
              {/* Product Search */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="w-5 h-5" />
                      <span>Product Search</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Popover open={showProductSearch} onOpenChange={setShowProductSearch}>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            ref={searchInputRef}
                            placeholder="Search products by name, SKU, or barcode..."
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
                                  onSelect={() => addToCart(product)}
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
                                  <Badge 
                                    variant={product.status === 'in_stock' ? 'secondary' : 'destructive'}
                                  >
                                    {product.stock} in stock
                                  </Badge>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Shopping Cart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="flex-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Shopping Cart ({cart.length})</span>
                      </CardTitle>
                      {cart.length > 0 && (
                        <Button variant="outline" size="sm" onClick={clearCart}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear Cart
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {cart.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/50"
                          >
                            <div className="w-10 h-10 bg-background rounded-md flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.sku}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              
                              {editingQuantity === item.id ? (
                                <motion.div
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  className="w-16"
                                >
                                  <Input
                                    value={tempQuantity}
                                    onChange={(e) => setTempQuantity(e.target.value)}
                                    onBlur={finishEditingQuantity}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') finishEditingQuantity()
                                      if (e.key === 'Escape') {
                                        setEditingQuantity(null)
                                        setTempQuantity("")
                                      }
                                    }}
                                    className="h-8 text-center"
                                    autoFocus
                                  />
                                </motion.div>
                              ) : (
                                <div
                                  className="w-16 text-center font-medium cursor-pointer hover:bg-muted rounded px-2 py-1"
                                  onClick={() => startEditingQuantity(item.id, item.quantity)}
                                >
                                  {item.quantity}
                                </div>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {cart.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Your cart is empty</p>
                          <p className="text-sm">Search for products to add them to your cart</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Checkout Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="w-96 p-6 border-l bg-muted/20"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Checkout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <label className="text-sm font-medium">Customer</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Customer name (optional)" />
                    </div>
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={processPayment}
                      disabled={cart.length === 0}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Process Payment
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" disabled={cart.length === 0}>
                        Cash
                      </Button>
                      <Button variant="outline" disabled={cart.length === 0}>
                        Card
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Invoice Dialog */}
        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span>Invoice</span>
                {currentInvoice?.status === "paid" && (
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
            
            {currentInvoice && (
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold">Your Store Name</h2>
                  <p className="text-muted-foreground">123 Business Street, City, State 12345</p>
                  <p className="text-muted-foreground">Phone: (555) 123-4567</p>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Invoice #:</strong> {currentInvoice.id}</p>
                    <p><strong>Date:</strong> {new Date(currentInvoice.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>Cashier:</strong> John Doe</p>
                    <p><strong>Register:</strong> POS-001</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentInvoice.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-muted-foreground text-xs">{item.sku}</div>
                            </div>
                          </td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">${item.price.toFixed(2)}</td>
                          <td className="text-right py-2">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${currentInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${currentInvoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${currentInvoice.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground border-t pt-4">
                  <p>Thank you for your business!</p>
                  <p>Return policy: 30 days with receipt</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInvoice(false)}>
                Close
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </ProtectedRoute>
  )
}
