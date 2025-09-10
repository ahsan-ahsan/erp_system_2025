"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Scan, Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (barcode: string) => void
}

export function BarcodeScanner({ isOpen, onClose, onScan }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Mock barcode scanning for demo purposes
  const mockBarcodes = [
    "1234567890123",
    "1234567890124", 
    "1234567890125",
    "1234567890126",
    "1234567890127"
  ]

  const startScanning = async () => {
    setIsScanning(true)
    
    // Simulate camera access
    try {
      // In a real implementation, you would access the camera here
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // if (videoRef.current) {
      //   videoRef.current.srcObject = stream
      //   streamRef.current = stream
      // }
      
      // For demo, simulate scanning after a delay
      setTimeout(() => {
        const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]
        setScannedCode(randomBarcode)
        onScan(randomBarcode)
        setIsScanning(false)
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const handleManualInput = () => {
    const manualCode = prompt("Enter barcode manually:")
    if (manualCode) {
      onScan(manualCode)
      onClose()
    }
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Scan className="w-5 h-5" />
            <span>Barcode Scanner</span>
          </DialogTitle>
          <DialogDescription>
            Scan a product barcode or enter manually
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scanner</CardTitle>
            <CardDescription>
              Position the barcode within the camera view
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                {isScanning ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"
                    />
                    <p className="text-sm text-muted-foreground">Scanning...</p>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Camera ready</p>
                  </div>
                )}
                
                {/* Scanning overlay */}
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 border-2 border-primary rounded-lg"
                  >
                    <motion.div
                      animate={{ y: [0, 200, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-full h-0.5 bg-primary"
                    />
                  </motion.div>
                )}
              </div>

              {/* Controls */}
              <div className="flex space-x-2">
                {!isScanning ? (
                  <Button onClick={startScanning} className="flex-1">
                    <Scan className="w-4 h-4 mr-2" />
                    Start Scanning
                  </Button>
                ) : (
                  <Button onClick={stopScanning} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Stop Scanning
                  </Button>
                )}
                
                <Button onClick={handleManualInput} variant="outline">
                  Manual Entry
                </Button>
              </div>

              {/* Scanned Code Display */}
              {scannedCode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Scanned: {scannedCode}
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}