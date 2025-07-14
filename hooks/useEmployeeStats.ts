import { useMemo } from 'react'
import { useEmployeeStore } from '@/lib/store'

/**
 * Custom hook for calculating employee statistics
 * Provides various metrics and analytics about the employee data
 */
export function useEmployeeStats() {
  const { employees, bookmarkedIds } = useEmployeeStore()

  // Ensure bookmarkedIds is always a Set
  const safeBookmarkedIds = bookmarkedIds instanceof Set ? bookmarkedIds : new Set()

  // Helper function to categorize age
  const getAgeRange = (age: number): string => {
    if (age < 25) return '18-24'
    if (age < 35) return '25-34'
    if (age < 45) return '35-44'
    if (age < 55) return '45-54'
    return '55+'
  }

  // Helper function to categorize salary
  const getSalaryRange = (salary: number): string => {
    if (salary < 40000) return '$0-$40k'
    if (salary < 60000) return '$40k-$60k'
    if (salary < 80000) return '$60k-$80k'
    if (salary < 100000) return '$80k-$100k'
    if (salary < 120000) return '$100k-$120k'
    return '$120k+'
  }

  const stats = useMemo(() => {
    const totalEmployees = employees.length
    
    if (totalEmployees === 0) {
      return {
        totalEmployees: 0,
        totalBookmarked: 0,
        averageRating: 0,
        activeDepartments: 0,
        averageSalary: 0,
        departmentDistribution: {},
        performanceDistribution: {},
        ageDistribution: {},
        salaryRanges: {},
        topPerformers: [],
        recentHires: []
      }
    }

    // Basic counts
    const totalBookmarked = safeBookmarkedIds.size
    const activeDepartments = new Set(employees.map(emp => emp.department)).size

    // Performance metrics
    const totalRating = employees.reduce((sum, emp) => sum + emp.performanceRating, 0)
    const averageRating = Number((totalRating / totalEmployees).toFixed(1))

    // Salary metrics
    const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0)
    const averageSalary = Math.round(totalSalary / totalEmployees)

    // Department distribution
    const departmentDistribution = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Performance rating distribution
    const performanceDistribution = employees.reduce((acc, emp) => {
      const rating = emp.performanceRating.toString()
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Age distribution (by ranges)
    const ageDistribution = employees.reduce((acc, emp) => {
      const ageRange = getAgeRange(emp.age)
      acc[ageRange] = (acc[ageRange] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Salary ranges
    const salaryRanges = employees.reduce((acc, emp) => {
      const salaryRange = getSalaryRange(emp.salary)
      acc[salaryRange] = (acc[salaryRange] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top performers (rating >= 4)
    const topPerformers = employees
      .filter(emp => emp.performanceRating >= 4)
      .sort((a, b) => b.performanceRating - a.performanceRating)
      .slice(0, 5)

    // Recent hires (assuming higher IDs are more recent - this is a placeholder)
    const recentHires = employees
      .sort((a, b) => parseInt(b.id) - parseInt(a.id))
      .slice(0, 5)

    return {
      totalEmployees,
      totalBookmarked,
      averageRating,
      activeDepartments,
      averageSalary,
      departmentDistribution,
      performanceDistribution,
      ageDistribution,
      salaryRanges,
      topPerformers,
      recentHires
    }
  }, [employees, safeBookmarkedIds])

  // Get department with most employees
  const getLargestDepartment = (): { name: string; count: number } | null => {
    const departments = Object.entries(stats.departmentDistribution)
    if (departments.length === 0) return null
    
    const [name, count] = departments.reduce((max, [dept, count]) => 
      count > max[1] ? [dept, count] : max
    )
    
    return { name, count }
  }

  // Get performance insights
  const getPerformanceInsights = () => {
    const highPerformers = employees.filter(emp => emp.performanceRating >= 4).length
    const lowPerformers = employees.filter(emp => emp.performanceRating <= 2).length
    const averagePerformers = employees.length - highPerformers - lowPerformers

    return {
      highPerformers,
      averagePerformers,
      lowPerformers,
      highPerformerPercentage: employees.length > 0 ? Math.round((highPerformers / employees.length) * 100) : 0
    }
  }

  return {
    ...stats,
    getLargestDepartment,
    getPerformanceInsights,
    getAgeRange,
    getSalaryRange
  }
}
