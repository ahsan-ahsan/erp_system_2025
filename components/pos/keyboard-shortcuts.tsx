"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Keyboard, 
  X, 
  Search, 
  Calculator, 
  Scan, 
  CreditCard, 
  Receipt, 
  User, 
  Package,
  History,
  Settings,
  Save,
  Delete,
  ArrowUp,
  ArrowDown,
  Check,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const shortcuts = [
    {
      category: "General",
      items: [
        { key: "Ctrl + S", description: "Save current transaction", icon: Save },
        { key: "Ctrl + N", description: "New transaction", icon: Receipt },
        { key: "Ctrl + D", description: "Delete selected item", icon: Delete },
        { key: "Escape", description: "Cancel current action", icon: XCircle },
        { key: "Enter", description: "Confirm selection", icon: Check }
      ]
    },
    {
      category: "Navigation",
      items: [
        { key: "Ctrl + F", description: "Focus search", icon: Search },
        { key: "↑ / ↓", description: "Navigate items", icon: ArrowUp },
        { key: "Tab", description: "Next field", icon: ArrowDown },
        { key: "Shift + Tab", description: "Previous field", icon: ArrowUp }
      ]
    },
    {
      category: "Tools",
      items: [
        { key: "F1", description: "Open calculator", icon: Calculator },
        { key: "F2", description: "Scan barcode", icon: Scan },
        { key: "F3", description: "Process payment", icon: CreditCard },
        { key: "F4", description: "Print receipt", icon: Receipt },
        { key: "F5", description: "Add customer", icon: User },
        { key: "F6", description: "Browse products", icon: Package },
        { key: "F7", description: "View history", icon: History },
        { key: "F8", description: "Open settings", icon: Settings }
      ]
    },
    {
      category: "Cart Operations",
      items: [
        { key: "+", description: "Increase quantity", icon: ArrowUp },
        { key: "-", description: "Decrease quantity", icon: ArrowDown },
        { key: "Delete", description: "Remove from cart", icon: Delete },
        { key: "Space", description: "Add to cart", icon: Package }
      ]
    }
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      const key = event.key
      const ctrlKey = event.ctrlKey
      const shiftKey = event.shiftKey
      const altKey = event.altKey

      let keyCombo = ""
      if (ctrlKey) keyCombo += "Ctrl + "
      if (shiftKey) keyCombo += "Shift + "
      if (altKey) keyCombo += "Alt + "
      keyCombo += key

      setActiveKey(keyCombo)
      setTimeout(() => setActiveKey(null), 200)

      // Handle specific shortcuts
      if (ctrlKey && key === 's') {
        event.preventDefault()
        // Handle save
      }
      if (ctrlKey && key === 'n') {
        event.preventDefault()
        // Handle new transaction
      }
      if (key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
          <DialogDescription>
            Learn keyboard shortcuts to work faster in the POS system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {shortcuts.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.items.map((shortcut, index) => (
                      <motion.div
                        key={shortcut.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: categoryIndex * 0.1 + index * 0.05 }}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          activeKey === shortcut.key 
                            ? 'bg-primary/10 border-primary' 
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <shortcut.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{shortcut.description}</span>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">
                          {shortcut.key}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
