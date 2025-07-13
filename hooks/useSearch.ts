import { useEmployeeStore } from '@/lib/store'
import { Department, PerformanceRating } from '@/types'

/**
 * Custom hook for managing search and filter functionality
 * Centralizes search logic and filter management
 */
export function useSearch() {
  const {
    searchTerm,
    selectedDepartment,
    selectedPerformanceRating,
    setSearchTerm,
    setSelectedDepartment,
    setSelectedPerformanceRating,
    clearFilters,
    getFilteredEmployees,
    employees
  } = useEmployeeStore()

  // Handle search term changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
  }

  // Handle department filter changes
  const handleDepartmentChange = (department: Department | null) => {
    setSelectedDepartment(department)
  }

  // Handle performance rating filter changes
  const handlePerformanceRatingChange = (rating: PerformanceRating | null) => {
    setSelectedPerformanceRating(rating)
  }

  // Clear all filters and search
  const handleClearFilters = () => {
    clearFilters()
  }

  // Get filtered employees
  const filteredEmployees = getFilteredEmployees()

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    searchTerm || selectedDepartment || selectedPerformanceRating
  )

  // Get search statistics
  const searchStats = {
    totalEmployees: employees.length,
    filteredCount: filteredEmployees.length,
    hasResults: filteredEmployees.length > 0,
    isFiltered: filteredEmployees.length !== employees.length,
    hasActiveFilters
  }

  // Get available departments for filtering
  const availableDepartments = Array.from(
    new Set(employees.map(emp => emp.department))
  ).sort() as Department[]

  // Get available performance ratings for filtering
  const availablePerformanceRatings = Array.from(
    new Set(employees.map(emp => emp.performanceRating))
  ).sort((a, b) => b - a) as PerformanceRating[]

  return {
    // State
    searchTerm,
    selectedDepartment,
    selectedPerformanceRating,
    filteredEmployees,
    searchStats,
    hasActiveFilters,

    // Available options
    availableDepartments,
    availablePerformanceRatings,

    // Actions
    handleSearchChange,
    handleDepartmentChange,
    handlePerformanceRatingChange,
    handleClearFilters,

    // Computed
    getFilteredEmployees
  }
}
