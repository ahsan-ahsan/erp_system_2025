"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
})

type CustomerFormData = z.infer<typeof customerSchema>

interface CustomerModalProps {
  open: boolean
  onClose: () => void
  customer?: any // agar pass ho to update karega
  onSuccess: () => void
}

export function CustomerModal({ open, onClose, customer, onSuccess }: CustomerModalProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      notes: "",
    },
  })

  // ✅ agar edit modal open hota hai to data reset ho jaye
  useEffect(() => {
    if (customer) {
      form.reset(customer)
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        notes: "",
      })
    }
  }, [customer, form])

  const onSubmit = async (values: CustomerFormData) => {
    try {
      setLoading(true)
      const res = await fetch(
        customer ? `/api/customers/${customer.id}` : "/api/customers",
        {
          method: customer ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      )
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Something went wrong")
        return
      }

      toast.success(customer ? "Customer updated successfully" : "Customer created successfully")
      onSuccess()
      onClose()
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
          <DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="First Name" {...form.register("firstName")} />
            <Input placeholder="Last Name" {...form.register("lastName")} />
          </div>
          <Input placeholder="Email" {...form.register("email")} />
          <Input placeholder="Phone" {...form.register("phone")} />
          <Input placeholder="Company" {...form.register("company")} />
          <Input placeholder="Address" {...form.register("address")} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="City" {...form.register("city")} />
            <Input placeholder="State" {...form.register("state")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Zip Code" {...form.register("zipCode")} />
            <Input placeholder="Country" {...form.register("country")} />
          </div>
          <Input placeholder="Notes" {...form.register("notes")} />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
