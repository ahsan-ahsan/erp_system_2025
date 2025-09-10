"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Settings, 
  Upload, 
  Download, 
  Save, 
  RefreshCw,
  Palette,
  Database,
  Shield,
  Globe,
  DollarSign,
  FileText,
  Image,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"

import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"

import { GeneralSettings } from "@/components/settings/general-settings"
import { InvoiceSettings } from "@/components/settings/invoice-settings"
import { CurrencyTaxSettings } from "@/components/settings/currency-tax-settings"
import { BackupSettings } from "@/components/settings/backup-settings"
import { ThemeSettings } from "@/components/settings/theme-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [showBackupDialog, setShowBackupDialog] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Settings saved successfully")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBackup = async () => {
    console.log("Creating database backup...")
    // Implementation for backup
    setShowBackupDialog(false)
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Configure system settings, themes, and manage backups
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">
                <Settings className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="invoice">
                <FileText className="h-4 w-4 mr-2" />
                Invoice
              </TabsTrigger>
              <TabsTrigger value="currency">
                <DollarSign className="h-4 w-4 mr-2" />
                Currency & Tax
              </TabsTrigger>
              <TabsTrigger value="theme">
                <Palette className="h-4 w-4 mr-2" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="backup">
                <Database className="h-4 w-4 mr-2" />
                Backup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <GeneralSettings />
            </TabsContent>

            <TabsContent value="invoice" className="space-y-6">
              <InvoiceSettings />
            </TabsContent>

            <TabsContent value="currency" className="space-y-6">
              <CurrencyTaxSettings />
            </TabsContent>

            <TabsContent value="theme" className="space-y-6">
              <ThemeSettings />
            </TabsContent>

            <TabsContent value="backup" className="space-y-6">
              <BackupSettings onBackup={() => setShowBackupDialog(true)} />
            </TabsContent>
          </Tabs>

          {/* Backup Confirmation Dialog */}
          <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Database Backup</DialogTitle>
                <DialogDescription>
                  This will create a complete snapshot of your database. The backup process may take a few minutes.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    The backup will include all data: products, customers, sales, inventory, and user accounts.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBackupDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBackup}>
                  <Database className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
