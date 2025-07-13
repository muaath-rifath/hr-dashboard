'use client'

import { useEffect, useMemo } from 'react'
import { useEmployeeStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Users, Building2, Star, DollarSign } from 'lucide-react'
import { Department } from '@/types'
import { formatCurrency } from '@/lib/utils'

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
