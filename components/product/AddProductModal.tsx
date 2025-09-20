"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Cookies from "js-cookie"

interface AddProductModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  product?: any // agar edit karna ho
}

export default function AddProductModal({ open, onClose, onSuccess, product }: AddProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: "", // 👈 id bhi rakhenge
    name: "",
    sku: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    maxStock: "",
  })

  // agar edit ho to data pre-fill kare
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || "",
        name: product.name || "",
        sku: product.sku || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        cost: product.cost?.toString() || "",
        stock: product.stock?.toString() || "",
        minStock: product.minStock?.toString() || "",
        maxStock: product.maxStock?.toString() || "",
      })
    } else {
      setFormData({
        id: "",
        name: "",
        sku: "",
        description: "",
        price: "",
        cost: "",
        stock: "",
        minStock: "",
        maxStock: "",
      })
    }
  }, [product, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
  
      // Cookie se token uthao
      const token = Cookies.get("auth-token")
  
      const res = await fetch("/api/products", {
        method: product ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      })
  
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Something went wrong")
      } else {
        toast.success(product ? "Product updated ✅" : "Product created ✅")
        onSuccess()
        onClose()
      }
    } catch (err) {
      console.error(err)
      toast.error("Internal server error")
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <Label>SKU</Label>
            <Input name="sku" value={formData.sku} onChange={handleChange} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Cost</Label>
              <Input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Min Stock</Label>
              <Input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Max Stock</Label>
              <Input
                type="number"
                name="maxStock"
                value={formData.maxStock}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : product ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
