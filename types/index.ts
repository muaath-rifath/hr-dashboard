// User types
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  position: string
  hireDate: string
  status: UserStatus
  avatar?: string
}

export type UserRole = 'admin' | 'manager' | 'employee' | 'hr'
export type UserStatus = 'active' | 'inactive' | 'pending' | 'terminated'

// Employee types
export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  age: number
  department: Department
  phone: string
  address: Address
  bio: string
  performanceRating: PerformanceRating
  projectHistory: Project[]
  feedback: Feedback[]
  hireDate: string
  salary: number
  managerId?: string
  status: EmployeeStatus
  avatar?: string
  skills: string[]
  certifications: Certification[]
  emergencyContact: EmergencyContact
}

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated' | 'probation' | 'contractor'

// Department enum
export enum Department {
  HR = 'HR',
  Engineering = 'Engineering',
  Marketing = 'Marketing',
  Sales = 'Sales',
  Finance = 'Finance',
  Operations = 'Operations',
  Legal = 'Legal',
  IT = 'IT',
  CustomerSupport = 'Customer Support',
  Product = 'Product'
}

// Performance rating type (1-5 scale)
export type PerformanceRating = 1 | 2 | 3 | 4 | 5

// Address interface
export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// Project interface
export interface Project {
  id: string
  name: string
  description: string
  startDate: string
  endDate?: string
  role: string
  technologies: string[]
  status: 'completed' | 'in_progress' | 'planned'
  performanceRating?: PerformanceRating
}

// Feedback interface
export interface Feedback {
  id: string
  fromEmployeeId: string
  toEmployeeId: string
  message: string
  rating: PerformanceRating
  date: string
  category: 'performance' | 'collaboration' | 'leadership' | 'technical' | 'communication'
}

// Certification interface
export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  category?: string
}

// Emergency contact interface
export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

// Filter options interface for search functionality
export interface FilterOptions {
  departments?: Department[]
  performanceRating?: PerformanceRating[]
  status?: EmployeeStatus[]
  ageRange?: {
    min: number
    max: number
  }
  salaryRange?: {
    min: number
    max: number
  }
  skills?: string[]
  hireDateRange?: {
    start: string
    end: string
  }
  searchTerm?: string
  sortBy?: 'name' | 'department' | 'performanceRating' | 'hireDate' | 'salary'
  sortOrder?: 'asc' | 'desc'
}

// Dashboard types
export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  departments: number
  pendingRequests: number
  averageSalary: number
  topDepartments: Array<{
    name: string
    count: number
  }>
}

// Search result type
export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
