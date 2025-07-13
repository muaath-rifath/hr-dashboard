'use client'

import { useState } from 'react'
import { useEmployeeData, useBookmarks, useEmployeeActions } from '@/hooks'
import { EmployeeCard } from '@/components/employee-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Bookmark, Users, Trash2 } from 'lucide-react'

export default function BookmarksPage() {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  
  // Custom hooks
  const { employees } = useEmployeeData()
  const { bookmarkedEmployees, bookmarkStats, clearBookmarks } = useBookmarks()
  const { handleEmployeeView, handleEmployeeBookmark, handleEmployeePromote } = useEmployeeActions()

  const handleClearAllBookmarks = () => {
    clearBookmarks()
    setIsAlertOpen(false)
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
          {bookmarkStats.hasBookmarks && (
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Bookmarks</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove all bookmarks? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearAllBookmarks}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
              <div className="text-2xl font-bold">{bookmarkStats.total}</div>
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
        {!bookmarkStats.hasBookmarks ? (
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
                {bookmarkStats.total} bookmarked {bookmarkStats.total === 1 ? 'employee' : 'employees'}
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
