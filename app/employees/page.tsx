'use client'

import { useEmployees } from '@/hooks/useEmployees'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { EmployeeCard } from '@/components/ui/EmployeeCard'
import { IconLoader, IconAlertCircle } from '@tabler/icons-react'

export default function EmployeesPage() {
  const {
    employees,
    loading,
    error,
    fetchEmployees
  } = useEmployees()

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employees
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your employee data and view detailed information.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <IconLoader className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-lg text-gray-600 dark:text-gray-400">
                Loading employees...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <IconAlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Error Loading Employees
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
                <button
                  onClick={fetchEmployees}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Employee List */}
        {!loading && !error && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Employee List ({employees.length} employees)
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage your employee information.
              </p>
            </div>

            {employees.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No employees found. 
                  <button
                    onClick={fetchEmployees}
                    className="ml-2 text-blue-600 hover:text-blue-700 underline"
                  >
                    Refresh
                  </button>
                </p>
              </div>
            ) : (
              <div className="grid gap-6 auto-rows-fr grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
                {employees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onView={(emp) => console.log('View employee:', emp)}
                    onBookmark={(emp) => console.log('Bookmark employee:', emp)}
                    onPromote={(emp) => console.log('Promote employee:', emp)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 