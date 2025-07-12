import type { PerformanceRating, Project, Feedback, Certification } from '@/types'
import { generateId } from './utils'

/**
 * Generate mock performance history for an employee
 * @param employeeId - The employee ID
 * @param months - Number of months of history to generate (default: 12)
 * @returns Array of performance history entries
 */
export function generatePerformanceHistory(employeeId: string, months: number = 12): Array<{
  id: string
  employeeId: string
  rating: PerformanceRating
  date: string
  notes: string
  reviewer: string
}> {
  const history = []
  const currentDate = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const rating = (Math.floor(Math.random() * 3) + 3) as PerformanceRating // 3-5 rating
    
    const notes = [
      'Consistently meets expectations and delivers quality work.',
      'Shows strong initiative and takes on additional responsibilities.',
      'Excellent team player with great communication skills.',
      'Demonstrates technical expertise and problem-solving abilities.',
      'Adapts well to changing priorities and requirements.',
      'Maintains high standards and attention to detail.',
      'Collaborates effectively with cross-functional teams.',
      'Shows leadership potential and mentors junior team members.'
    ]
    
    const reviewers = [
      'Sarah Johnson',
      'Michael Chen',
      'Emily Rodriguez',
      'David Thompson',
      'Lisa Wang',
      'James Wilson',
      'Maria Garcia',
      'Robert Brown'
    ]
    
         history.push({
       id: generateId(),
       employeeId: employeeId,
       rating,
      date: date.toISOString().split('T')[0],
      notes: notes[Math.floor(Math.random() * notes.length)],
      reviewer: reviewers[Math.floor(Math.random() * reviewers.length)]
    })
  }
  
  return history
}

/**
 * Generate mock project history for an employee
 * @returns Array of project history entries
 */
export function generateProjectHistory(): Project[] {
  const projectTemplates = [
    {
      name: 'Digital Transformation Initiative',
      description: 'Led the digital transformation project across multiple departments, resulting in 30% efficiency improvement',
      role: 'Project Lead',
      technologies: ['Agile', 'Jira', 'Confluence', 'Slack', 'Azure DevOps']
    },
    {
      name: 'Customer Experience Enhancement',
      description: 'Improved customer satisfaction scores by 25% through process optimization and user experience improvements',
      role: 'Process Analyst',
      technologies: ['Survey Tools', 'Analytics', 'CRM', 'User Research', 'A/B Testing']
    },
    {
      name: 'System Migration Project',
      description: 'Successfully migrated legacy systems to modern cloud infrastructure, reducing operational costs by 40%',
      role: 'Technical Lead',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD']
    },
    {
      name: 'Marketing Campaign Optimization',
      description: 'Increased conversion rates by 40% through targeted marketing campaigns and data-driven insights',
      role: 'Campaign Manager',
      technologies: ['Google Ads', 'Facebook Ads', 'Analytics', 'A/B Testing', 'Marketing Automation']
    },
    {
      name: 'Employee Training Platform',
      description: 'Developed and implemented a comprehensive employee training platform used by 500+ employees',
      role: 'Product Manager',
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Learning Management System']
    },
    {
      name: 'Data Analytics Dashboard',
      description: 'Built real-time analytics dashboard providing insights to executive leadership team',
      role: 'Data Analyst',
      technologies: ['Python', 'SQL', 'Tableau', 'Power BI', 'Apache Spark']
    },
    {
      name: 'Security Infrastructure Upgrade',
      description: 'Enhanced company security infrastructure with multi-factor authentication and advanced threat detection',
      role: 'Security Engineer',
      technologies: ['SIEM', 'Firewall', 'VPN', 'Identity Management', 'Penetration Testing']
    },
    {
      name: 'Mobile App Development',
      description: 'Led development of customer-facing mobile application with 10,000+ downloads',
      role: 'Mobile Developer',
      technologies: ['React Native', 'TypeScript', 'Firebase', 'App Store', 'Google Play']
    }
  ]
  
  const numProjects = Math.floor(Math.random() * 4) + 2 // 2-5 projects
  const selectedProjects = projectTemplates
    .sort(() => 0.5 - Math.random())
    .slice(0, numProjects)
  
  return selectedProjects.map((project) => {
    const startDate = new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000))
    const duration = Math.floor(Math.random() * 180) + 30 // 30-210 days
    const endDate = new Date(startDate.getTime() + (duration * 24 * 60 * 60 * 1000))
    
    return {
      id: generateId(),
      name: project.name,
      description: project.description,
      startDate: startDate.toISOString().split('T')[0],
      endDate: Math.random() > 0.2 ? endDate.toISOString().split('T')[0] : undefined,
      role: project.role,
      technologies: project.technologies,
      status: Math.random() > 0.7 ? 'completed' as const : 'in_progress' as const,
      performanceRating: (Math.floor(Math.random() * 3) + 3) as PerformanceRating
    }
  })
}

