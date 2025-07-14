import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Bookmark, TrendingUp, MapPin, DollarSign, Star} from "lucide-react"
import { Employee } from "@/types"
import { formatCurrency, getFullName, getInitials } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { SkillsSection } from "./skills-section"
import Link from "next/link"

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
  const cardId = `employee-${employee.id || employee.email}` // Generate unique ID

  return (
    <Card className={cn("w-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="text-center p-4 sm:p-6 pb-2 sm:pb-3">
        <div className="flex justify-center mb-3">
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-primary/10">
            <AvatarImage src={employee.avatar} alt={fullName} />
            <AvatarFallback className="text-sm sm:text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base sm:text-lg text-center">{fullName}</h3>
          <p className="text-sm sm:text-base font-medium text-primary">{employee.department}</p>
          <Link href={`mailto:${employee.email}`}>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{employee.email}</p>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-2 sm:pt-3 space-y-3">
        {/* Performance Rating - Compact */}
        <div className="flex items-center justify-center gap-1">
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
          <span className="text-xs sm:text-sm font-medium ml-1 text-muted-foreground">
            {employee.performanceRating}/5
          </span>
        </div>

        {/* Employee Details - More Compact */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Age</span>
            </div>
            <p className="font-bold text-lg sm:text-xl">{employee.age}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Salary</span>
            </div>
            <p className="font-bold text-sm sm:text-base">{formatCurrency(employee.salary)}</p>
          </div>
        </div>

        {/* Skills - Only show on larger screens */}
        {employee.skills && employee.skills.length > 0 && (
          <div className="hidden sm:block">
            <SkillsSection skills={employee.skills} cardId={cardId} />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 p-4 sm:p-6 pt-2 sm:pt-3">
        <Button
          size="sm"
          onClick={() => onView?.(employee)}
          className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">View</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBookmark?.(employee)}
          className="h-8 sm:h-9 px-2 sm:px-3"
        >
          <Bookmark className={cn("w-3 h-3 sm:w-4 sm:h-4", isBookmarked && "fill-black dark:fill-white")} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPromote?.(employee)}
          className="h-8 sm:h-9 px-2 sm:px-3 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
        >
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
