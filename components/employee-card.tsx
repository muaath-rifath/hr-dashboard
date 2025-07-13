import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Bookmark, TrendingUp, MapPin, DollarSign, Star } from "lucide-react"
import { Employee } from "@/types"
import { formatCurrency, getFullName, getInitials, getRatingLabel } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface EmployeeCardProps {
  employee: Employee
  isBookmarked?: boolean
  onView?: (employee: Employee) => void
  onBookmark?: (employee: Employee) => void
  onPromote?: (employee: Employee) => void
  className?: string
}

export function EmployeeCard({
  employee,
  isBookmarked = false,
  onView,
  onBookmark,
  onPromote,
  className
}: EmployeeCardProps) {
  const fullName = getFullName(employee)
  const initials = getInitials(employee)
  const ratingLabel = getRatingLabel(employee.performanceRating)

  return (
    <Card className={cn("w-full hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="text-center p-3 sm:p-6">
        <div className="flex justify-center mb-2 sm:mb-4">
          <Avatar className="w-12 h-12 sm:w-20 sm:h-20">
            <AvatarImage src={employee.avatar} alt={fullName} />
            <AvatarFallback className="text-sm sm:text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="font-semibold text-sm sm:text-lg text-center">{fullName}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{employee.email}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-4 p-3 sm:p-6">
        {/* Performance Rating */}
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3 sm:w-4 sm:h-4",
                  i < employee.performanceRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{ratingLabel}</span>
        </div>

        {/* Department Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-xs">
            {employee.department}
          </Badge>
        </div>

        {/* Employee Details */}
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Age:</span>
            <span className="font-medium">{employee.age}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            <span className="text-muted-foreground hidden sm:inline">Salary:</span>
            <span className="font-medium text-xs sm:text-sm">{formatCurrency(employee.salary)}</span>
          </div>
        </div>

        {/* Skills - Only show on larger screens */}
        {employee.skills && employee.skills.length > 0 && (
          <div className="space-y-2 hidden sm:block">
            <p className="text-sm font-medium text-muted-foreground">Skills</p>
            <div className="flex flex-wrap gap-1">
              {employee.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {employee.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{employee.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-1 sm:gap-2 p-3 sm:p-6">
        <Button
          size="sm"
          onClick={() => onView?.(employee)}
          className="flex-1 text-xs sm:text-sm px-2 sm:px-4"
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:block">View</span>
        </Button>
        <Button
          size="sm"
          variant={isBookmarked ? "default" : "outline"}
          onClick={() => onBookmark?.(employee)}
          className="px-2 sm:px-4"
        >
          <Bookmark className={cn("w-3 h-3 sm:w-4 sm:h-4", isBookmarked && "fill-current")} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPromote?.(employee)}
          className="px-2 sm:px-4"
        >
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
