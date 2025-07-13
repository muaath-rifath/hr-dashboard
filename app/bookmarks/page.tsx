'use client'

import { useEffect } from 'react'
import { useEmployeeStore } from '@/lib/store'
import { EmployeeCard } from '@/components/employee-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bookmark, Users, Trash2 } from 'lucide-react'
import { Employee } from '@/types'

export default function BookmarksPage() {
  const {
    employees,
    bookmarkedIds,
    toggleBookmark,
    clearBookmarks,
    fetchEmployeesData
  } = useEmployeeStore()

  // Ensure bookmarkedIds is always a Set
  const safeBookmarkedIds = bookmarkedIds instanceof Set ? bookmarkedIds : new Set()

  // Fetch employees on mount if not loaded
  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployeesData()
    }
  }, [employees.length, fetchEmployeesData])

  // Get bookmarked employees
  const bookmarkedEmployees = employees.filter(emp => safeBookmarkedIds.has(emp.id))

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

  const handleClearAllBookmarks = () => {
    if (confirm('Are you sure you want to remove all bookmarks?')) {
      clearBookmarks()
    }
  }

  return (
    <div className="w-full px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bookmark className="h-8 w-8" />
              Bookmarked Employees
            </h1>
            <p className="text-muted-foreground">
              Your saved employees for quick access
            </p>
          </div>
          {bookmarkedEmployees.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={handleClearAllBookmarks}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarkedEmployees.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bookmarked Employees */}
      <div className="space-y-6">
        {bookmarkedEmployees.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">No Bookmarked Employees</CardTitle>
              <CardDescription className="text-center">
                You haven&apos;t bookmarked any employees yet. Browse the employee directory and bookmark employees you want to keep track of.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild>
                <a href="/employees">Browse Employees</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results info */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {bookmarkedEmployees.length} bookmarked {bookmarkedEmployees.length === 1 ? 'employee' : 'employees'}
              </p>
            </div>

            {/* Employee Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarkedEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  isBookmarked={true}
                  onView={handleEmployeeView}
                  onBookmark={handleEmployeeBookmark}
                  onPromote={handleEmployeePromote}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
