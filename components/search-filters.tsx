import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { Department } from "@/types"
import { useState } from "react"

interface SearchFiltersProps {
  searchTerm: string
  selectedDepartment: Department | null
  onSearchChange: (value: string) => void
  onDepartmentChange: (value: Department | null) => void
  onClearFilters: () => void
}

export function SearchFilters({
  searchTerm,
  selectedDepartment,
  onSearchChange,
  onDepartmentChange,
  onClearFilters
}: SearchFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearchTerm)
  }

  const departments = Object.values(Department)

  const hasActiveFilters = searchTerm || selectedDepartment

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search employees by name, email, department, or skills..."
            value={localSearchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium whitespace-nowrap">Department:</label>
          <Select
            value={selectedDepartment || "all"}
            onValueChange={(value: string) => 
              onDepartmentChange(value === "all" ? null : value as Department)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
