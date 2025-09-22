"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
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

type Supplier = {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    categories?: string[]
    rating?: number | string
    status?: any          // ✅ Add this line
    createdBy?: { firstName: string; lastName: string }
    products?: { id: string; name: string; sku: string; status: string }[]
    purchaseOrders?: {
        id: string
        poNumber: string
        total: number
        status: string
        createdAt: string
    }[]
}


export default function SupplierProfilePage() {
    const params = useParams()
    const router = useRouter()
    const supplierId = params.id as string

    const [supplier, setSupplier] = useState<Supplier | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const res = await fetch(`/api/suppliers/${supplierId}`)
                const result = await res.json()
                if (result.success) {
                    setSupplier(result.data)
                }
            } catch (error) {
                console.error("Error fetching supplier:", error)
            } finally {
                setLoading(false)
            }
        }

        if (supplierId) fetchSupplier()
    }, [supplierId])

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

    if (!supplier) {
        return (
            <ProtectedRoute>
                <MainLayout>
                    <div className="flex justify-center items-center h-96">
                        <p>No supplier found</p>
                    </div>
                </MainLayout>
            </ProtectedRoute>
        )
    }

    const getInitials = (name: string) =>
        name?.split(" ").map(n => n.charAt(0)).join("").toUpperCase()

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Active
                    </Badge>
                )
            case "inactive":
                return (
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-red-900 dark:text-gray-300">
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
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" onClick={() => router.back()}>
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                            <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
                        </div>
                    </motion.div>

                    {/* 🔹 Supplier Overview */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start space-x-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                        {getInitials(supplier.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-2xl font-bold">{supplier.name}</div>
                                        {getStatusBadge(supplier.status)}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-sm text-muted-foreground">Email</div>
                                            <div className="font-medium">{supplier.email}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Phone</div>
                                            <div className="font-medium">{supplier.phone || "-"}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Rating</div>
                                            <div className="font-medium">
                                                {supplier.rating
                                                    ? "★".repeat(Math.round(Number(supplier.rating))) + "☆".repeat(5 - Math.round(Number(supplier.rating)))
                                                    : "-"}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{supplier.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{supplier.phone || "-"}</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                            <span className="text-sm">
                                                {supplier.address}, {supplier.city}, {supplier.state},{" "}
                                                {supplier.zipCode}, {supplier.country}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 🔹 Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                            <CardDescription>List of supplier products</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {supplier.products && supplier.products.length > 0 ? (
                                <ul>
                                    {supplier.products.map(p => (
                                        <li key={p.id}>
                                            {p.name} (SKU: {p.sku}, Status: {p.status})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No products found.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 🔹 Recent Purchase Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Purchase Orders</CardTitle>
                            <CardDescription>Last 10 purchase orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {supplier.purchaseOrders && supplier.purchaseOrders.length > 0 ? (
                                <ul>
                                    {supplier.purchaseOrders.map(po => (
                                        <li key={po.id}>
                                            PO #{po.poNumber} - {po.status} - Total: ${po.total} - {new Date(po.createdAt).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No purchase orders found.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        </ProtectedRoute>
    )
}
