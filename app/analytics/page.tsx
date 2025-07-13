'use client'

import { useEffect, useMemo } from 'react'
import { useEmployeeStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Users, Building2, Star, DollarSign } from 'lucide-react'
import { Department } from '@/types'
import { formatCurrency } from '@/lib/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function AnalyticsPage() {
  const { employees, loading, fetchEmployeesData } = useEmployeeStore()

  // Fetch employees on mount if not loaded
  useEffect(() => {
    if (employees.length === 0 && !loading) {
      fetchEmployeesData()
    }
  }, [employees.length, loading, fetchEmployeesData])

  // Calculate analytics
  const analytics = useMemo(() => {
    if (employees.length === 0) {
      return {
        totalEmployees: 0,
        departmentStats: [],
        performanceStats: [],
        salaryStats: { average: 0, median: 0, min: 0, max: 0 },
        averageAge: 0,
        averageRating: 0
      }
    }

    // Department distribution
    const departmentCounts = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1
      return acc
    }, {} as Record<Department, number>)

    const departmentStats = Object.entries(departmentCounts).map(([dept, count]) => ({
      department: dept as Department,
      count,
      percentage: (count / employees.length) * 100
    })).sort((a, b) => b.count - a.count)

    // Performance rating distribution
    const performanceCounts = employees.reduce((acc, emp) => {
      acc[emp.performanceRating] = (acc[emp.performanceRating] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const performanceStats = Object.entries(performanceCounts).map(([rating, count]) => ({
      rating: Number(rating),
      count,
      percentage: (count / employees.length) * 100
    })).sort((a, b) => a.rating - b.rating)

    // Salary statistics
    const salaries = employees.map(emp => emp.salary).sort((a, b) => a - b)
    const salaryStats = {
      average: salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length,
      median: salaries[Math.floor(salaries.length / 2)],
      min: salaries[0],
      max: salaries[salaries.length - 1]
    }

    // Age statistics
    const averageAge = employees.reduce((sum, emp) => sum + emp.age, 0) / employees.length

    // Performance statistics
    const averageRating = employees.reduce((sum, emp) => sum + emp.performanceRating, 0) / employees.length

    return {
      totalEmployees: employees.length,
      departmentStats,
      performanceStats,
      salaryStats,
      averageAge,
      averageRating
    }
  }, [employees])

  const getRatingLabel = (rating: number) => {
    const labels: Record<number, string> = {
      1: 'Poor',
      2: 'Below Average',
      3: 'Average',
      4: 'Above Average',
      5: 'Excellent'
    }
    return labels[rating] || 'Unknown'
  }

  const getRatingColor = (rating: number) => {
    const colors: Record<number, string> = {
      1: 'destructive',
      2: 'secondary',
      3: 'outline',
      4: 'default',
      5: 'default'
    }
    return colors[rating] || 'outline'
  }

  // Chart data configurations
  const departmentChartData = useMemo(() => ({
    labels: analytics.departmentStats.map(dept => dept.department),
    datasets: [
      {
        label: 'Employee Count',
        data: analytics.departmentStats.map(dept => dept.count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }), [analytics.departmentStats])

  const performanceChartData = useMemo(() => ({
    labels: analytics.performanceStats.map(perf => `${perf.rating} Star${perf.rating !== 1 ? 's' : ''}`),
    datasets: [
      {
        label: 'Performance Distribution',
        data: analytics.performanceStats.map(perf => perf.count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(34, 197, 94, 0.6)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }), [analytics.performanceStats])

  // Mock trend data for demonstration
  const trendData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Hires',
        data: [12, 8, 15, 10, 18, 14],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Performance Reviews',
        data: [25, 30, 28, 35, 32, 38],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  }), [])

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="w-full px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of your organization&apos;s workforce
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading analytics...</span>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalEmployees}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.departmentStats.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.salaryStats.average)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section - Moved to top */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution Chart</CardTitle>
                <CardDescription>Visual representation of employee count by department</CardDescription>
              </CardHeader>
              <CardContent>
                <Bar data={departmentChartData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Rating Distribution</CardTitle>
                <CardDescription>Employee performance ratings breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <Doughnut 
                  data={performanceChartData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }} 
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>HR Trends</CardTitle>
              <CardDescription>Monthly trends for hiring and performance reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={trendData} options={chartOptions} />
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Employee count by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.departmentStats.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{dept.department}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {dept.count} employees
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${dept.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {dept.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Rating Distribution</CardTitle>
              <CardDescription>Employee performance ratings breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.performanceStats.map((perf) => (
                  <div key={perf.rating} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={getRatingColor(perf.rating) as "default" | "secondary" | "destructive" | "outline"}>
                        {perf.rating} Star{perf.rating !== 1 ? 's' : ''}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {getRatingLabel(perf.rating)} - {perf.count} employees
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${perf.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {perf.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Salary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary Statistics</CardTitle>
                <CardDescription>Compensation overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average:</span>
                  <span className="font-medium">{formatCurrency(analytics.salaryStats.average)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Median:</span>
                  <span className="font-medium">{formatCurrency(analytics.salaryStats.median)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Minimum:</span>
                  <span className="font-medium">{formatCurrency(analytics.salaryStats.min)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Maximum:</span>
                  <span className="font-medium">{formatCurrency(analytics.salaryStats.max)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workforce Demographics</CardTitle>
                <CardDescription>Employee statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Employees:</span>
                  <span className="font-medium">{analytics.totalEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Age:</span>
                  <span className="font-medium">{analytics.averageAge.toFixed(1)} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Departments:</span>
                  <span className="font-medium">{analytics.departmentStats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Performance:</span>
                  <span className="font-medium">{analytics.averageRating.toFixed(1)} / 5.0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
