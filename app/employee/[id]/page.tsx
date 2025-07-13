'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Briefcase, 
  Award,
  User,
  Building2,
  TrendingUp,
  MessageSquare,
  Loader2,
  AlertCircle,
  Bookmark
} from 'lucide-react'
import { Employee, PerformanceRating } from '@/types'
import { fetchEmployeeById } from '@/lib/api'
import { formatCurrency, getFullName, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useBookmarks } from '@/hooks'

export default function EmployeeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get bookmark functionality from store
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const isEmployeeBookmarked = employee ? isBookmarked(employee.id) : false

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true)
        setError(null)
        const employeeData = await fetchEmployeeById(id)
        setEmployee(employeeData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employee details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEmployee()
    }
  }, [id])

  // Handler functions
  const handleBookmark = () => {
    if (employee) {
      toggleBookmark(employee)
    }
  }

  const handlePromote = () => {
    if (employee) {
      console.log('Promote employee:', employee)
      // TODO: Implement promotion logic
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading employee details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Employee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{error || 'Employee not found'}</p>
            <div className="flex gap-2">
              <Button onClick={() => router.back()} variant="outline">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fullName = getFullName(employee)
  const initials = getInitials(employee)

  const renderStars = (rating: PerformanceRating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        )}
      />
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          onClick={() => router.back()} 
          variant="outline" 
          size="sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Employee Details</h1>
      </div>

      {/* Main Profile Card */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            {/* Desktop Layout */}
            <div className="hidden md:flex md:flex-col gap-3">
              {/* Top Section: Basic Info with Action Buttons at Name Level */}
              <div className="flex items-start justify-between">
                {/* Left: Avatar and Basic Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-24 h-24 ring-2 ring-primary/10">
                    <AvatarImage src={employee.avatar} alt={fullName} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{fullName}</h2>
                    <p className="text-lg text-primary font-medium">{employee.department}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {employee.status.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {renderStars(employee.performanceRating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          {employee.performanceRating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons and Stats */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBookmark}
                      className="h-9 px-3"
                    >
                      <Bookmark className={cn("w-4 h-4", isEmployeeBookmarked && "fill-black dark:fill-white")} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePromote}
                      className="h-9 px-3 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Quick Stats - Desktop */}
                  <div className="flex justify-between gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{employee.age}</div>
                      <div className="text-xs text-muted-foreground">Years Old</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatCurrency(employee.salary)}</div>
                      <div className="text-xs text-muted-foreground">Annual Salary</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{employee.skills.length}</div>
                      <div className="text-xs text-muted-foreground">Skills</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-4">
              {/* Avatar and Basic Info - Centered */}
              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar className="w-20 h-20 ring-2 ring-primary/10">
                  <AvatarImage src={employee.avatar} alt={fullName} />
                  <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">{fullName}</h2>
                  <p className="text-base text-primary font-medium">{employee.department}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {employee.status.replace('_', ' ')}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {renderStars(employee.performanceRating)}
                      <span className="text-sm text-muted-foreground ml-1">
                        {employee.performanceRating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile */}
              <div className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBookmark}
                  className="h-9 px-4"
                >
                  <Bookmark className={cn("w-4 h-4 mr-2", isEmployeeBookmarked && "fill-black dark:fill-white")} />
                  Bookmark
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePromote}
                  className="h-9 px-4 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Promote
                </Button>
              </div>

              {/* Quick Stats - Mobile */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-xl font-bold">{employee.age}</div>
                  <div className="text-xs text-muted-foreground">Years Old</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{formatCurrency(employee.salary)}</div>
                  <div className="text-xs text-muted-foreground">Annual Salary</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{employee.skills.length}</div>
                  <div className="text-xs text-muted-foreground">Skills</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{employee.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.address.street}, {employee.address.city}, {employee.address.state} {employee.address.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Hire Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {employee.bio}
              </p>
            </CardContent>
          </Card>

          {/* Project History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Project History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.projectHistory.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.role}</p>
                      </div>
                      <Badge 
                        variant={
                          project.status === 'completed' ? 'default' : 
                          project.status === 'in_progress' ? 'secondary' : 
                          'outline'
                        }
                        className="text-xs"
                      >
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {new Date(project.startDate).toLocaleDateString()} - {' '}
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                      </span>
                      {project.performanceRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{project.performanceRating}/5</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.feedback.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.rating)}
                        </div>
                        <span className="text-sm font-medium">{feedback.rating}/5</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(feedback.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{feedback.message}</p>
                    <Badge variant="outline" className="text-xs">
                      {feedback.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employee.certifications.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-3 space-y-1">
                    <h4 className="font-medium text-sm">{cert.name}</h4>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                      <span>ID: {cert.credentialId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium text-sm">{employee.emergencyContact.name}</p>
                <p className="text-xs text-muted-foreground">{employee.emergencyContact.relationship}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="h-3 w-3" />
                  <span>{employee.emergencyContact.phone}</span>
                </div>
                {employee.emergencyContact.email && (
                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="h-3 w-3" />
                    <span>{employee.emergencyContact.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Department</span>
                <span className="text-sm font-medium">{employee.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary" className="text-xs">
                  {employee.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Salary</span>
                <span className="text-sm font-medium">{formatCurrency(employee.salary)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hire Date</span>
                <span className="text-sm font-medium">
                  {new Date(employee.hireDate).toLocaleDateString()}
                </span>
              </div>
              {employee.managerId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Manager ID</span>
                  <span className="text-sm font-medium">{employee.managerId}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
