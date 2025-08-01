'use client'

import { useState } from 'react'
import { useEmployeeData, useBookmarks, useSearch, usePagination, useEmployeeActions, useEmployeeStats } from '@/hooks'
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
import { Loader2, Users, Building2, Star, AlertCircle, Bookmark } from 'lucide-react'

export function EmployeesList() {
  const [viewMode, setViewMode] = useState<'all' | 'bookmarked'>('all')

  // Custom hooks
  const { employees, loading, error, refreshData } = useEmployeeData()
  const { bookmarkedEmployees, bookmarkStats, isBookmarked } = useBookmarks()
  const {
    searchTerm,
    selectedDepartment,
    selectedPerformanceRating,
    filteredEmployees,
    searchStats,
    handleSearchChange,
    handleDepartmentChange,
    handlePerformanceRatingChange,
    handleClearFilters
  } = useSearch()
  const { handleEmployeeView, handleEmployeeBookmark, handleEmployeePromote } = useEmployeeActions()
  const { activeDepartments, averageRating } = useEmployeeStats()

  // Get employees to display based on view mode
  const displayEmployees = viewMode === 'bookmarked' 
    ? bookmarkedEmployees
    : filteredEmployees

  // Pagination
  const {
    paginatedItems: paginatedEmployees,
    paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    getPageNumbers
  } = usePagination(displayEmployees)

  const handleClearFiltersAndMode = () => {
    handleClearFilters()
    setViewMode('all')
  }

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
          <Button onClick={refreshData} disabled={loading}>
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
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarkStats.total}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar
        searchTerm={searchTerm}
        selectedDepartment={selectedDepartment}
        onSearchChange={handleSearchChange}
        onDepartmentChange={handleDepartmentChange}
        onClearFilters={handleClearFilters}
        showPerformanceFilter={true}
        selectedPerformanceRating={selectedPerformanceRating}
        onPerformanceRatingChange={handlePerformanceRatingChange}
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
            <Button onClick={refreshData} variant="outline">
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
                  <Button onClick={handleClearFiltersAndMode} variant="outline">
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
                  Showing {paginationInfo.startIndex}-{paginationInfo.endIndex} of {displayEmployees.length} employees
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchStats.isFiltered && `Filtered from ${searchStats.totalEmployees} total`}
                </p>
              </div>

              {/* Employee Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    isBookmarked={isBookmarked(employee.id)}
                    onView={handleEmployeeView}
                    onBookmark={handleEmployeeBookmark}
                    onPromote={handleEmployeePromote}
                  />
                ))}
              </div>

              {/* Pagination */}
              {paginationInfo.hasPagination && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={(e) => {
                          e.preventDefault()
                          goToPreviousPage()
                        }}
                        className={!paginationInfo.canGoPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {/* Page numbers */}
                    {getPageNumbers().map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault()
                            goToPage(pageNum)
                          }}
                          isActive={paginationInfo.currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={(e) => {
                          e.preventDefault()
                          goToNextPage()
                        }}
                        className={!paginationInfo.canGoNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
