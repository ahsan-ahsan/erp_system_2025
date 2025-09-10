"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Phone, 
  Mail,
  ExternalLink,
  ChevronRight,
  Play,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface POSHelpProps {
  isOpen: boolean
  onClose: () => void
}

export function POSHelp({ isOpen, onClose }: POSHelpProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("getting-started")

  const helpSections = {
    "getting-started": {
      title: "Getting Started",
      icon: BookOpen,
      items: [
        {
          title: "First Time Setup",
          description: "Learn how to configure your POS system for the first time",
          type: "guide",
          estimatedTime: "5 min"
        },
        {
          title: "Adding Products",
          description: "How to add and manage products in your inventory",
          type: "guide",
          estimatedTime: "3 min"
        },
        {
          title: "Processing Your First Sale",
          description: "Step-by-step guide to complete a transaction",
          type: "guide",
          estimatedTime: "2 min"
        },
        {
          title: "Setting Up Payment Methods",
          description: "Configure cash, card, and digital payment options",
          type: "guide",
          estimatedTime: "4 min"
        }
      ]
    },
    "features": {
      title: "Features",
      icon: HelpCircle,
      items: [
        {
          title: "Barcode Scanning",
          description: "How to use the barcode scanner to add products",
          type: "video",
          estimatedTime: "2 min"
        },
        {
          title: "Customer Management",
          description: "Adding and managing customer information",
          type: "guide",
          estimatedTime: "3 min"
        },
        {
          title: "Inventory Management",
          description: "Track stock levels and manage inventory",
          type: "guide",
          estimatedTime: "5 min"
        },
        {
          title: "Reports and Analytics",
          description: "Understanding your sales data and reports",
          type: "guide",
          estimatedTime: "4 min"
        }
      ]
    },
    "troubleshooting": {
      title: "Troubleshooting",
      icon: MessageCircle,
      items: [
        {
          title: "Printer Not Working",
          description: "Common printer issues and solutions",
          type: "guide",
          estimatedTime: "3 min"
        },
        {
          title: "Payment Processing Errors",
          description: "Troubleshoot payment gateway issues",
          type: "guide",
          estimatedTime: "4 min"
        },
        {
          title: "Barcode Scanner Issues",
          description: "Fix barcode scanning problems",
          type: "guide",
          estimatedTime: "2 min"
        },
        {
          title: "Data Sync Problems",
          description: "Resolve data synchronization issues",
          type: "guide",
          estimatedTime: "3 min"
        }
      ]
    }
  }

  const filteredSections = Object.entries(helpSections).map(([key, section]) => ({
    key,
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }))

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />
      case "guide":
        return <BookOpen className="w-4 h-4" />
      default:
        return <HelpCircle className="w-4 h-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "video":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Video</Badge>
      case "guide":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Guide</Badge>
      default:
        return <Badge variant="secondary">Help</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>POS Help Center</span>
          </DialogTitle>
          <DialogDescription>
            Find answers to common questions and learn how to use the POS system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Video className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Video Tutorials</h3>
                    <p className="text-sm text-muted-foreground">Watch step-by-step videos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">Get instant help</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">Call (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>

            {filteredSections.map((section) => (
              <TabsContent key={section.key} value={section.key} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-sm">{item.title}</h3>
                                <div className="flex items-center space-x-2">
                                  {getTypeBadge(item.type)}
                                  <span className="text-xs text-muted-foreground">
                                    {item.estimatedTime}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {item.description}
                              </p>
                              <Button size="sm" variant="outline" className="w-full">
                                <ChevronRight className="w-3 h-3 mr-1" />
                                Open
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>
                Contact our support team for personalized assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Email Support</div>
                    <div className="text-xs text-muted-foreground">support@yourstore.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Phone Support</div>
                    <div className="text-xs text-muted-foreground">(555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Knowledge Base</div>
                    <div className="text-xs text-muted-foreground">help.yourstore.com</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
