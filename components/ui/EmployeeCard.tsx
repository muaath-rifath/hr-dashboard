import { IconEye, IconBookmark, IconTrendingUp, IconUser } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { StarRating } from './StarRating'
import { formatCurrency, getFullName, getInitials } from '@/lib/utils'
import type { Employee } from '@/types'
import Image from 'next/image'

interface EmployeeCardProps {
  employee: Employee
  onView?: (employee: Employee) => void
  onBookmark?: (employee: Employee) => void
  onPromote?: (employee: Employee) => void
  isBookmarked?: boolean
  className?: string
}

export function EmployeeCard({
  employee,
  onView,
  onBookmark,
  onPromote,
  isBookmarked = false,
  className
}: EmployeeCardProps) {
  const fullName = getFullName(employee)
  const initials = getInitials(employee)

  return (
    <div className={cn(
      'bg-white dark:bg-gray-900 border rounded-lg p-6 hover:shadow-md transition-shadow',
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {employee.avatar ? (
            <Image
              src={employee.avatar}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover"
              width={48}
              height={48}
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">
                {initials}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {fullName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {employee.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={employee.performanceRating} size="sm" />
        </div>
      </div>

      {/* Employee Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <IconUser className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Age:</span>
          <span className="font-medium">{employee.age}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">Department:</span>
          <span className="font-medium">{employee.department}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Salary:</span>
          <span className="font-medium">{formatCurrency(employee.salary)}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Skills</p>
        <div className="flex flex-wrap gap-1">
          {employee.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
            >
              {skill}
            </span>
          ))}
          {employee.skills.length > 3 && (
            <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
              +{employee.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onView?.(employee)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <IconEye className="w-4 h-4" />
          View
        </button>
        
        <button
          onClick={() => onBookmark?.(employee)}
          className={cn(
            'flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium',
            isBookmarked
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          <IconBookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
        </button>
        
        <button
          onClick={() => onPromote?.(employee)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors text-sm font-medium"
        >
          <IconTrendingUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
} 