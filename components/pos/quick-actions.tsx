"use client"

import { motion } from "framer-motion"
import { 
  Calculator, 
  Scan, 
  CreditCard, 
  Receipt, 
  User, 
  Package,
  History,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickActionsProps {
  onCalculator: () => void
  onBarcodeScan: () => void
  onPayment: () => void
  onReceipt: () => void
  onCustomer: () => void
  onProducts: () => void
  onHistory: () => void
  onSettings: () => void
}

export function QuickActions({
  onCalculator,
  onBarcodeScan,
  onPayment,
  onReceipt,
  onCustomer,
  onProducts,
  onHistory,
  onSettings
}: QuickActionsProps) {
  const actions = [
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
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common POS operations and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
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
  )
}
