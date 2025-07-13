# Custom Hooks Documentation

This document explains the custom hooks created to minimize repetitive code and make the HR Dashboard more modular.

## Overview

The custom hooks architecture follows the principle of separation of concerns, extracting common patterns from components and centralizing business logic in reusable hooks.

## Available Hooks

### 1. `useBookmarks` - Bookmark Management

**Purpose**: Manages employee bookmark functionality with consistent state management.

**Features**:
- Check if an employee is bookmarked
- Toggle bookmark status
- Get all bookmarked employees
- Bookmark statistics
- Clear all bookmarks

**Usage**:
```tsx
import { useBookmarks } from '@/hooks'

const { 
  bookmarkedEmployees, 
  bookmarkStats, 
  isBookmarked, 
  toggleBookmark, 
  clearBookmarks 
} = useBookmarks()

// Check if employee is bookmarked
const isEmpBookmarked = isBookmarked(employee.id)

// Toggle bookmark
toggleBookmark(employee)

// Get bookmark stats
console.log(bookmarkStats.total) // Number of bookmarks
console.log(bookmarkStats.hasBookmarks) // Boolean
```

### 2. `useSearch` - Search and Filter Management

**Purpose**: Centralizes search logic and filter management across components.

**Features**:
- Search term management
- Department filtering
- Performance rating filtering
- Filter state management
- Clear all filters
- Search statistics

**Usage**:
```tsx
import { useSearch } from '@/hooks'

const {
  searchTerm,
  selectedDepartment,
  filteredEmployees,
  searchStats,
  handleSearchChange,
  handleDepartmentChange,
  handleClearFilters
} = useSearch()

// Handle search
handleSearchChange('John Doe')

// Handle department filter
handleDepartmentChange('Engineering')

// Get search stats
console.log(searchStats.filteredCount) // Number of filtered results
console.log(searchStats.hasResults) // Boolean
```

### 3. `usePagination` - Pagination Logic

**Purpose**: Provides consistent pagination functionality across components.

**Features**:
- Page navigation (next, previous, specific page)
- Items per page management
- Pagination info calculation
- Page number generation for UI

**Usage**:
```tsx
import { usePagination } from '@/hooks'

const {
  currentPage,
  totalPages,
  paginatedItems,
  paginationInfo,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  changeItemsPerPage
} = usePagination(items)

// Navigate pages
goToPage(3)
goToNextPage()
goToPreviousPage()

// Change items per page
changeItemsPerPage(24)

// Get pagination info
console.log(paginationInfo.hasItems) // Boolean
console.log(paginationInfo.canGoNext) // Boolean
```

### 4. `useEmployeeActions` - Common Employee Actions

**Purpose**: Centralizes employee-related actions like view, bookmark, promote.

**Features**:
- Navigate to employee detail page
- Handle bookmark toggle
- Handle promotion (placeholder)
- Refresh employee data
- Additional actions for future use

**Usage**:
```tsx
import { useEmployeeActions } from '@/hooks'

const {
  handleEmployeeView,
  handleEmployeeBookmark,
  handleEmployeePromote,
  handleRefreshEmployees
} = useEmployeeActions()

// Use in component
<EmployeeCard
  employee={employee}
  onView={handleEmployeeView}
  onBookmark={handleEmployeeBookmark}
  onPromote={handleEmployeePromote}
/>
```

### 5. `useEmployeeStats` - Employee Statistics

**Purpose**: Provides various metrics and analytics about employee data.

**Features**:
- Basic statistics (total employees, departments, etc.)
- Performance distribution
- Department distribution
- Salary metrics
- Top performers
- Performance insights

**Usage**:
```tsx
import { useEmployeeStats } from '@/hooks'

const {
  totalEmployees,
  activeDepartments,
  averageRating,
  averageSalary,
  departmentDistribution,
  topPerformers,
  getLargestDepartment,
  getPerformanceInsights
} = useEmployeeStats()

// Get insights
const largestDept = getLargestDepartment()
const perfInsights = getPerformanceInsights()

console.log(perfInsights.highPerformerPercentage) // Percentage of high performers
```

### 6. `useEmployeeData` - Data Loading Management

**Purpose**: Manages employee data loading with consistent state handling.

**Features**:
- Data fetching with loading states
- Error handling
- Refresh functionality
- Force refresh capability
- Data availability checks

**Usage**:
```tsx
import { useEmployeeData } from '@/hooks'

const {
  employees,
  loading,
  error,
  hasData,
  refreshData,
  forceRefresh
} = useEmployeeData()

// Refresh data
refreshData()

// Force refresh (clears cache)
forceRefresh()

// Check data state
if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!hasData) return <EmptyState />
```

## Benefits of This Architecture

### 1. **Code Reusability**
- Common patterns extracted into reusable hooks
- Consistent behavior across components
- Reduced code duplication

### 2. **Separation of Concerns**
- Business logic separated from UI components
- State management centralized
- Easier testing and maintenance

### 3. **Type Safety**
- Full TypeScript support
- Type-safe parameters and return values
- Better IDE support and autocomplete

### 4. **Performance**
- Optimized with React hooks best practices
- Memoization where appropriate
- Efficient re-renders

### 5. **Maintainability**
- Single source of truth for business logic
- Easier to update functionality
- Better organization of code

## Migration Benefits

### Before (Component with Direct Store Access)
```tsx
// Old approach - lots of boilerplate
const {
  employees,
  bookmarkedIds,
  toggleBookmark,
  searchTerm,
  setSearchTerm,
  // ... many more store properties
} = useEmployeeStore()

// Manual calculations
const safeBookmarkedIds = bookmarkedIds instanceof Set ? bookmarkedIds : new Set()
const isBookmarked = safeBookmarkedIds.has(employee.id)

// Manual pagination logic
const totalPages = Math.ceil(displayEmployees.length / itemsPerPage)
const startIndex = (currentPage - 1) * itemsPerPage
const paginatedEmployees = displayEmployees.slice(startIndex, startIndex + itemsPerPage)
```

### After (With Custom Hooks)
```tsx
// New approach - clean and focused
const { bookmarkedEmployees, isBookmarked, toggleBookmark } = useBookmarks()
const { filteredEmployees, handleSearchChange } = useSearch()
const { paginatedItems, goToPage } = usePagination(filteredEmployees)
const { handleEmployeeView } = useEmployeeActions()
```

## Hook Composition

Hooks can be composed together for powerful functionality:

```tsx
function EmployeeManagement() {
  const { loading } = useEmployeeData()
  const { bookmarkedEmployees } = useBookmarks()
  const { filteredEmployees } = useSearch()
  const { paginatedItems } = usePagination(filteredEmployees)
  const { totalEmployees, averageRating } = useEmployeeStats()
  const { handleEmployeeView } = useEmployeeActions()

  // Clean, focused component logic
}
```

## Best Practices

1. **Import from Index**: Use `import { useBookmarks } from '@/hooks'` for cleaner imports
2. **Destructure Selectively**: Only destructure the properties you need
3. **Compose Hooks**: Combine multiple hooks for complex functionality
4. **Type Safety**: Leverage TypeScript for better development experience
5. **Performance**: Hooks are optimized, but still follow React best practices

This hook architecture makes the codebase more maintainable, testable, and follows React best practices while providing a great developer experience.
