import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card border rounded-lg shadow-sm p-0 w-full max-w-full sm:max-w-md md:max-w-lg mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}
export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('p-4 border-b', className)} {...props}>
      {children}
    </div>
  )
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}
export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  )
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}
export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('p-4 border-t', className)} {...props}>
      {children}
    </div>
  )
} 