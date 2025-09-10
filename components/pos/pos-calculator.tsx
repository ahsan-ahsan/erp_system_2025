"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"

interface POSCalculatorProps {
  isOpen: boolean
  onClose: () => void
  onResult: (result: number) => void
}

export function POSCalculator({ isOpen, onClose, onResult }: POSCalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num)
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const handleOperation = (op: string) => {
    const inputValue = parseFloat(display)
    
    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)
      
      setDisplay(String(newValue))
      setPreviousValue(newValue)
    } else {
      setPreviousValue(inputValue)
    }
    
    setWaitingForNewValue(true)
    setOperation(op)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    const inputValue = parseFloat(display)
    
    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.")
      setWaitingForNewValue(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
    }
  }

  const handleUseResult = () => {
    onResult(parseFloat(display))
    onClose()
  }

  const buttons = [
    { label: "C", action: handleClear, className: "col-span-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800" },
    { label: "⌫", action: handleBackspace, className: "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800" },
    { label: "÷", action: () => handleOperation("÷"), className: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800" },
    
    { label: "7", action: () => handleNumber("7"), className: "" },
    { label: "8", action: () => handleNumber("8"), className: "" },
    { label: "9", action: () => handleNumber("9"), className: "" },
    { label: "×", action: () => handleOperation("×"), className: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800" },
    
    { label: "4", action: () => handleNumber("4"), className: "" },
    { label: "5", action: () => handleNumber("5"), className: "" },
    { label: "6", action: () => handleNumber("6"), className: "" },
    { label: "-", action: () => handleOperation("-"), className: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800" },
    
    { label: "1", action: () => handleNumber("1"), className: "" },
    { label: "2", action: () => handleNumber("2"), className: "" },
    { label: "3", action: () => handleNumber("3"), className: "" },
    { label: "+", action: () => handleOperation("+"), className: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800" },
    
    { label: "0", action: () => handleNumber("0"), className: "col-span-2" },
    { label: ".", action: handleDecimal, className: "" },
    { label: "=", action: handleEquals, className: "bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Calculator</span>
          </DialogTitle>
          <DialogDescription>
            Use the calculator for quick calculations
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="p-4">
            {/* Display */}
            <div className="mb-4 p-4 bg-muted rounded-lg text-right">
              <div className="text-2xl font-mono font-bold">
                {display}
              </div>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-4 gap-2">
              {buttons.map((button, index) => (
                <motion.div key={button.label}>
                  <Button
                    onClick={button.action}
                    className={`h-12 text-lg font-medium ${button.className}`}
                    variant="outline"
                  >
                    {button.label}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Use Result Button */}
            <div className="mt-4">
              <Button 
                onClick={handleUseResult} 
                className="w-full"
                size="lg"
              >
                Use Result: ${parseFloat(display).toFixed(2)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}