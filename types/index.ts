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

// Department types
export interface Department {
  id: string
  name: string
  description: string
  managerId: string
  employeeCount: number
  budget: number
}

// Employee types
export interface Employee {
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

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated' | 'probation'

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

export type LeaveType = 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

// Dashboard types
export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  departments: number
  pendingRequests: number
  thisMonthHires: number
  thisMonthTerminations: number
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