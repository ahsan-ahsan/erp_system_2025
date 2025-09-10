"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  HardDrive,
  Cloud,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BackupSettingsProps {
  onBackup: () => void
}

export function BackupSettings({ onBackup }: BackupSettingsProps) {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)

  // Mock backup data
  const backups = [
    {
      id: 1,
      name: "backup_2024_01_15_143022.sql",
      size: "2.3 MB",
      date: "2024-01-15 14:30:22",
      type: "full",
      status: "completed"
    },
    {
      id: 2,
      name: "backup_2024_01_14_143022.sql",
      size: "2.1 MB",
      date: "2024-01-14 14:30:22",
      type: "full",
      status: "completed"
    },
    {
      id: 3,
      name: "backup_2024_01_13_143022.sql",
      size: "2.0 MB",
      date: "2024-01-13 14:30:22",
      type: "incremental",
      status: "completed"
    }
  ]

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    setBackupProgress(0)
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsCreatingBackup(false)
          onBackup()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDownloadBackup = (backupId: number) => {
    console.log("Downloading backup:", backupId)
  }

  const handleDeleteBackup = (backupId: number) => {
    console.log("Deleting backup:", backupId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Create Backup</CardTitle>
          <CardDescription>
            Create a complete snapshot of your database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleCreateBackup} disabled={isCreatingBackup} className="h-20">
              <div className="flex flex-col items-center space-y-2">
                <Database className="h-6 w-6" />
                <span>Full Backup</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center space-y-2">
                <HardDrive className="h-6 w-6" />
                <span>Incremental</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="flex flex-col items-center space-y-2">
                <Cloud className="h-6 w-6" />
                <span>Cloud Backup</span>
              </div>
            </Button>
          </div>

          {isCreatingBackup && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Creating backup...</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>
            View and manage your database backups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups.map((backup) => (
              <motion.div
                key={backup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">{backup.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{backup.size}</span>
                      <span>•</span>
                      <span>{backup.date}</span>
                      <span>•</span>
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(backup.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadBackup(backup.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBackup(backup.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Settings</CardTitle>
          <CardDescription>
            Configure automatic backup preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Automatic backups are currently disabled. Enable them to ensure your data is always protected.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Automatic Backups</h3>
                <p className="text-sm text-muted-foreground">
                  Create backups automatically at scheduled intervals
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Cloud Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Store backups in cloud storage for additional security
                </p>
              </div>
              <Button variant="outline" size="sm">
                Setup
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Backup Retention</h3>
                <p className="text-sm text-muted-foreground">
                  Keep backups for 30 days (current setting)
                </p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
