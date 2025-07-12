'use client'

import { useEffect, useState } from 'react'
import { fetchEmployees } from '@/lib/api'
import type { Employee } from '@/types'
import { EmployeeCard } from '@/components/ui/EmployeeCard'

export default function TestAPIPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEmployees() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchEmployees(10) // Fetch 10 employees
        setEmployees(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employees')
        console.error('Error in test page:', err)
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-lg">Loading employees from DummyJSON...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Testing DummyJSON API integration. Fetched {employees.length} employees.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      </div>
    </div>
  )
} 