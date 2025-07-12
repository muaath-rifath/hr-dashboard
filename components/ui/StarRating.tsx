import { IconStar, IconStarHalf } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { PerformanceRating } from '@/types'

interface StarRatingProps {
  rating: PerformanceRating
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function StarRating({ 
  rating, 
  size = 'md', 
  showLabel = false, 
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IconStar
          key={`full-${i}`}
          className={cn(
            'fill-yellow-400 text-yellow-400',
            sizeClasses[size]
          )}
        />
      )
    }

    // Render half star if needed
    if (hasHalfStar) {
      stars.push(
        <IconStarHalf
          key="half"
          className={cn(
            'fill-yellow-400 text-yellow-400',
            sizeClasses[size]
          )}
        />
      )
    }

    // Render empty stars
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <IconStar
          key={`empty-${i}`}
          className={cn(
            'text-gray-300',
            sizeClasses[size]
          )}
        />
      )
    }

    return stars
  }

  const getRatingLabel = (rating: PerformanceRating) => {
    const labels: Record<PerformanceRating, string> = {
      1: 'Poor',
      2: 'Below Average',
      3: 'Average',
      4: 'Above Average',
      5: 'Excellent'
    }
    return labels[rating]
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {getRatingLabel(rating)}
        </span>
      )}
    </div>
  )
} 