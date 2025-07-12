import type { Employee, PerformanceRating } from "@/types"
import { Department } from "@/types"
import { API_ENDPOINTS } from "./constants"
import { getAPIConfig, isBackendEnabled, isDummyJSONEnabled } from "./config"

import { 
  generateProjectHistory, 
  generateFeedback, 
  generateCertifications 
} from "./mockData"

// API Configuration
const API_CONFIG = getAPIConfig()

// API Error Types
export interface APIError extends Error {
  status?: number
  code?: string
  endpoint?: string
}

export interface APIResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DummyJSONResponse {
  users: DummyUser[]
  total: number
  skip: number
  limit: number
}

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

/**
 * Generic API client with error handling and retries
 */
class APIClient {
  private baseURL: string
  private timeout: number
  private maxRetries: number

  constructor(baseURL: string, timeout: number = 10000, maxRetries: number = 3) {
    this.baseURL = baseURL
    this.timeout = timeout
    this.maxRetries = maxRetries
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error: APIError = new Error(`HTTP error! status: ${response.status}`)
        error.status = response.status
        error.endpoint = endpoint
        
        // Retry on 5xx errors
        if (response.status >= 500 && retryCount < this.maxRetries) {
          console.warn(`Retrying request to ${endpoint} (attempt ${retryCount + 1})`)
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
          return this.request<T>(endpoint, options, retryCount + 1)
        }
        
        throw error
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        const apiError: APIError = new Error('Request timeout')
        apiError.endpoint = endpoint
        throw apiError
      }
      
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Initialize API clients
const backendClient = new APIClient(API_CONFIG.BASE_URL)
const dummyClient = new APIClient(API_CONFIG.DUMMY_JSON_URL)

/**
 * Check if backend API is available
 */
async function isBackendAvailable(): Promise<boolean> {
  try {
    console.log('[isBackendAvailable] Checking backend health...')
    await backendClient.get('/health')
    console.log('[isBackendAvailable] Backend is available')
    return true
  } catch (error) {
    console.warn('[isBackendAvailable] Backend not available:', error)
    return false
  }
}

/**
 * Fetch users from DummyJSON API
 * @param limit - Number of users to fetch (default: 20)
 * @returns Promise<DummyUser[]> - Array of user data from DummyJSON
 * @throws APIError - When API request fails
 */
export async function fetchUsers(limit: number = 20): Promise<DummyUser[]> {
  try {
    const response = await dummyClient.get<DummyJSONResponse>(`/users?limit=${limit}`)
    return response.users || []
  } catch (error) {
    console.error('Error fetching users from DummyJSON:', error)
    const apiError: APIError = error instanceof Error ? error : new Error('Unknown error occurred')
    throw apiError
  }
}

/**
 * Transform DummyJSON user data to Employee format
 */
interface DummyUser {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  phone: string
  image: string
  address: {
    address: string
    city: string
    state: string
    postalCode: string
  }
}

/**
 * Transform DummyJSON user data to Employee format
 * @param user - Raw user data from DummyJSON API
 * @returns Employee - Transformed employee data with mock HR information
 */
export function transformUserToEmployee(user: DummyUser): Employee {
  // Generate random department
  const departments = Object.values(Department)
  const randomDepartment = departments[Math.floor(Math.random() * departments.length)] as Department
  
  // Generate random performance rating (1-5)
  const randomRating = (Math.floor(Math.random() * 5) + 1) as PerformanceRating
  
  // Generate random hire date (within last 5 years)
  const currentDate = new Date()
  const randomDaysAgo = Math.floor(Math.random() * 1825) // 5 years in days
  const hireDate = new Date(currentDate.getTime() - (randomDaysAgo * 24 * 60 * 60 * 1000))
  
  // Generate random salary based on department and experience
  const baseSalaries: Record<Department, number> = {
    [Department.Engineering]: 80000,
    [Department.Marketing]: 65000,
    [Department.Sales]: 70000,
    [Department.Finance]: 75000,
    [Department.HR]: 60000,
    [Department.Operations]: 65000,
    [Department.Legal]: 85000,
    [Department.IT]: 75000,
    [Department.CustomerSupport]: 55000,
    [Department.Product]: 90000
  }
  
  const baseSalary = baseSalaries[randomDepartment]
  const experienceMultiplier = 1 + (Math.random() * 0.5) // 0-50% bonus
  const salary = Math.round(baseSalary * experienceMultiplier)
  
  // Generate skills based on department
  const departmentSkills: Record<Department, string[]> = {
    [Department.Engineering]: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
    [Department.Marketing]: ['Digital Marketing', 'SEO', 'Google Ads', 'Social Media', 'Content Creation'],
    [Department.Sales]: ['Sales Strategy', 'CRM', 'Negotiation', 'Lead Generation', 'Client Relations'],
    [Department.Finance]: ['Financial Analysis', 'Excel', 'QuickBooks', 'Budgeting', 'Risk Management'],
    [Department.HR]: ['Recruitment', 'Employee Relations', 'HRIS', 'Compliance', 'Training'],
    [Department.Operations]: ['Process Improvement', 'Project Management', 'Supply Chain', 'Quality Control'],
    [Department.Legal]: ['Contract Law', 'Compliance', 'Legal Research', 'Risk Assessment'],
    [Department.IT]: ['System Administration', 'Network Security', 'Cloud Computing', 'Technical Support'],
    [Department.CustomerSupport]: ['Customer Service', 'Problem Solving', 'Communication', 'CRM Systems'],
    [Department.Product]: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Design Thinking']
  }
  
  const availableSkills = departmentSkills[randomDepartment]
  const numSkills = Math.floor(Math.random() * 4) + 2 // 2-5 skills
  const skills = availableSkills
    .sort(() => 0.5 - Math.random())
    .slice(0, numSkills)
  
  return {
    id: user.id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    age: user.age,
    department: randomDepartment,
    phone: user.phone,
    address: {
      street: user.address.address,
      city: user.address.city,
      state: user.address.state,
      zipCode: user.address.postalCode,
      country: 'USA'
    },
    bio: `${user.firstName} ${user.lastName} is a ${randomDepartment} professional with ${Math.floor(Math.random() * 10) + 1} years of experience.`,
    performanceRating: randomRating,
    projectHistory: generateProjectHistory(),
    feedback: generateFeedback(user.id.toString()),
    hireDate: hireDate.toISOString().split('T')[0],
    salary,
    managerId: Math.random() > 0.7 ? (user.id + 1).toString() : undefined,
    status: 'active',
    avatar: user.image,
    skills,
    certifications: generateCertifications(),
    emergencyContact: {
      name: `${user.firstName} ${user.lastName} Sr.`,
      relationship: 'Parent',
      phone: user.phone,
      email: user.email
    }
  }
}

/**
 * Backend API functions
 */

/**
 * Fetch employees from backend API
 */
export async function fetchEmployeesFromBackend(
  page: number = 1,
  limit: number = 20,
  search?: string,
  department?: Department
): Promise<PaginatedResponse<Employee>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(department && { department })
    })

    const response = await backendClient.get<PaginatedResponse<Employee>>(
      `${API_ENDPOINTS.employees}?${params}`
    )
    
    return response
  } catch (error) {
    console.error('Error fetching employees from backend:', error)
    throw error
  }
}

