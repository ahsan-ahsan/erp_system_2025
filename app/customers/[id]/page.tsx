"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function CustomerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customers/${params.id}`)
        const result = await res.json()
        if (result.success) {
          setCustomer(result.data)
        }
      } catch (error) {
        console.error("Error fetching customer:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCustomer()
    }
  }, [params.id])

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex justify-center items-center h-96">
            <p>Loading...</p>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  if (!customer) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex justify-center items-center h-96">
            <p>No customer found</p>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-red-900 dark:text-gray-300">
            Inactive
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* 🔹 Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {customer.firstName} {customer.lastName}
                  </h1>
                  <p className="text-muted-foreground">
                    Customer since {new Date(customer.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 🔹 Customer Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {getInitials(customer.firstName, customer.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold">
                      {customer.firstName} {customer.lastName}
                    </div>
                    {getStatusBadge(customer.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Company</div>
                      <div className="font-medium">{customer.company}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                      <div className="font-medium">{customer.totalOrders}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                      <div className="font-medium">${Number(customer.totalSpent).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">
                        {customer.address}, {customer.city}, {customer.state},{" "}
                        {customer.zipCode}, {customer.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🔹 Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Customer notes or description</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{customer.notes || "No notes available"}</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
