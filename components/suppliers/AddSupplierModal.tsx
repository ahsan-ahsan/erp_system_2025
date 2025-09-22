"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// ----------------- Add Supplier Modal -----------------
export default function AddSupplierModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Supplier added successfully ✅")
        onSuccess()
        setOpen(false)
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
      } else {
        toast.error(data.error || "Failed to create supplier ❌")
      }
    } catch (err) {
      console.error("Add supplier error:", err)
      toast.error("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" /> Add Supplier
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
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
            <Input name="categories" placeholder="Categories (comma separated)" value={form.categories} onChange={handleChange} />
            <Input name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