/**
 * Fetch single employee by ID from backend
 */
export async function fetchEmployeeById(id: string): Promise<Employee> {
  try {
    const response = await backendClient.get<Employee>(API_ENDPOINTS.employee(id))
    return response
  } catch (error) {
    console.error(`Error fetching employee ${id} from backend:`, error)
    throw error
  }
}

/**
 * Create new employee via backend API
 */
export async function createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
  try {
    const response = await backendClient.post<Employee>(API_ENDPOINTS.employees, employeeData)
    return response
  } catch (error) {
    console.error('Error creating employee via backend:', error)
    throw error
  }
}

/**
 * Update employee via backend API
 */
export async function updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
  try {
    const response = await backendClient.put<Employee>(API_ENDPOINTS.employee(id), employeeData)
    return response
  } catch (error) {
    console.error(`Error updating employee ${id} via backend:`, error)
    throw error
  }
}

/**
 * Delete employee via backend API
 */
export async function deleteEmployee(id: string): Promise<void> {
  try {
    await backendClient.delete(API_ENDPOINTS.employee(id))
  } catch (error) {
    console.error(`Error deleting employee ${id} via backend:`, error)
    throw error
  }
}

/**
 * Fetch dashboard statistics from backend
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await backendClient.get<DashboardStats>(API_ENDPOINTS.dashboardStats)
    return response
  } catch (error) {
    console.error('Error fetching dashboard stats from backend:', error)
    throw error
  }
}

/**
 * Fetch departments from backend
 */
