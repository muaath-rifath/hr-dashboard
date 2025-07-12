import { IconEye, IconBookmark, IconTrendingUp, IconUser, IconBuilding, IconCurrencyDollar, IconMail } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { StarRating } from './StarRating'
import { formatCurrency, getFullName, getInitials } from '@/lib/utils'
import type { Employee } from '@/types'
import Image from 'next/image'
import { useState } from 'react'

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
  const [imageError, setImageError] = useState(false)

  return (
    <div className={cn(
      'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden min-w-80 max-w-md w-full flex flex-col items-center p-6',
      className
    )}>
      {/* Avatar */}
      <div className="flex justify-center mb-3">
        {employee.avatar && !imageError ? (
          <Image
            src={employee.avatar}
            alt={fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
            width={80}
            height={80}
            loading="lazy"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-100 dark:border-gray-700">
            <span className="text-white font-bold text-2xl">
              {initials}
            </span>
          </div>
        )}
      </div>
      {/* Name */}
      <h3 className="font-semibold text-xl text-gray-900 dark:text-white text-center break-words leading-tight">
        {fullName}
      </h3>
      {/* Email */}
      <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 mt-1 mb-2">
        <IconMail className="w-4 h-4" />
        <a
          href={`mailto:${employee.email}`}
          className="hover:underline break-all"
        >
          {employee.email}
        </a>
      </div>
      {/* Star Rating */}
      <div className="flex justify-center mb-4">
        <StarRating rating={employee.performanceRating} size="sm" />
      </div>
      {/* Employee Details */}
      <div className="w-full space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <IconUser className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-500 dark:text-gray-400">Age:</span>
          <span className="font-medium text-gray-900 dark:text-white">{employee.age}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <IconBuilding className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-500 dark:text-gray-400">Department:</span>
          <span className="font-medium text-gray-900 dark:text-white break-words">
            {employee.department}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <IconCurrencyDollar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-500 dark:text-gray-400">Salary:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(employee.salary)}
          </span>
        </div>
      </div>
      {/* Skills Section */}
      {employee.skills && employee.skills.length > 0 && (
        <div className="w-full mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {employee.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800"
              >
                {skill}
              </span>
            ))}
            {employee.skills.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                +{employee.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex gap-2 w-full mt-auto">
        <button
          onClick={() => onView?.(employee)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          <IconEye className="w-4 h-4" />
          <span>View</span>
        </button>
        <button
          onClick={() => onBookmark?.(employee)}
          className={cn(
            'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md',
            isBookmarked
              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-200'
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          )}
        >
          <IconBookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
        </button>
        <button
          onClick={() => onPromote?.(employee)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          <IconTrendingUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
} 