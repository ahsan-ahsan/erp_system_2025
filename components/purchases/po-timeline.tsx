"use client"

import { motion } from "framer-motion"
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  Square,
  Calendar,
  User
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineItem {
  status: string
  date: string | null
  description: string
}

interface POTimelineProps {
  timeline: TimelineItem[]
  currentStatus: string
}

export function POTimeline({ timeline, currentStatus }: POTimelineProps) {
  const getStatusIcon = (status: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    
    if (isCurrent) {
      return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
    }
    
    switch (status) {
      case "created":
        return <Square className="w-5 h-5 text-gray-400" />
      case "sent":
        return <Package className="w-5 h-5 text-blue-400" />
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-400" />
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-400" />
      case "received":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      default:
        return <Square className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) return "text-green-600"
    if (isCurrent) return "text-blue-600"
    
    switch (status) {
      case "created":
        return "text-gray-500"
      case "sent":
        return "text-blue-500"
      case "confirmed":
        return "text-blue-500"
      case "shipped":
        return "text-purple-500"
      case "received":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Completed
        </Badge>
      )
    }
    
    if (isCurrent) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          In Progress
        </Badge>
      )
    }
    
    return (
      <Badge variant="outline" className="text-gray-500">
        Pending
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Order Timeline</span>
        </CardTitle>
        <CardDescription>
          Track the progress of your purchase order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => {
            const isCompleted = item.date !== null
            const isCurrent = !isCompleted && index === timeline.findIndex(t => t.date === null)
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${
                    isCompleted ? 'bg-green-100 dark:bg-green-900' : 
                    isCurrent ? 'bg-blue-100 dark:bg-blue-900' : 
                    'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {getStatusIcon(item.status, isCompleted, isCurrent)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${
                      isCompleted ? 'bg-green-300 dark:bg-green-700' : 
                      'bg-gray-300 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${getStatusColor(item.status, isCompleted, isCurrent)}`}>
                      {item.description}
                    </h4>
                    {getStatusBadge(item.status, isCompleted, isCurrent)}
                  </div>
                  {item.date && (
                    <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
