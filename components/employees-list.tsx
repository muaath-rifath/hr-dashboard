'use client'

import { useEffect, useState, useCallback } from 'react'
import { useEmployeeStore } from '@/lib/store'
import { EmployeeCard } from '@/components/employee-card'
import { SearchBar } from '@/components/search-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Loader2, Users, Building2, Star, AlertCircle } from 'lucide-react'
import { Employee, PerformanceRating } from '@/types'

export function EmployeesList() {
  const {
    employees,
    loading,
    error,
    searchTerm,
    selectedDepartment,
    selectedPerformanceRating,
    bookmarkedIds,
    currentPage,
    itemsPerPage,
    setSearchTerm,
    setSelectedDepartment,
    setSelectedPerformanceRating,
    setCurrentPage,
    toggleBookmark,
    fetchEmployeesData,
    getFilteredEmployees
  } = useEmployeeStore()

  const [viewMode, setViewMode] = useState<'all' | 'bookmarked'>('all')

  // Ensure bookmarkedIds is always a Set
  const safeBookmarkedIds = bookmarkedIds instanceof Set ? bookmarkedIds : new Set()

  // Memoize the fetch function to prevent re-renders
  const fetchData = useCallback(() => {
    fetchEmployeesData()
  }, [fetchEmployeesData])

  // Fetch employees on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Get employees to display
  const filteredEmployees = getFilteredEmployees()
  const displayEmployees = viewMode === 'bookmarked' 
    ? filteredEmployees.filter(emp => safeBookmarkedIds.has(emp.id))
    : filteredEmployees

  // Pagination
  const totalPages = Math.ceil(displayEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEmployees = displayEmployees.slice(startIndex, startIndex + itemsPerPage)

  const handleEmployeeView = (employee: Employee) => {
    console.log('View employee:', employee)
    // TODO: Implement employee detail modal/page
  }

  const handleEmployeeBookmark = (employee: Employee) => {
    toggleBookmark(employee.id)
  }

  const handleEmployeePromote = (employee: Employee) => {
    console.log('Promote employee:', employee)
    // TODO: Implement promotion logic
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedDepartment(null)
    setSelectedPerformanceRating(null)
    setCurrentPage(1)
    setViewMode('all')
  }

  const handleRefresh = () => {
    fetchData()
  }

  // Calculate stats
  const totalBookmarked = Array.from(bookmarkedIds).length
  const activeDepartments = new Set(employees.map(emp => emp.department)).size
  const averageRating = employees.length > 0 
    ? (employees.reduce((sum, emp) => sum + emp.performanceRating, 0) / employees.length).toFixed(1)
    : 0

  return (
    <div className="w-full px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
            <p className="text-muted-foreground">
              Manage and view your organization&apos;s employees
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refresh
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDepartments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookmarked}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar
        searchTerm={searchTerm}
        selectedDepartment={selectedDepartment}
        onSearchChange={setSearchTerm}
        onDepartmentChange={setSelectedDepartment}
        onClearFilters={handleClearFilters}
        showPerformanceFilter={true}
        selectedPerformanceRating={selectedPerformanceRating}
        onPerformanceRatingChange={setSelectedPerformanceRating}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading employees...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Employees
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Employee Grid */}
      {!loading && !error && (
        <div className="space-y-6">
          {displayEmployees.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No employees found</CardTitle>
                <CardDescription>
                  {viewMode === 'bookmarked' 
                    ? "You haven&apos;t bookmarked any employees yet." 
                    : "No employees match your current filters."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === 'bookmarked' ? (
                  <Button onClick={() => setViewMode('all')} variant="outline">
                    View All Employees
                  </Button>
                ) : (
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results info */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, displayEmployees.length)} of {displayEmployees.length} employees
                </p>
                <p className="text-sm text-muted-foreground">
                  {displayEmployees.length !== employees.length && `Filtered from ${employees.length} total`}
                </p>
              </div>

              {/* Employee Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    isBookmarked={safeBookmarkedIds.has(employee.id)}
                    onView={handleEmployeeView}
                    onBookmark={handleEmployeeBookmark}
                    onPromote={handleEmployeePromote}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(pageNum)
                            }}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
