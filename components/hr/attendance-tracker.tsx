"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"

export function AttendanceTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Mock attendance data
  const attendanceData = [
    {
      id: 1,
      name: "John Doe",
      avatar: "/avatars/john.jpg",
      department: "IT",
      attendance: {
        "2024-01-01": { status: "present", checkIn: "09:00", checkOut: "17:30" },
        "2024-01-02": { status: "present", checkIn: "09:15", checkOut: "17:45" },
        "2024-01-03": { status: "late", checkIn: "09:45", checkOut: "18:00" },
        "2024-01-04": { status: "present", checkIn: "08:55", checkOut: "17:20" },
        "2024-01-05": { status: "absent", checkIn: null, checkOut: null },
        "2024-01-08": { status: "present", checkIn: "09:00", checkOut: "17:30" },
        "2024-01-09": { status: "present", checkIn: "09:10", checkOut: "17:40" },
        "2024-01-10": { status: "half-day", checkIn: "09:00", checkOut: "13:00" }
      }
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "/avatars/jane.jpg",
      department: "HR",
      attendance: {
        "2024-01-01": { status: "present", checkIn: "08:45", checkOut: "17:15" },
        "2024-01-02": { status: "present", checkIn: "08:50", checkOut: "17:20" },
        "2024-01-03": { status: "present", checkIn: "09:00", checkOut: "17:30" },
        "2024-01-04": { status: "present", checkIn: "08:55", checkOut: "17:25" },
        "2024-01-05": { status: "present", checkIn: "09:05", checkOut: "17:35" },
        "2024-01-08": { status: "present", checkIn: "08:45", checkOut: "17:15" },
        "2024-01-09": { status: "present", checkIn: "08:50", checkOut: "17:20" },
        "2024-01-10": { status: "present", checkIn: "09:00", checkOut: "17:30" }
      }
    }
  ]

  const employees = [
    { id: "all", name: "All Employees" },
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "late":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "half-day":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "half-day":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const filteredEmployees = selectedEmployee === "all" 
    ? attendanceData 
    : attendanceData.filter(emp => emp.id.toString() === selectedEmployee)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attendance Tracker</h2>
          <p className="text-muted-foreground">
            Track employee attendance and working hours
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(currentDate, "MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={currentDate}
                    onSelect={(date) => {
                      if (date) setCurrentDate(date)
                      setIsCalendarOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>
                {format(monthStart, "MMMM yyyy")} - {filteredEmployees.length} employees
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.department}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {daysInMonth.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd")
                    const attendance = employee.attendance[dateStr as keyof typeof employee.attendance] || null
                    
                    return (
                      <div
                        key={dateStr}
                        className="flex flex-col items-center p-2 border rounded-lg min-h-[60px]"
                      >
                        <span className="text-xs font-medium mb-1">
                          {format(day, "d")}
                        </span>
                        {attendance ? (
                          <div className="flex flex-col items-center space-y-1">
                            {getStatusIcon(attendance.status)}
                            <Badge className={`text-xs ${getStatusColor(attendance.status)}`}>
                              {attendance.status}
                            </Badge>
                            {attendance.checkIn && (
                              <span className="text-xs text-muted-foreground">
                                {attendance.checkIn}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-muted-foreground">-</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

