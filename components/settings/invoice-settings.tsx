"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  FileText, 
  Upload, 
  Image,
  Settings,
  Palette,
  Type
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function InvoiceSettings() {
  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: "INV",
    numberFormat: "INV-{YYYY}-{MM}-{####}",
    nextNumber: 1001,
    footerText: "Thank you for your business!",
    terms: "Payment due within 30 days of invoice date.",
    logo: "/logo.png",
    showLogo: true,
    showTax: true,
    showDiscount: true,
    showShipping: true,
    currency: "USD",
    currencySymbol: "$",
    decimalPlaces: 2
  })

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" }
  ]

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInvoiceSettings({ ...invoiceSettings, logo: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Header</CardTitle>
          <CardDescription>
            Configure invoice header and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Settings */}
          <div className="space-y-4">
            <Label>Invoice Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {invoiceSettings.logo ? (
                  <img src={invoiceSettings.logo} alt="Invoice Logo" className="max-w-full max-h-full object-contain" />
                ) : (
                  <Image className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="space-y-2">
                <Button asChild>
                  <label htmlFor="invoice-logo-upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </label>
                </Button>
                <input
                  id="invoice-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground">
                  Recommended: 200x100px, PNG or JPG format
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={invoiceSettings.showLogo}
                onCheckedChange={(checked) => setInvoiceSettings({ ...invoiceSettings, showLogo: checked })}
              />
              <Label>Show logo on invoices</Label>
            </div>
          </div>

          {/* Invoice Numbering */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
              <Input
                id="invoice-prefix"
                value={invoiceSettings.prefix}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, prefix: e.target.value })}
                placeholder="INV"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-number">Next Invoice Number</Label>
              <Input
                id="next-number"
                type="number"
                value={invoiceSettings.nextNumber}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, nextNumber: Number(e.target.value) })}
                placeholder="1001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="number-format">Number Format</Label>
            <Input
              id="number-format"
              value={invoiceSettings.numberFormat}
              onChange={(e) => setInvoiceSettings({ ...invoiceSettings, numberFormat: e.target.value })}
              placeholder="INV-{YYYY}-{MM}-{####}"
            />
            <p className="text-sm text-muted-foreground">
              Use {`{YYYY}`} for year, {`{MM}`} for month, {`{####}`} for sequential number
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Content */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Content</CardTitle>
          <CardDescription>
            Configure what information to display on invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Tax Information</Label>
                <p className="text-sm text-muted-foreground">
                  Display tax rates and amounts on invoices
                </p>
              </div>
              <Switch
                checked={invoiceSettings.showTax}
                onCheckedChange={(checked) => setInvoiceSettings({ ...invoiceSettings, showTax: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Discount Information</Label>
                <p className="text-sm text-muted-foreground">
                  Display discount rates and amounts on invoices
                </p>
              </div>
              <Switch
                checked={invoiceSettings.showDiscount}
                onCheckedChange={(checked) => setInvoiceSettings({ ...invoiceSettings, showDiscount: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Shipping Information</Label>
                <p className="text-sm text-muted-foreground">
                  Display shipping costs and details on invoices
                </p>
              </div>
              <Switch
                checked={invoiceSettings.showShipping}
                onCheckedChange={(checked) => setInvoiceSettings({ ...invoiceSettings, showShipping: checked })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer-text">Footer Text</Label>
            <Textarea
              id="footer-text"
              value={invoiceSettings.footerText}
              onChange={(e) => setInvoiceSettings({ ...invoiceSettings, footerText: e.target.value })}
              placeholder="Thank you for your business!"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={invoiceSettings.terms}
              onChange={(e) => setInvoiceSettings({ ...invoiceSettings, terms: e.target.value })}
              placeholder="Payment due within 30 days of invoice date."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Settings</CardTitle>
          <CardDescription>
            Configure currency and formatting options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={invoiceSettings.currency} 
                onValueChange={(value) => {
                  const selectedCurrency = currencies.find(c => c.code === value)
                  setInvoiceSettings({ 
                    ...invoiceSettings, 
                    currency: value,
                    currencySymbol: selectedCurrency?.symbol || "$"
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="decimal-places">Decimal Places</Label>
              <Select 
                value={invoiceSettings.decimalPlaces.toString()} 
                onValueChange={(value) => setInvoiceSettings({ ...invoiceSettings, decimalPlaces: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select decimal places" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 (No decimals)</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2 (Standard)</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
