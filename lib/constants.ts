import type { PerformanceRating } from "@/types"
import { Department } from "@/types"

/**
 * Array of all departments for dropdowns and filters
 */
export const DEPARTMENTS = [
  Department.HR,
  Department.Engineering,
  Department.Marketing,
  Department.Sales,
  Department.Finance,
  Department.Operations,
  Department.Legal,
  Department.IT,
  Department.CustomerSupport,
  Department.Product
] as const

/**
 * Color mapping for performance rating badges
 */
export const RATING_COLORS: Record<PerformanceRating, {
  bg: string
  text: string
  border: string
}> = {
  1: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  },
  2: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  3: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700'
  },
  4: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800'
  },
  5: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  }
}

/**
 * Rating labels for display
 */
export const RATING_LABELS: Record<PerformanceRating, string> = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Average',
  4: 'Above Average',
  5: 'Excellent'
}

/**
 * Employee status options
 */
export const EMPLOYEE_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'terminated', label: 'Terminated' },
  { value: 'probation', label: 'Probation' },
  { value: 'contractor', label: 'Contractor' }
] as const

/**
 * Leave type options
 */
export const LEAVE_TYPE_OPTIONS = [
  { value: 'vacation', label: 'Vacation' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal' },
  { value: 'maternity', label: 'Maternity' },
  { value: 'paternity', label: 'Paternity' },
  { value: 'bereavement', label: 'Bereavement' },
  { value: 'jury_duty', label: 'Jury Duty' }
] as const

/**
 * Feedback categories
 */
export const FEEDBACK_CATEGORIES = [
  { value: 'performance', label: 'Performance' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'technical', label: 'Technical' },
  { value: 'communication', label: 'Communication' }
] as const

/**
 * Project status options
 */
export const PROJECT_STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'planned', label: 'Planned' }
] as const

/**
 * Sort options for employee lists
 */
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'department', label: 'Department' },
  { value: 'performanceRating', label: 'Performance Rating' },
  { value: 'hireDate', label: 'Hire Date' },
  { value: 'salary', label: 'Salary' }
] as const

/**
 * API endpoints for data fetching
 */
export const API_ENDPOINTS = {
  // Employee endpoints
  employees: '/api/employees',
  employee: (id: string) => `/api/employees/${id}`,
  employeeProfile: (id: string) => `/api/employees/${id}/profile`,
  employeeProjects: (id: string) => `/api/employees/${id}/projects`,
  employeeFeedback: (id: string) => `/api/employees/${id}/feedback`,
  
  // Department endpoints
  departments: '/api/departments',
  department: (id: string) => `/api/departments/${id}`,
  departmentEmployees: (id: string) => `/api/departments/${id}/employees`,
  
  // Leave endpoints
  leaveRequests: '/api/leave-requests',
  leaveRequest: (id: string) => `/api/leave-requests/${id}`,
  employeeLeaveRequests: (employeeId: string) => `/api/employees/${employeeId}/leave-requests`,
  
  // Dashboard endpoints
  dashboardStats: '/api/dashboard/stats',
  dashboardCharts: '/api/dashboard/charts',
  
  // Search endpoints
  searchEmployees: '/api/search/employees',
  searchDepartments: '/api/search/departments',
  
  // Bookmark endpoints
  bookmarks: '/api/bookmarks',
  bookmarkEmployee: (employeeId: string) => `/api/bookmarks/employees/${employeeId}`,
  
  // Auth endpoints
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  profile: '/api/auth/profile',
  
  // Upload endpoints
  uploadAvatar: '/api/upload/avatar',
  uploadDocument: '/api/upload/document'
} as const

/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100
} as const

/**
 * Search debounce delay (in milliseconds)
 */
export const SEARCH_DEBOUNCE_DELAY = 300

/**
 * Date format options
 */
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  input: 'yyyy-MM-dd',
  api: 'yyyy-MM-dd'
} as const

/**
 * Currency format options
 */
export const CURRENCY_FORMATS = {
  USD: {
    symbol: '$',
    locale: 'en-US',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }
} as const

/**
 * File upload limits
 */
export const UPLOAD_LIMITS = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
} as const

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
    message: 'Please enter a valid phone number'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  }
} as const 