export async function fetchDepartments(): Promise<Department[]> {
  try {
    const response = await backendClient.get<Department[]>(API_ENDPOINTS.departments)
    return response
  } catch (error) {
    console.error('Error fetching departments from backend:', error)
    throw error
  }
}

/**
 * Bookmark/unbookmark employee via backend
 */
export async function toggleEmployeeBookmark(employeeId: string): Promise<void> {
  try {
    await backendClient.post(API_ENDPOINTS.bookmarkEmployee(employeeId), {})
  } catch (error) {
    console.error(`Error toggling bookmark for employee ${employeeId}:`, error)
    throw error
  }
}

/**
 * Unified employee fetching function that tries backend first, falls back to DummyJSON
 */
export async function fetchEmployees(
  page: number = 1,
  limit: number = 20,
  search?: string,
  department?: Department
): Promise<{ employees: Employee[], total: number, page: number, limit: number }> {
  // Try backend first if enabled
  if (isBackendEnabled()) {
    try {
      if (await isBackendAvailable()) {
        console.log('[fetchEmployees] Using backend API')
        const response = await fetchEmployeesFromBackend(page, limit, search, department)
        return {
          employees: response.data,
          total: response.total,
          page: response.page,
          limit: response.limit
        }
      }
    } catch (error) {
      console.warn('[fetchEmployees] Backend API failed, falling back to DummyJSON:', error)
    }
  }

  // Fallback to DummyJSON if enabled
  if (isDummyJSONEnabled()) {
    try {
      console.log('[fetchEmployees] Using DummyJSON API')
      const users = await fetchUsers(limit)
      const employees = users.map(transformUserToEmployee)
      
      // Apply client-side filtering
      let filteredEmployees = employees
      
      if (search) {
        const searchTerm = search.toLowerCase()
        filteredEmployees = filteredEmployees.filter(emp => 
          `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm) ||
          emp.department.toLowerCase().includes(searchTerm)
        )
      }
      
      if (department) {
        filteredEmployees = filteredEmployees.filter(emp => emp.department === department)
      }
      
      return {
        employees: filteredEmployees,
        total: filteredEmployees.length,
        page,
        limit
      }
    } catch (error) {
      console.error('[fetchEmployees] Error fetching employees from DummyJSON:', error)
      throw error
    }
  }

  // If both are disabled, return empty result
  console.error('[fetchEmployees] Both backend and DummyJSON are unavailable!')
  return {
    employees: [],
    total: 0,
    page,
    limit
  }
}

/**
 * Search employees with unified API
 */
export async function searchEmployeesAPI(
  searchTerm?: string,
  department?: Department,
  page: number = 1,
  limit: number = 10
): Promise<{ employees: Employee[], total: number }> {
  const result = await fetchEmployees(page, limit, searchTerm, department)
  return {
    employees: result.employees,
    total: result.total
  }
} 