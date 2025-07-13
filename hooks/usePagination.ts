import { useEmployeeStore } from '@/lib/store'
import { Employee } from '@/types'

/**
 * Custom hook for managing pagination functionality
 * Provides consistent pagination logic across components
 */
export function usePagination<T = Employee>(items: T[]) {
  const {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage
  } = useEmployeeStore()

  // Calculate pagination values
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  // Get paginated items
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage)

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToLastPage = () => {
    setCurrentPage(totalPages)
  }

  // Change items per page
  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    // Reset to first page when changing items per page
    setCurrentPage(1)
  }

  // Check navigation availability
  const canGoNext = currentPage < totalPages
  const canGoPrevious = currentPage > 1
  const hasPagination = totalPages > 1

  // Get page numbers for pagination component
  const getPageNumbers = (maxVisible = 5) => {
    const pages: number[] = []
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Calculate start and end pages
      const half = Math.floor(maxVisible / 2)
      let start = Math.max(1, currentPage - half)
      let end = Math.min(totalPages, start + maxVisible - 1)
      
      // Adjust start if end is at the boundary
      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  // Pagination info
  const paginationInfo = {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    startIndex: startIndex + 1,
    endIndex,
    hasItems: totalItems > 0,
    hasPagination,
    canGoNext,
    canGoPrevious
  }

  return {
    // State
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    paginatedItems,
    paginationInfo,

    // Navigation
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changeItemsPerPage,

    // Utilities
    getPageNumbers,

    // Computed values
    startIndex: startIndex + 1,
    endIndex,
    hasItems: totalItems > 0,
    hasPagination,
    canGoNext,
    canGoPrevious
  }
}