/**
 * Generate mock feedback for an employee
 * @param employeeId - The employee ID
 * @param fromEmployeeIds - Array of employee IDs who can give feedback
 * @returns Array of feedback entries
 */
export function generateFeedback(employeeId: string, fromEmployeeIds: string[] = []): Feedback[] {
  const feedbackTemplates = [
    {
      message: 'Excellent work ethic and consistently delivers high-quality results on time.',
      category: 'performance' as const
    },
    {
      message: 'Great team player and always willing to help colleagues with their projects.',
      category: 'collaboration' as const
    },
    {
      message: 'Shows strong leadership potential and takes initiative on challenging projects.',
      category: 'leadership' as const
    },
    {
      message: 'Demonstrates excellent technical skills and creative problem-solving abilities.',
      category: 'technical' as const
    },
    {
      message: 'Communicates effectively with stakeholders and team members across departments.',
      category: 'communication' as const
    },
    {
      message: 'Adapts quickly to new technologies and processes with minimal guidance.',
      category: 'technical' as const
    },
    {
      message: 'Maintains a positive attitude even during challenging project phases.',
      category: 'performance' as const
    },
    {
      message: 'Provides valuable insights and suggestions that improve team processes.',
      category: 'leadership' as const
    },
    {
      message: 'Reliable and dependable team member who can be counted on to deliver.',
      category: 'performance' as const
    },
    {
      message: 'Shows excellent attention to detail and quality in all deliverables.',
      category: 'technical' as const
    }
  ]
  
  const numFeedback = Math.floor(Math.random() * 4) + 2 // 2-5 feedback entries
  const selectedFeedback = feedbackTemplates
    .sort(() => 0.5 - Math.random())
    .slice(0, numFeedback)
  
  return selectedFeedback.map((feedback) => {
    const fromId = fromEmployeeIds.length > 0 
      ? fromEmployeeIds[Math.floor(Math.random() * fromEmployeeIds.length)]
      : `emp-${Math.floor(Math.random() * 100) + 1}`
    
    return {
      id: generateId(),
      fromEmployeeId: fromId,
      toEmployeeId: employeeId,
      message: feedback.message,
      rating: (Math.floor(Math.random() * 2) + 4) as PerformanceRating, // 4-5 rating
      date: new Date(Date.now() - (Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      category: feedback.category
    }
  })
}

/**
 * Generate mock certifications for an employee
 * @returns Array of certification entries
 */
export function generateCertifications(): Certification[] {
  const certificationTemplates = [
    { name: 'PMP Certification', issuer: 'Project Management Institute', category: 'Project Management' },
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', category: 'Cloud Computing' },
    { name: 'Google Ads Certification', issuer: 'Google', category: 'Digital Marketing' },
    { name: 'Salesforce Administrator', issuer: 'Salesforce', category: 'CRM' },
    { name: 'SHRM-CP', issuer: 'Society for Human Resource Management', category: 'Human Resources' },
    { name: 'CISSP', issuer: 'ISC²', category: 'Information Security' },
    { name: 'Microsoft Azure Administrator', issuer: 'Microsoft', category: 'Cloud Computing' },
    { name: 'Google Analytics Individual Qualification', issuer: 'Google', category: 'Analytics' },
    { name: 'Certified Scrum Master', issuer: 'Scrum Alliance', category: 'Agile' },
    { name: 'ITIL Foundation', issuer: 'AXELOS', category: 'IT Service Management' },
    { name: 'Six Sigma Green Belt', issuer: 'ASQ', category: 'Process Improvement' },
    { name: 'HubSpot Marketing Certification', issuer: 'HubSpot', category: 'Marketing' }
  ]
  
  const numCertifications = Math.floor(Math.random() * 3) + 1 // 1-3 certifications
  const selectedCertifications = certificationTemplates
    .sort(() => 0.5 - Math.random())
    .slice(0, numCertifications)
  
  return selectedCertifications.map(cert => ({
    id: generateId(),
    name: cert.name,
    issuer: cert.issuer,
    issueDate: new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    credentialId: `CERT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    category: cert.category
  }))
} 