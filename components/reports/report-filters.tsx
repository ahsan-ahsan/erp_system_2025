"use client"

import { useState } from "react"
import { Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface ReportFiltersProps {
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
  selectedCustomer: string
  setSelectedCustomer: (customer: string) => void
  selectedProduct: string
  setSelectedProduct: (product: string) => void
}

export function ReportFilters({
  dateRange,
  setDateRange,
  selectedCustomer,
  setSelectedCustomer,
  selectedProduct,
  setSelectedProduct
}: ReportFiltersProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const customers = [
    { id: "all", name: "All Customers" },
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
    { id: "4", name: "Alice Brown" }
  ]

  const products = [
    { id: "all", name: "All Products" },
    { id: "1", name: "Laptop Pro" },
    { id: "2", name: "Wireless Mouse" },
    { id: "3", name: "Mechanical Keyboard" },
    { id: "4", name: "Monitor 24\"" }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Date Range */}
      <div className="space-y-2">
        <Label htmlFor="date-range">Date Range</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-range"
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Customer Filter */}
      <div className="space-y-2">
        <Label htmlFor="customer">Customer</Label>
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Filter */}
      <div className="space-y-2">
        <Label htmlFor="product">Product</Label>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Date Presets */}
      <div className="space-y-2">
        <Label>Quick Presets</Label>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              setDateRange({
                from: new Date(today.getFullYear(), today.getMonth(), 1),
                to: today
              })
            }}
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
              const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
              setDateRange({
                from: lastMonth,
                to: lastDayOfLastMonth
              })
            }}
          >
            Last Month
          </Button>
        </div>
      </div>
    </div>
  )
}

