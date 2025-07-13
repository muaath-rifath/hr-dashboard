import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { 
  Employee, 
  PerformanceRating
} from "@/types"

/**
 * Utility function to combine class names with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format date for display
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get employee full name
 */
export function getFullName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`
}

/**
 * Get employee initials for avatar
 */
export function getInitials(employee: Employee): string {
  return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase()
}

/**
 * Get performance rating label
 */
export function getRatingLabel(rating: PerformanceRating): string {
  const labels: Record<PerformanceRating, string> = {
    1: 'Poor',
    2: 'Below Average',
    3: 'Average',
    4: 'Above Average',
    5: 'Excellent'
  }
  return labels[rating]
}

/**
 * Filter employees based on search term
 */
export function filterEmployees(employees: Employee[], searchTerm: string): Employee[] {
  if (!searchTerm) return employees
  
  const term = searchTerm.toLowerCase()
  return employees.filter(emp => 
    getFullName(emp).toLowerCase().includes(term) ||
    emp.email.toLowerCase().includes(term) ||
    emp.department.toLowerCase().includes(term) ||
    emp.skills.some(skill => skill.toLowerCase().includes(term))
  )
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
