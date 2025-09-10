"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Package, 
  Search, 
  X, 
  Check,
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

// Mock products data
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

interface ProductQuickAddProps {
  onAddProduct: (product: any) => void
  onClose: () => void
  isOpen: boolean
}

export function ProductQuickAdd({ onAddProduct, onClose, isOpen }: ProductQuickAddProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [showQuantityDialog, setShowQuantityDialog] = useState(false)

  // Filter products based on search
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  )

  const getStatusBadge = (status: string, stock: number) => {
    switch (status) {
      case "in_stock":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            In Stock ({stock})
          </Badge>
        )
      case "low_stock":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Low Stock ({stock})
          </Badge>
        )
      case "out_of_stock":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Out of Stock
          </Badge>
        )
      default:
        return null
    }
  }

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
    setQuantity(1)
    setShowQuantityDialog(true)
  }

  const handleAddToCart = () => {
    if (selectedProduct) {
      const productWithQuantity = {
        ...selectedProduct,
        quantity: quantity
      }
      onAddProduct(productWithQuantity)
      toast.success(`${selectedProduct.name} added to cart`)
      setShowQuantityDialog(false)
      setSelectedProduct(null)
      setQuantity(1)
      setSearchTerm("")
    }
  }

  const handleQuickAdd = (product: any) => {
    onAddProduct({ ...product, quantity: 1 })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Products to Cart</span>
            </DialogTitle>
            <DialogDescription>
              Search and add products to the current transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products by name, SKU, or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Products Grid */}
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">{product.sku}</p>
                            <p className="text-sm font-medium text-primary">${product.price}</p>
                            <div className="mt-2">
                              {getStatusBadge(product.status, product.stock)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleProductSelect(product)}
                            disabled={product.status === "out_of_stock"}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAdd(product)}
                            disabled={product.status === "out_of_stock"}
                          >
                            Quick Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No products found</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quantity Dialog */}
      <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Cart</DialogTitle>
            <DialogDescription>
              Specify the quantity for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{selectedProduct.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedProduct.sku}</div>
                  <div className="text-sm font-medium">${selectedProduct.price}</div>
                </div>
                {getStatusBadge(selectedProduct.status, selectedProduct.stock)}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                    max={selectedProduct.stock}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    disabled={quantity >= selectedProduct.stock}
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: {selectedProduct.stock} units
                </p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">${(selectedProduct.price * quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuantityDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToCart}>
              <Check className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
