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
  xHandle?: string // Optional X/Twitter handle
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
}

// Emergency contact interface
export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

// Bookmarked employee interface
export interface BookmarkedEmployee {
  employeeId: string
  bookmarkedAt: string
  notes?: string
  tags: string[]
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

// Department types
export interface DepartmentInfo {
  id: string
  name: string
  description: string
  managerId: string
  employeeCount: number
  budget: number
  location: string
  departmentHead: Employee
}

// Employee types (legacy - keeping for backward compatibility)
export interface EmployeeLegacy {
  id: string
  userId: string
  employeeId: string
  departmentId: string
  position: string
  salary: number
  startDate: string
  endDate?: string
  managerId?: string
  status: EmployeeStatus
}

// Leave types
export interface LeaveRequest {
  id: string
  employeeId: string
  type: LeaveType
  startDate: string
  endDate: string
  reason: string
  status: LeaveStatus
  approvedBy?: string
  approvedAt?: string
}

export type LeaveType = 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement' | 'jury_duty'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

// Dashboard types
export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  departments: number
  pendingRequests: number
  thisMonthHires: number
  thisMonthTerminations: number
  averagePerformanceRating: number
  totalSalary: number
  departmentDistribution: DepartmentStats[]
  performanceDistribution: PerformanceStats[]
}

export interface DepartmentStats {
  department: Department
  count: number
  percentage: number
}

export interface PerformanceStats {
  rating: PerformanceRating
  count: number
  percentage: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Search and filter types
export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

 