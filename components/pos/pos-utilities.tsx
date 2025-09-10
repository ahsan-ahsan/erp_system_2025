"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Calculator, 
  Scan, 
  CreditCard, 
  Receipt, 
  User, 
  Package,
  History,
  Settings,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface POSUtilitiesProps {
  onCalculator: () => void
  onBarcodeScan: () => void
  onPayment: () => void
  onReceipt: () => void
  onCustomer: () => void
  onProducts: () => void
  onHistory: () => void
  onSettings: () => void
}

export function POSUtilities({
  onCalculator,
  onBarcodeScan,
  onPayment,
  onReceipt,
  onCustomer,
  onProducts,
  onHistory,
  onSettings
}: POSUtilitiesProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [showSyncDialog, setShowSyncDialog] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    setSyncProgress(0)
    setShowSyncDialog(true)

    // Simulate sync process
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSyncing(false)
          toast.success("Sync completed successfully!")
          setTimeout(() => setShowSyncDialog(false), 1000)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleBackup = () => {
    toast.success("Backup created successfully!")
  }

  const handleRestore = () => {
    toast.success("Data restored successfully!")
  }

  const systemStatus = {
    database: "connected",
    paymentGateway: "connected", 
    printer: "connected",
    barcodeScanner: "connected",
    network: "connected"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "disconnected":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Connected</Badge>
      case "disconnected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Disconnected</Badge>
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Warning</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>System Status</span>
            </CardTitle>
            <CardDescription>
              Current status of POS system components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(systemStatus).map(([component, status]) => (
                <motion.div
                  key={component}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <span className="text-sm font-medium capitalize">
                      {component.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  {getStatusBadge(status)}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common POS operations and utilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  icon: Calculator,
                  label: "Calculator",
                  description: "Quick calculations",
                  action: onCalculator,
                  color: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                },
                {
                  icon: Scan,
                  label: "Scan Barcode",
                  description: "Scan product barcode",
                  action: onBarcodeScan,
                  color: "bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
                },
                {
                  icon: CreditCard,
                  label: "Payment",
                  description: "Process payment",
                  action: onPayment,
                  color: "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800"
                },
                {
                  icon: Receipt,
                  label: "Print Receipt",
                  description: "Print current receipt",
                  action: onReceipt,
                  color: "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800"
                },
                {
                  icon: User,
                  label: "Customer",
                  description: "Add customer info",
                  action: onCustomer,
                  color: "bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900 dark:hover:bg-cyan-800"
                },
                {
                  icon: Package,
                  label: "Products",
                  description: "Browse products",
                  action: onProducts,
                  color: "bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800"
                },
                {
                  icon: History,
                  label: "History",
                  description: "View transaction history",
                  action: onHistory,
                  color: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800"
                },
                {
                  icon: Settings,
                  label: "Settings",
                  description: "POS settings",
                  action: onSettings,
                  color: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
                }
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                >
                  <Button
                    onClick={action.action}
                    variant="outline"
                    className={`w-full h-auto p-4 flex flex-col items-center space-y-2 ${action.color}`}
                  >
                    <action.icon className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Backup, restore, and sync your POS data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleSync}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                disabled={isSyncing}
              >
                <RefreshCw className={`w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />
                <div className="text-center">
                  <div className="font-medium text-sm">Sync Data</div>
                  <div className="text-xs text-muted-foreground">Sync with server</div>
                </div>
              </Button>

              <Button
                onClick={handleBackup}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Download className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">Backup</div>
                  <div className="text-xs text-muted-foreground">Create backup</div>
                </div>
              </Button>

              <Button
                onClick={handleRestore}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Upload className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">Restore</div>
                  <div className="text-xs text-muted-foreground">Restore data</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sync Progress Dialog */}
      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Syncing Data</span>
            </DialogTitle>
            <DialogDescription>
              Please wait while we sync your data with the server
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>

            <div className="text-sm text-muted-foreground">
              {isSyncing ? "Syncing transactions, products, and customer data..." : "Sync completed!"}
            </div>
          </div>

          {!isSyncing && (
            <DialogFooter>
              <Button onClick={() => setShowSyncDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
