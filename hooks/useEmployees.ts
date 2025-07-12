import { useCallback, useEffect } from 'react'
import { useEmployeeStore } from '@/store/useEmployeeStore'
import { fetchEmployees } from '@/lib/api'
import type { Employee, FilterOptions, Department } from '@/types'

// Hook return type interface
interface UseEmployeesReturn {
  // Data
  employees: Employee[]
  bookmarkedEmployees: Employee[]
  filteredEmployees: Employee[]
  
  // Loading and Error States
  loading: boolean
  error: string | null
  
  // Filter States
  filters: FilterOptions
  searchTerm: string
  selectedDepartment: Department | null
  
  // Pagination
  currentPage: number
  itemsPerPage: number
  totalPages: number
  
  // Actions
  fetchEmployees: () => Promise<void>
  setEmployees: (employees: Employee[]) => void
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  removeEmployee: (id: string) => void
  
  // Bookmark Actions
  toggleBookmark: (employeeId: string) => void
  setBookmarkedIds: (ids: string[]) => void
  clearBookmarks: () => void
  isBookmarked: (employeeId: string) => boolean
  
  // Filter Actions
  setFilters: (filters: Partial<FilterOptions>) => void
  resetFilters: () => void
  setSearchTerm: (term: string) => void
  setSelectedDepartment: (department: Department | null) => void
  
  // Pagination Actions
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  
  // Utility Actions
  getEmployeeById: (id: string) => Employee | undefined
}

/**
 * Custom hook for employee management with Zustand store integration
 * Provides loading, error, and data states with proper TypeScript typing
 */
export function useEmployees(): UseEmployeesReturn {
  const store = useEmployeeStore()
  
  // Extract state from store
  const {
    employees,
    bookmarkedIds,
    loading,
    error,
    filters,
    searchTerm,
    selectedDepartment,
    currentPage,
    itemsPerPage,
    totalPages,
  } = store
  
  // Extract actions from store
  const {
    setEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    toggleBookmark,
    setBookmarkedIds,
    clearBookmarks,
    setFilters,
    resetFilters,
    setSearchTerm,
    setSelectedDepartment,
    setCurrentPage,
    setItemsPerPage,
    getBookmarkedEmployees,
    getFilteredEmployees,
    getEmployeeById,
  } = store
  
  // Computed values
  const bookmarkedEmployees = getBookmarkedEmployees()
  const filteredEmployees = getFilteredEmployees()
  
  // Helper function to check if employee is bookmarked
  const isBookmarked = useCallback((employeeId: string): boolean => {
    return bookmarkedIds.has(employeeId)
  }, [bookmarkedIds])
  
  // Fetch employees from API
  const fetchEmployeesData = useCallback(async () => {
    try {
      store.setLoading(true)
      store.setError(null)
      
      const employees = await fetchEmployees(50) // Fetch 50 employees
      store.setEmployees(employees)
      
      // Calculate total pages
      const totalPages = Math.ceil(employees.length / itemsPerPage)
      store.setTotalPages(totalPages)
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Failed to fetch employees')
    } finally {
      store.setLoading(false)
    }
  }, [store, itemsPerPage])
  
  // Auto-fetch employees on mount
  useEffect(() => {
    if (employees.length === 0 && !loading) {
      fetchEmployeesData()
    }
  }, [fetchEmployeesData, employees.length, loading])
  
  return {
    // Data
    employees,
    bookmarkedEmployees,
    filteredEmployees,
    
    // Loading and Error States
    loading,
    error,
    
    // Filter States
    filters,
    searchTerm,
    selectedDepartment,
    
    // Pagination
    currentPage,
    itemsPerPage,
    totalPages,
    
    // Actions
    fetchEmployees: fetchEmployeesData,
    setEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    
    // Bookmark Actions
    toggleBookmark,
    setBookmarkedIds,
    clearBookmarks,
    isBookmarked,
    
    // Filter Actions
    setFilters,
    resetFilters,
    setSearchTerm,
    setSelectedDepartment,
    
    // Pagination Actions
    setCurrentPage,
    setItemsPerPage,
    
    // Utility Actions
    getEmployeeById,
  }
} 