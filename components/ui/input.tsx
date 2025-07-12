import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type = 'text', ...props }, ref) => {
    return (
      <div className={cn('relative flex items-center w-full', className)}>
        {icon && (
          <span className="absolute left-3 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input' 