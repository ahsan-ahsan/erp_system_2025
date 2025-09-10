"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  DollarSign, 
  Percent, 
  Plus, 
  Trash2, 
  Edit,
  Save,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export function CurrencyTaxSettings() {
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    exchangeRate: 1.0,
    isDefault: true
  })

  const [taxes, setTaxes] = useState([
    { id: 1, name: "Sales Tax", rate: 8.5, type: "percentage", isActive: true },
    { id: 2, name: "VAT", rate: 20.0, type: "percentage", isActive: true },
    { id: 3, name: "Service Tax", rate: 5.0, type: "percentage", isActive: false }
  ])

  const [isAddingTax, setIsAddingTax] = useState(false)
  const [editingTax, setEditingTax] = useState<number | null>(null)
  const [newTax, setNewTax] = useState({ name: "", rate: 0, type: "percentage" })

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" }
  ]

  const handleAddTax = () => {
    if (newTax.name && newTax.rate > 0) {
      const tax = {
        id: Math.max(...taxes.map(t => t.id)) + 1,
        name: newTax.name,
        rate: newTax.rate,
        type: newTax.type,
        isActive: true
      }
      setTaxes([...taxes, tax])
      setNewTax({ name: "", rate: 0, type: "percentage" })
      setIsAddingTax(false)
    }
  }

  const handleEditTax = (id: number) => {
    setEditingTax(id)
    const tax = taxes.find(t => t.id === id)
    if (tax) {
      setNewTax({ name: tax.name, rate: tax.rate, type: tax.type })
    }
  }

  const handleSaveTax = () => {
    if (editingTax && newTax.name && newTax.rate > 0) {
      setTaxes(taxes.map(t => 
        t.id === editingTax 
          ? { ...t, name: newTax.name, rate: newTax.rate, type: newTax.type }
          : t
      ))
      setEditingTax(null)
      setNewTax({ name: "", rate: 0, type: "percentage" })
    }
  }

  const handleDeleteTax = (id: number) => {
    setTaxes(taxes.filter(t => t.id !== id))
  }

  const handleToggleTax = (id: number) => {
    setTaxes(taxes.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ))
  }

  return (
    <div className="space-y-6">
      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Settings</CardTitle>
          <CardDescription>
            Configure default currency and exchange rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select 
                value={currency.code} 
                onValueChange={(value) => {
                  const selectedCurrency = currencies.find(c => c.code === value)
                  if (selectedCurrency) {
                    setCurrency({
                      ...currency,
                      code: selectedCurrency.code,
                      symbol: selectedCurrency.symbol,
                      name: selectedCurrency.name
                    })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name} ({curr.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchange-rate">Exchange Rate</Label>
              <Input
                id="exchange-rate"
                type="number"
                step="0.01"
                value={currency.exchangeRate}
                onChange={(e) => setCurrency({ ...currency, exchangeRate: Number(e.target.value) })}
                placeholder="1.00"
              />
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">Current Setting:</span>
              <Badge variant="outline">
                {currency.symbol} {currency.name} ({currency.code})
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>
                Manage tax rates and configurations
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddingTax(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tax
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add/Edit Tax Form */}
            {(isAddingTax || editingTax) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border rounded-lg bg-muted/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-name">Tax Name</Label>
                    <Input
                      id="tax-name"
                      value={newTax.name}
                      onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                      placeholder="e.g., Sales Tax"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Rate</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      step="0.01"
                      value={newTax.rate}
                      onChange={(e) => setNewTax({ ...newTax, rate: Number(e.target.value) })}
                      placeholder="8.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-type">Type</Label>
                    <Select 
                      value={newTax.type} 
                      onValueChange={(value) => setNewTax({ ...newTax, type: value as "percentage" | "fixed" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Button onClick={editingTax ? handleSaveTax : handleAddTax}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingTax ? "Save" : "Add"} Tax
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddingTax(false)
                      setEditingTax(null)
                      setNewTax({ name: "", rate: 0, type: "percentage" })
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Tax List */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Name</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxes.map((tax) => (
                    <TableRow key={tax.id}>
                      <TableCell className="font-medium">{tax.name}</TableCell>
                      <TableCell>
                        {tax.rate} {tax.type === "percentage" ? "%" : currency.symbol}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {tax.type === "percentage" ? "Percentage" : "Fixed Amount"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={tax.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {tax.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleTax(tax.id)}
                          >
                            {tax.isActive ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTax(tax.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTax(tax.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

