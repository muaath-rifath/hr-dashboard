import type { Employee, PerformanceRating } from "@/types"
import { Department } from "@/types"
import { generateId } from "./utils"

// DummyJSON API base URL
const DUMMY_JSON_BASE_URL = 'https://dummyjson.com'

/**
 * Fetch users from DummyJSON API
 */
export async function fetchUsers(limit: number = 20) {
  try {
    const response = await fetch(`${DUMMY_JSON_BASE_URL}/users?limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.users || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

/**
 * Transform DummyJSON user data to Employee format
 */
export function transformUserToEmployee(user: any): Employee {
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
    projectHistory: generateProjectHistory(user.id),
    feedback: generateFeedback(user.id),
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
 * Generate mock project history
 */
function generateProjectHistory(employeeId: number) {
  const projectTemplates = [
    {
      name: 'Digital Transformation Initiative',
      description: 'Led the digital transformation project across multiple departments',
      role: 'Project Lead',
      technologies: ['Agile', 'Jira', 'Confluence', 'Slack']
    },
    {
      name: 'Customer Experience Enhancement',
      description: 'Improved customer satisfaction scores by 25% through process optimization',
      role: 'Process Analyst',
      technologies: ['Survey Tools', 'Analytics', 'CRM']
    },
    {
      name: 'System Migration Project',
      description: 'Successfully migrated legacy systems to modern cloud infrastructure',
      role: 'Technical Lead',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform']
    },
    {
      name: 'Marketing Campaign Optimization',
      description: 'Increased conversion rates by 40% through targeted marketing campaigns',
      role: 'Campaign Manager',
      technologies: ['Google Ads', 'Facebook Ads', 'Analytics', 'A/B Testing']
    }
  ]
  
  const numProjects = Math.floor(Math.random() * 3) + 1
  const selectedProjects = projectTemplates
    .sort(() => 0.5 - Math.random())
    .slice(0, numProjects)
  
  return selectedProjects.map((project, index) => ({
    id: generateId(),
    name: project.name,
    description: project.description,
    startDate: new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    endDate: Math.random() > 0.3 ? new Date(Date.now() - (Math.random() * 180 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : undefined,
    role: project.role,
    technologies: project.technologies,
    status: Math.random() > 0.7 ? 'completed' as const : 'in_progress' as const,
    performanceRating: (Math.floor(Math.random() * 3) + 3) as PerformanceRating
  }))
}

/**
 * Generate mock feedback
 */
function generateFeedback(employeeId: number) {
  const feedbackTemplates = [
    {
      message: 'Excellent work ethic and consistently delivers high-quality results.',
      category: 'performance' as const
    },
    {
      message: 'Great team player and always willing to help colleagues.',
      category: 'collaboration' as const
    },
    {
      message: 'Shows strong leadership potential and takes initiative on projects.',
      category: 'leadership' as const
    },
    {
      message: 'Demonstrates excellent technical skills and problem-solving abilities.',
      category: 'technical' as const
    },
    {
      message: 'Communicates effectively with stakeholders and team members.',
      category: 'communication' as const
    }
  ]
  
  const numFeedback = Math.floor(Math.random() * 3) + 1
  const selectedFeedback = feedbackTemplates
    .sort(() => 0.5 - Math.random())
    .slice(0, numFeedback)
  
  return selectedFeedback.map((feedback, index) => ({
    id: generateId(),
    fromEmployeeId: (employeeId + index + 1).toString(),
    toEmployeeId: employeeId.toString(),
    message: feedback.message,
    rating: (Math.floor(Math.random() * 2) + 4) as PerformanceRating, // 4-5 rating
    date: new Date(Date.now() - (Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    category: feedback.category
  }))
}

/**
 * Generate mock certifications
 */
function generateCertifications() {
  const certificationTemplates = [
    { name: 'PMP Certification', issuer: 'Project Management Institute' },
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
    { name: 'Google Ads Certification', issuer: 'Google' },
    { name: 'Salesforce Administrator', issuer: 'Salesforce' },
    { name: 'SHRM-CP', issuer: 'Society for Human Resource Management' }
  ]
  
  const numCertifications = Math.floor(Math.random() * 2) + 1
  const selectedCertifications = certificationTemplates
    .sort(() => 0.5 - Math.random())
    .slice(0, numCertifications)
  
  return selectedCertifications.map(cert => ({
    id: generateId(),
    name: cert.name,
    issuer: cert.issuer,
    issueDate: new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    credentialId: `CERT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
  }))
}

/**
 * Fetch and transform employees from DummyJSON
 */
export async function fetchEmployees(limit: number = 20): Promise<Employee[]> {
  try {
    const users = await fetchUsers(limit)
    const employees = users.map(transformUserToEmployee)
    return employees
  } catch (error) {
    console.error('Error fetching employees:', error)
    return []
  }
}

/**
 * Search employees with API integration
 */
export async function searchEmployeesAPI(
  searchTerm?: string,
  department?: Department,
  page: number = 1,
  limit: number = 10
): Promise<{ employees: Employee[], total: number }> {
  try {
    // For now, fetch all employees and filter client-side
    // In a real app, you'd implement server-side filtering
    const allEmployees = await fetchEmployees(50) // Fetch more for search
    
    let filteredEmployees = allEmployees
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredEmployees = filteredEmployees.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term)
      )
    }
    
    if (department) {
      filteredEmployees = filteredEmployees.filter(emp => emp.department === department)
    }
    
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
    return { employees: [], total: 0 }
  }
} 