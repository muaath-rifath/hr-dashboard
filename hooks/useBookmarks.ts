import { useEmployeeStore } from '@/lib/store'
import { Employee } from '@/types'

/**
 * Custom hook for managing employee bookmarks
 * Provides bookmark functionality with consistent state management
 */
export function useBookmarks() {
  const { 
    bookmarkedIds, 
    toggleBookmark, 
    clearBookmarks, 
    getBookmarkedEmployees,
    employees 
  } = useEmployeeStore()

  // Ensure bookmarkedIds is always a Set
  const safeBookmarkedIds = bookmarkedIds instanceof Set ? bookmarkedIds : new Set()

  // Check if an employee is bookmarked
  const isBookmarked = (employeeId: string): boolean => {
    return safeBookmarkedIds.has(employeeId)
  }

  // Toggle bookmark for an employee
  const handleToggleBookmark = (employee: Employee) => {
    toggleBookmark(employee.id)
  }

  // Get all bookmarked employees
  const bookmarkedEmployees = employees.filter(emp => safeBookmarkedIds.has(emp.id))

  // Get bookmark statistics
  const bookmarkStats = {
    total: safeBookmarkedIds.size,
    hasBookmarks: safeBookmarkedIds.size > 0
  }

  return {
    // State
    bookmarkedIds: safeBookmarkedIds,
    bookmarkedEmployees,
    bookmarkStats,

    // Actions
    isBookmarked,
    toggleBookmark: handleToggleBookmark,
    clearBookmarks,

    // Computed
    getBookmarkedEmployees
  }
}
