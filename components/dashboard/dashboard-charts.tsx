"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Monthly Sales Data
const monthlySalesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Sales',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
  ],
}

// Top Selling Products Data
const topProductsData = {
  labels: ['Laptop Pro', 'Wireless Mouse', 'Mechanical Keyboard', 'Monitor 4K', 'Webcam HD'],
  datasets: [
    {
      label: 'Units Sold',
      data: [120, 89, 76, 65, 54],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(139, 92, 246)',
      ],
      borderWidth: 1,
    },
  ],
}

// Sales by Category Data
const salesByCategoryData = {
  labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
  datasets: [
    {
      data: [45, 25, 15, 10, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(139, 92, 246)',
      ],
      borderWidth: 2,
    },
  ],
}

// Payment Methods Data
const paymentMethodsData = {
  labels: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash', 'Cryptocurrency'],
  datasets: [
    {
      data: [40, 30, 15, 10, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(139, 92, 246)',
      ],
      borderWidth: 2,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

export function DashboardCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Monthly Sales Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Monthly Sales
          </CardTitle>
          <CardDescription>
            Sales performance over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line data={monthlySalesData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Products Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Top Selling Products
          </CardTitle>
          <CardDescription>
            Best performing products this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar data={topProductsData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Sales by Category Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Sales by Category
          </CardTitle>
          <CardDescription>
            Revenue distribution across product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Pie data={salesByCategoryData} options={pieChartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Donut Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🍩 Payment Methods
          </CardTitle>
          <CardDescription>
            Customer payment preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Doughnut data={paymentMethodsData} options={pieChartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
