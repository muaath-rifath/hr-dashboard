'use client'

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Search, X, Star, Building2, User, Mail, Hash, TrendingUp } from "lucide-react"
import { Department, PerformanceRating } from "@/types"
import { useEmployeeStore } from "@/lib/store"

interface SearchBarProps {
  searchTerm: string
  selectedDepartment: Department | null
  onSearchChange: (value: string) => void
  onDepartmentChange: (value: Department | null) => void
  onClearFilters: () => void
  showPerformanceFilter?: boolean
  selectedPerformanceRating?: PerformanceRating | null
  onPerformanceRatingChange?: (value: PerformanceRating | null) => void
}

interface SearchSuggestion {
  type: 'name' | 'email' | 'skill' | 'department'
  value: string
  label: string
  icon: React.ReactNode
}

export function SearchBar({
  searchTerm,
  selectedDepartment,
  onSearchChange,
  onDepartmentChange,
  onClearFilters,
  showPerformanceFilter = false,
  selectedPerformanceRating = null,
  onPerformanceRatingChange
}: SearchBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const { employees } = useEmployeeStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Generate suggestions based on input
  const generateSuggestions = (query: string): SearchSuggestion[] => {
    if (!query || query.length < 2) return []
    
    const lowerQuery = query.toLowerCase()
    const suggestionSet = new Set<string>()
    const results: SearchSuggestion[] = []
    
    employees.forEach(employee => {
      // Name suggestions
      const fullName = `${employee.firstName} ${employee.lastName}`
      if (fullName.toLowerCase().includes(lowerQuery) && !suggestionSet.has(fullName)) {
        suggestionSet.add(fullName)
        results.push({
          type: 'name',
          value: fullName,
          label: fullName,
          icon: <User className="w-4 h-4" />
        })
      }
      
      // Email suggestions
      if (employee.email.toLowerCase().includes(lowerQuery) && !suggestionSet.has(employee.email)) {
        suggestionSet.add(employee.email)
        results.push({
          type: 'email',
          value: employee.email,
          label: employee.email,
          icon: <Mail className="w-4 h-4" />
        })
      }
      
      // Department suggestions
      if (employee.department.toLowerCase().includes(lowerQuery) && !suggestionSet.has(employee.department)) {
        suggestionSet.add(employee.department)
        results.push({
          type: 'department',
          value: employee.department,
          label: employee.department,
          icon: <Building2 className="w-4 h-4" />
        })
      }
      
      // Skills suggestions
      employee.skills.forEach(skill => {
        if (skill.toLowerCase().includes(lowerQuery) && !suggestionSet.has(skill)) {
          suggestionSet.add(skill)
          results.push({
            type: 'skill',
            value: skill,
            label: skill,
            icon: <Hash className="w-4 h-4" />
          })
        }
      })
    })
    
    // Limit to 8 suggestions and prioritize exact matches
    return results
      .sort((a, b) => {
        const aExact = a.value.toLowerCase().startsWith(lowerQuery)
        const bExact = b.value.toLowerCase().startsWith(lowerQuery)
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return a.value.localeCompare(b.value)
      })
      .slice(0, 8)
  }

  // Update suggestions when search term changes
  useEffect(() => {
    const newSuggestions = generateSuggestions(localSearchTerm)
    setSuggestions(newSuggestions)
    setSelectedSuggestionIndex(-1)
  }, [localSearchTerm, employees])

  // Sync local search term with prop changes (e.g., when filters are cleared)
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearchTerm)
    setShowSuggestions(false)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    setShowSuggestions(value.length >= 2)
    // Don't trigger search immediately - only show suggestions
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setLocalSearchTerm(suggestion.value)
    onSearchChange(suggestion.value)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleInputFocus = () => {
    if (localSearchTerm.length >= 2) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex])
        } else {
          handleSearchSubmit(e)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
    }
  }

  const departments = Object.values(Department)
  const performanceRatings: PerformanceRating[] = [1, 2, 3, 4, 5]
  const hasActiveFilters = searchTerm || selectedDepartment || (showPerformanceFilter && selectedPerformanceRating)

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Container with consistent width for both rows */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="name, email, or skills..."
                value={localSearchTerm}
                onChange={handleSearchInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="pl-12 h-12 text-base"
                autoComplete="off"
              />
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.value}`}
                      type="button"
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${
                        index === selectedSuggestionIndex ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="text-gray-500 flex-shrink-0">
                        {suggestion.icon}
                      </span>
                      <span className="text-sm text-gray-700 truncate">
                        {suggestion.label}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto capitalize">
                        {suggestion.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>          <Button type="submit" size="lg" className="h-12 px-8 flex-shrink-0">
            <Search className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          </form>          {/* Filters Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Department Filter */}
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <label className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:block">
                Department:
              </label>
              <Select
                value={selectedDepartment || "all"}
                onValueChange={(value: string) => 
                  onDepartmentChange(value === "all" ? null : value as Department)
                }
              >
                <SelectTrigger className="w-[120px] sm:w-[200px] h-10">
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

            {/* Right side - Performance Rating Filter and Clear Button */}
            <div className="flex items-center gap-4">
              {/* Performance Rating Filter */}
              {showPerformanceFilter && onPerformanceRatingChange && (
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <label className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:block">
                    Rating:
                  </label>
                  <Select
                    value={selectedPerformanceRating?.toString() || "all"}
                    onValueChange={(value: string) => 
                      onPerformanceRatingChange(value === "all" ? null : parseInt(value) as PerformanceRating)
                    }
                  >
                    <SelectTrigger className="w-[100px] sm:w-[160px] h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ratings</SelectItem>
                      {performanceRatings.map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Star{rating !== 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={onClearFilters}
                  className="gap-2 h-10"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
