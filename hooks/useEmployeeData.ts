import { useState, useEffect, useCallback } from 'react'
import { useEmployeeStore } from '@/lib/store'

/**
 * Custom hook for managing employee data loading
 * Provides loading states and data fetching functionality
 */
export function useEmployeeData() {
  const {
    employees,
    loading,
    error,
    fetchEmployeesData,
    setLoading,
    setError
  } = useEmployeeStore()

  // Local loading state for additional operations
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      await fetchEmployeesData()
    } catch (err) {
      console.error('Failed to fetch employees:', err)
    }
  }, [fetchEmployeesData])

  // Initial data fetch
  useEffect(() => {
    if (employees.length === 0 && !loading) {
      fetchData()
    }
  }, [employees.length, loading, fetchData])

  // Refresh data with loading state
  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchData()
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchData])

  // Force refresh (clears cache and refetches)
  const forceRefresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await fetchEmployeesData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }, [fetchEmployeesData, setLoading, setError])

  // Check if data is available
  const hasData = employees.length > 0
  const isEmpty = !loading && !error && employees.length === 0

  // Combined loading state
  const isLoading = loading || isRefreshing

  return {
    // Data state
    employees,
    hasData,
    isEmpty,

    // Loading states
    loading,
    isRefreshing,
    isLoading,
    error,

    // Actions
    fetchData,
    refreshData,
    forceRefresh
  }
}
