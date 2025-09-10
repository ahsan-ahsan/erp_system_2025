"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Settings, 
  Save, 
  X, 
  CreditCard, 
  Receipt, 
  Calculator,
  Scan,
  Bell,
  Shield,
  Monitor
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface POSSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function POSSettings({ isOpen, onClose }: POSSettingsProps) {
  const [settings, setSettings] = useState({
    // General Settings
    storeName: "Your Store Name",
    storeAddress: "123 Business Street, City, State 12345",
    storePhone: "(555) 123-4567",
    storeEmail: "info@yourstore.com",
    
    // POS Settings
    defaultTaxRate: 8.0,
    currency: "USD",
    receiptFooter: "Thank you for your business!",
    autoPrintReceipt: true,
    requireCustomerInfo: false,
    
    // Payment Settings
    acceptCash: true,
    acceptCard: true,
    acceptDigitalWallet: true,
    requirePaymentConfirmation: true,
    
    // Display Settings
    showProductImages: true,
    showStockLevels: true,
    showCustomerHistory: true,
    darkMode: false,
    
    // Security Settings
    requireManagerApproval: false,
    sessionTimeout: 30,
    enableAuditLog: true,
    
    // Notifications
    lowStockAlert: true,
    salesTargetAlert: true,
    dailyReportEmail: true
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast.success("Settings saved successfully!")
    onClose()
  }

  const handleReset = () => {
    // Reset to default values
    toast.success("Settings reset to defaults")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>POS Settings</span>
          </DialogTitle>
          <DialogDescription>
            Configure your point of sale system settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Store Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>Store Information</span>
                </CardTitle>
                <CardDescription>
                  Basic store details for receipts and invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={settings.storeName}
                      onChange={(e) => handleSettingChange("storeName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Phone Number</Label>
                    <Input
                      id="storePhone"
                      value={settings.storePhone}
                      onChange={(e) => handleSettingChange("storePhone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Address</Label>
                  <Input
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => handleSettingChange("storeAddress", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => handleSettingChange("storeEmail", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* POS Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>POS Configuration</span>
                </CardTitle>
                <CardDescription>
                  Configure how the POS system behaves
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      value={settings.defaultTaxRate}
                      onChange={(e) => handleSettingChange("defaultTaxRate", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptFooter">Receipt Footer</Label>
                  <Input
                    id="receiptFooter"
                    value={settings.receiptFooter}
                    onChange={(e) => handleSettingChange("receiptFooter", e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Print Receipt</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically print receipt after payment
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoPrintReceipt}
                      onCheckedChange={(checked) => handleSettingChange("autoPrintReceipt", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Customer Info</Label>
                      <p className="text-sm text-muted-foreground">
                        Require customer information for all transactions
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireCustomerInfo}
                      onCheckedChange={(checked) => handleSettingChange("requireCustomerInfo", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure accepted payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Accept Cash</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow cash payments
                      </p>
                    </div>
                    <Switch
                      checked={settings.acceptCash}
                      onCheckedChange={(checked) => handleSettingChange("acceptCash", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Accept Card</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow credit/debit card payments
                      </p>
                    </div>
                    <Switch
                      checked={settings.acceptCard}
                      onCheckedChange={(checked) => handleSettingChange("acceptCard", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Accept Digital Wallet</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow Apple Pay, Google Pay, etc.
                      </p>
                    </div>
                    <Switch
                      checked={settings.acceptDigitalWallet}
                      onCheckedChange={(checked) => handleSettingChange("acceptDigitalWallet", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Payment Confirmation</Label>
                      <p className="text-sm text-muted-foreground">
                        Require confirmation before processing payment
                      </p>
                    </div>
                    <Switch
                      checked={settings.requirePaymentConfirmation}
                      onCheckedChange={(checked) => handleSettingChange("requirePaymentConfirmation", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Display Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>Display Settings</span>
                </CardTitle>
                <CardDescription>
                  Customize the POS interface appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Product Images</Label>
                      <p className="text-sm text-muted-foreground">
                        Display product images in the interface
                      </p>
                    </div>
                    <Switch
                      checked={settings.showProductImages}
                      onCheckedChange={(checked) => handleSettingChange("showProductImages", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Stock Levels</Label>
                      <p className="text-sm text-muted-foreground">
                        Display stock levels for products
                      </p>
                    </div>
                    <Switch
                      checked={settings.showStockLevels}
                      onCheckedChange={(checked) => handleSettingChange("showStockLevels", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Customer History</Label>
                      <p className="text-sm text-muted-foreground">
                        Display customer purchase history
                      </p>
                    </div>
                    <Switch
                      checked={settings.showCustomerHistory}
                      onCheckedChange={(checked) => handleSettingChange("showCustomerHistory", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for the interface
                      </p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>
                  Configure system notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Stock Alert</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when products are running low
                      </p>
                    </div>
                    <Switch
                      checked={settings.lowStockAlert}
                      onCheckedChange={(checked) => handleSettingChange("lowStockAlert", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sales Target Alert</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when sales targets are reached
                      </p>
                    </div>
                    <Switch
                      checked={settings.salesTargetAlert}
                      onCheckedChange={(checked) => handleSettingChange("salesTargetAlert", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Daily Report Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Send daily sales report via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.dailyReportEmail}
                      onCheckedChange={(checked) => handleSettingChange("dailyReportEmail", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}