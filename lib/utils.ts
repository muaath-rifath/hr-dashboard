import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { 
  Employee, 
  PerformanceRating, 
  FilterOptions,
  SearchResult
} from "@/types"
import { Department } from "@/types"

/**
 * Utility function to combine class names with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format department name for display
 */
export function formatDepartment(department: Department): string {
  return department.toString()
}

/**
 * Format performance rating for display
 */
export function formatRating(rating: PerformanceRating): string {
  const ratingLabels: Record<PerformanceRating, string> = {
    1: 'Poor',
    2: 'Below Average',
    3: 'Average',
    4: 'Above Average',
    5: 'Excellent'
  }
  return ratingLabels[rating]
}

/**
 * Get rating color for badges
 */
export function getRatingColor(rating: PerformanceRating): string {
  const colors: Record<PerformanceRating, string> = {
    1: 'bg-error text-error-foreground',
    2: 'bg-warning text-warning-foreground',
    3: 'bg-secondary text-secondary-foreground',
    4: 'bg-success text-success-foreground',
    5: 'bg-primary text-primary-foreground'
  }
  return colors[rating]
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
 * Format date range for display
 */
export function formatDateRange(startDate: string, endDate?: string): string {
  const start = formatDate(startDate)
  if (!endDate) return `${start} - Present`
  const end = formatDate(endDate)
  return `${start} - ${end}`
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
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
 * Filter employees based on filter options
 */
export function filterEmployees(
  employees: Employee[], 
  filters: FilterOptions
): Employee[] {
  return employees.filter(employee => {
    // Department filter
    if (filters.departments && filters.departments.length > 0) {
      if (!filters.departments.includes(employee.department)) {
        return false
      }
    }

    // Performance rating filter
    if (filters.performanceRating && filters.performanceRating.length > 0) {
      if (!filters.performanceRating.includes(employee.performanceRating)) {
        return false
      }
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(employee.status)) {
        return false
      }
    }

    // Age range filter
    if (filters.ageRange) {
      const age = calculateAge(employee.hireDate) // Using hire date as proxy for age
      if (age < filters.ageRange.min || age > filters.ageRange.max) {
        return false
      }
    }

    // Salary range filter
    if (filters.salaryRange) {
      if (employee.salary < filters.salaryRange.min || employee.salary > filters.salaryRange.max) {
        return false
      }
    }

    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      const hasSkill = filters.skills.some(skill => 
        employee.skills.some(employeeSkill => 
          employeeSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
      if (!hasSkill) {
        return false
      }
    }

    // Hire date range filter
    if (filters.hireDateRange) {
      const hireDate = new Date(employee.hireDate)
      const startDate = new Date(filters.hireDateRange.start)
      const endDate = new Date(filters.hireDateRange.end)
      
      if (hireDate < startDate || hireDate > endDate) {
        return false
      }
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      const fullName = getFullName(employee).toLowerCase()
      const email = employee.email.toLowerCase()
      const department = employee.department.toLowerCase()
      
      if (!fullName.includes(searchTerm) && 
          !email.includes(searchTerm) && 
          !department.includes(searchTerm)) {
        return false
      }
    }

    return true
  })
}

/**
 * Sort employees based on sort options
 */
export function sortEmployees(
  employees: Employee[], 
  sortBy?: string, 
  sortOrder: 'asc' | 'desc' = 'asc'
): Employee[] {
  return [...employees].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'name':
        comparison = getFullName(a).localeCompare(getFullName(b))
        break
      case 'department':
        comparison = a.department.localeCompare(b.department)
        break
      case 'performanceRating':
        comparison = a.performanceRating - b.performanceRating
        break
      case 'hireDate':
        comparison = new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime()
        break
      case 'salary':
        comparison = a.salary - b.salary
        break
      default:
        comparison = getFullName(a).localeCompare(getFullName(b))
    }

    return sortOrder === 'desc' ? -comparison : comparison
  })
}

/**
 * Generate mock employee data for development
 */
export function generateMockData(): Employee[] {
  const mockEmployees: Employee[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      age: 32,
      department: Department.Engineering,
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      },
      bio: 'Senior Software Engineer with 8 years of experience in full-stack development.',
      performanceRating: 4,
      projectHistory: [
        {
          id: 'p1',
          name: 'E-commerce Platform',
          description: 'Built a scalable e-commerce platform using React and Node.js',
          startDate: '2023-01-15',
          endDate: '2023-06-30',
          role: 'Lead Developer',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
          status: 'completed',
          performanceRating: 5
        }
      ],
      feedback: [
        {
          id: 'f1',
          fromEmployeeId: '2',
          toEmployeeId: '1',
          message: 'Excellent technical skills and great team player.',
          rating: 5,
          date: '2023-12-01',
          category: 'technical'
        }
      ],
      hireDate: '2020-03-15',
      salary: 120000,
      managerId: '3',
      status: 'active',
      avatar: '/avatars/john-doe.jpg',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
      certifications: [
        {
          id: 'c1',
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          issueDate: '2022-06-15',
          credentialId: 'AWS-DEV-12345'
        }
      ],
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543',
        email: 'jane.doe@email.com'
      }
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      age: 28,
      department: Department.Marketing,
      phone: '+1 (555) 234-5678',
      address: {
        street: '456 Oak Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      bio: 'Marketing Specialist with expertise in digital marketing and brand strategy.',
      performanceRating: 5,
      projectHistory: [
        {
          id: 'p2',
          name: 'Brand Campaign 2023',
          description: 'Led successful brand awareness campaign across multiple channels',
          startDate: '2023-03-01',
          endDate: '2023-08-31',
          role: 'Campaign Manager',
          technologies: ['Google Ads', 'Facebook Ads', 'Analytics'],
          status: 'completed',
          performanceRating: 5
        }
      ],
      feedback: [
        {
          id: 'f2',
          fromEmployeeId: '1',
          toEmployeeId: '2',
          message: 'Outstanding creativity and results-driven approach.',
          rating: 5,
          date: '2023-11-15',
          category: 'performance'
        }
      ],
      hireDate: '2021-07-01',
      salary: 85000,
      status: 'active',
      avatar: '/avatars/sarah-johnson.jpg',
      skills: ['Digital Marketing', 'Brand Strategy', 'Google Ads', 'Social Media'],
      certifications: [
        {
          id: 'c2',
          name: 'Google Ads Certification',
          issuer: 'Google',
          issueDate: '2022-03-10',
          credentialId: 'GOOGLE-ADS-67890'
        }
      ],
      emergencyContact: {
        name: 'Mike Johnson',
        relationship: 'Spouse',
        phone: '+1 (555) 876-5432',
        email: 'mike.johnson@email.com'
      }
    }
  ]

  return mockEmployees
}

/**
 * Search employees with pagination
 */
export function searchEmployees(
  employees: Employee[],
  filters: FilterOptions,
  page: number = 1,
  limit: number = 10
): SearchResult<Employee> {
  const filteredEmployees = filterEmployees(employees, filters)
  const sortedEmployees = sortEmployees(
    filteredEmployees, 
    filters.sortBy, 
    filters.sortOrder
  )
  
  const total = sortedEmployees.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const items = sortedEmployees.slice(startIndex, endIndex)

  return {
    items,
    total,
    page,
    limit,
    totalPages
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  return phoneRegex.test(phone)
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