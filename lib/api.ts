import type { Employee, PerformanceRating } from "@/types"
import { Department } from "@/types"
import { generateId } from "./utils"

/**
 * DummyJSON API integration for employee data
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

interface DummyJSONResponse {
  users: DummyUser[]
  total: number
  skip: number
  limit: number
}

/**
 * Fetch users from DummyJSON API
 */
export async function fetchUsers(limit: number = 30): Promise<DummyUser[]> {
  try {
    const response = await fetch(`https://dummyjson.com/users?limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: DummyJSONResponse = await response.json()
    return data.users || []
  } catch (error) {
    console.error('Error fetching users from DummyJSON:', error)
    throw error
  }
}

/**
 * Transform DummyJSON user data to Employee format
 */
export function transformUserToEmployee(user: DummyUser): Employee {
  // Generate random department
  const departments = Object.values(Department)
  const randomDepartment = departments[Math.floor(Math.random() * departments.length)] as Department
  
  // Generate random performance rating (3-5 for realistic data)
  const randomRating = (Math.floor(Math.random() * 3) + 3) as PerformanceRating
  
  // Generate random hire date (within last 3 years)
  const currentDate = new Date()
  const randomDaysAgo = Math.floor(Math.random() * 1095) // 3 years in days
  const hireDate = new Date(currentDate.getTime() - (randomDaysAgo * 24 * 60 * 60 * 1000))
  
  // Generate random salary based on department
  const baseSalaries: Record<Department, number> = {
    [Department.Engineering]: 85000,
    [Department.Marketing]: 65000,
    [Department.Sales]: 70000,
    [Department.Finance]: 75000,
    [Department.HR]: 60000,
    [Department.Operations]: 65000,
    [Department.Legal]: 90000,
    [Department.IT]: 80000,
    [Department.CustomerSupport]: 55000,
    [Department.Product]: 95000
  }
  
  const baseSalary = baseSalaries[randomDepartment]
  const experienceMultiplier = 1 + (Math.random() * 0.6) // 0-60% bonus
  const salary = Math.round(baseSalary * experienceMultiplier)
  
  // Generate skills based on department
  const departmentSkills: Record<Department, string[]> = {
    [Department.Engineering]: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'Git'],
    [Department.Marketing]: ['Digital Marketing', 'SEO', 'Google Ads', 'Social Media', 'Content Creation', 'Analytics'],
    [Department.Sales]: ['Sales Strategy', 'CRM', 'Negotiation', 'Lead Generation', 'Client Relations', 'Salesforce'],
    [Department.Finance]: ['Financial Analysis', 'Excel', 'QuickBooks', 'Budgeting', 'Risk Management', 'SAP'],
    [Department.HR]: ['Recruitment', 'Employee Relations', 'HRIS', 'Compliance', 'Training', 'Performance Management'],
    [Department.Operations]: ['Process Improvement', 'Project Management', 'Supply Chain', 'Quality Control', 'Lean'],
    [Department.Legal]: ['Contract Law', 'Compliance', 'Legal Research', 'Risk Assessment', 'Litigation'],
    [Department.IT]: ['System Administration', 'Network Security', 'Cloud Computing', 'Technical Support', 'Cybersecurity'],
    [Department.CustomerSupport]: ['Customer Service', 'Problem Solving', 'Communication', 'CRM Systems', 'Zendesk'],
    [Department.Product]: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Design Thinking', 'Figma']
  }
  
  const availableSkills = departmentSkills[randomDepartment]
  const numSkills = Math.floor(Math.random() * 4) + 3 // 3-6 skills
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
    bio: `${user.firstName} ${user.lastName} is a dedicated ${randomDepartment} professional with expertise in their field.`,
    performanceRating: randomRating,
    projectHistory: generateProjectHistory(),
    feedback: generateFeedback(user.id.toString()),
    hireDate: hireDate.toISOString().split('T')[0],
    salary,
    managerId: Math.random() > 0.7 ? (user.id + 10).toString() : undefined,
    status: 'active',
    avatar: user.image,
    skills,
    certifications: generateCertifications(),
    emergencyContact: {
      name: `${user.firstName} Emergency Contact`,
      relationship: Math.random() > 0.5 ? 'Spouse' : 'Parent',
      phone: user.phone,
      email: `emergency.${user.email}`
    }
  }
}

/**
 * Generate mock project history
 */
function generateProjectHistory() {
  const projects = [
    { name: 'Digital Transformation', role: 'Lead Developer', status: 'completed' as const },
    { name: 'Customer Portal', role: 'Frontend Developer', status: 'completed' as const },
    { name: 'Mobile App Redesign', role: 'UX/UI Designer', status: 'in_progress' as const },
    { name: 'Data Analytics Platform', role: 'Data Engineer', status: 'planned' as const },
    { name: 'Security Upgrade', role: 'Security Analyst', status: 'completed' as const }
  ]
  
  const numProjects = Math.floor(Math.random() * 3) + 1 // 1-3 projects
  return projects
    .sort(() => 0.5 - Math.random())
    .slice(0, numProjects)
    .map(project => ({
      id: generateId(),
      name: project.name,
      description: `${project.name} project focusing on improving business processes and user experience.`,
      startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: project.status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
      role: project.role,
      technologies: ['React', 'TypeScript', 'Node.js'],
      status: project.status,
      performanceRating: (Math.floor(Math.random() * 2) + 4) as PerformanceRating
    }))
}

/**
 * Generate mock feedback
 */
function generateFeedback(employeeId: string) {
  const feedbackMessages = [
    'Excellent work on the recent project. Shows great attention to detail.',
    'Strong technical skills and ability to work well in a team environment.',
    'Consistently delivers high-quality work and meets deadlines.',
    'Great communication skills and takes initiative on challenging tasks.',
    'Demonstrates leadership qualities and mentors junior team members effectively.'
  ]
  
  const numFeedback = Math.floor(Math.random() * 3) + 1 // 1-3 feedback items
  return Array.from({ length: numFeedback }, () => ({
    id: generateId(),
    fromEmployeeId: `manager-${Math.floor(Math.random() * 5) + 1}`,
    toEmployeeId: employeeId,
    message: feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)],
    rating: (Math.floor(Math.random() * 2) + 4) as PerformanceRating,
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'performance' as const
  }))
}

/**
 * Generate mock certifications
 */
function generateCertifications() {
  const certs = [
    { name: 'AWS Certified Developer', issuer: 'Amazon Web Services' },
    { name: 'Google Analytics Certified', issuer: 'Google' },
    { name: 'PMP Certification', issuer: 'Project Management Institute' },
    { name: 'Salesforce Administrator', issuer: 'Salesforce' },
    { name: 'Microsoft Azure Fundamentals', issuer: 'Microsoft' }
  ]
  
  const numCerts = Math.floor(Math.random() * 2) + 1 // 1-2 certifications
  return certs
    .sort(() => 0.5 - Math.random())
    .slice(0, numCerts)
    .map(cert => ({
      id: generateId(),
      name: cert.name,
      issuer: cert.issuer,
      issueDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      credentialId: `CERT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    }))
}

/**
 * Fetch employees data
 */
export async function fetchEmployees(
  page: number = 1,
  limit: number = 20,
  searchTerm?: string,
  department?: Department
): Promise<{ employees: Employee[], total: number, page: number, limit: number }> {
  try {
    const users = await fetchUsers(20) // Fetch exactly 20 users
    let employees = users.map(transformUserToEmployee)
    
    // Apply filters
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      employees = employees.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term)
      )
    }
    
    if (department) {
      employees = employees.filter(emp => emp.department === department)
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit
    const paginatedEmployees = employees.slice(startIndex, startIndex + limit)
    
    return {
      employees: paginatedEmployees,
      total: employees.length,
      page,
      limit
    }
  } catch (error) {
    console.error('[fetchEmployees] Error:', error)
    throw error
  }
}
