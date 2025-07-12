import * as React from 'react'
import { cn } from '@/lib/utils'
import { RATING_COLORS, RATING_LABELS } from '@/lib/constants'
import type { PerformanceRating } from '@/types'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  rating: PerformanceRating
  children?: React.ReactNode
}

export function Badge({ rating, children, className, ...props }: BadgeProps) {
  const color = RATING_COLORS[rating]
  const label = RATING_LABELS[rating]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
        color.bg,
        color.text,
        color.border,
        className
      )}
      role="status"
      aria-label={label}
      {...props}
    >
      {children ?? label}
    </span>
  )
} 