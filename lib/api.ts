import type { Employee, PerformanceRating } from "@/types"
import { Department } from "@/types"

import { 
  generateProjectHistory, 
  generateFeedback, 
  generateCertifications 
} from "./mockData"

// DummyJSON API base URL
const DUMMY_JSON_BASE_URL = 'https://dummyjson.com'

// API Error Types
export interface APIError extends Error {
  status?: number
  code?: string
}

export interface DummyJSONResponse {
  users: DummyUser[]
  total: number
  skip: number
  limit: number
}

/**
 * Fetch users from DummyJSON API
 * @param limit - Number of users to fetch (default: 20)
 * @returns Promise<DummyUser[]> - Array of user data from DummyJSON
 * @throws APIError - When API request fails
 */
export async function fetchUsers(limit: number = 20): Promise<DummyUser[]> {
  try {
    const response = await fetch(`${DUMMY_JSON_BASE_URL}/users?limit=${limit}`)
    
    if (!response.ok) {
      const error: APIError = new Error(`HTTP error! status: ${response.status}`)
      error.status = response.status
      throw error
    }
    
    const data: DummyJSONResponse = await response.json()
    return data.users || []
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
 * Fetch and transform employees from DummyJSON API
 * @param limit - Number of employees to fetch (default: 20)
 * @returns Promise<Employee[]> - Array of transformed employee data
 * @throws APIError - When API request fails
 */
export async function fetchEmployees(limit: number = 20): Promise<Employee[]> {
  try {
    const users = await fetchUsers(limit)
    const employees = users.map(transformUserToEmployee)
    return employees
  } catch (error) {
    console.error('Error fetching employees from DummyJSON:', error)
    throw error // Re-throw to let calling code handle the error
  }
}

/**
 * Search employees with API integration and client-side filtering
 * @param searchTerm - Optional search term to filter by name, email, or department
 * @param department - Optional department filter
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise<{employees: Employee[], total: number}> - Filtered and paginated employees
 * @throws APIError - When API request fails
 */
export async function searchEmployeesAPI(
  searchTerm?: string,
  department?: Department,
  page: number = 1,
  limit: number = 10
): Promise<{ employees: Employee[], total: number }> {
  try {
    // Fetch all employees and filter client-side
    // In a real app, you'd implement server-side filtering
    const allEmployees = await fetchEmployees(50) // Fetch more for search
    
    let filteredEmployees = allEmployees
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredEmployees = filteredEmployees.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term)
      )
    }
    
    // Apply department filter
    if (department) {
      filteredEmployees = filteredEmployees.filter(emp => emp.department === department)
    }
    
    // Apply pagination
    const total = filteredEmployees.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex)
    
    return {
      employees: paginatedEmployees,
      total
    }
  } catch (error) {
    console.error('Error searching employees:', error)
    throw error // Re-throw to let calling code handle the error
  }
} 