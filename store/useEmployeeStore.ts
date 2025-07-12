import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Employee, FilterOptions, Department } from '@/types'

// Employee Store State Interface
interface EmployeeState {
  // Data
  employees: Employee[]
  bookmarkedIds: Set<string>
  
  // UI State
  loading: boolean
  error: string | null
  
  // Filters and Search
  filters: FilterOptions
  searchTerm: string
  selectedDepartment: Department | null
  
  // Pagination
  currentPage: number
  itemsPerPage: number
  totalPages: number
}

// Employee Store Actions Interface
interface EmployeeActions {
  // Data Management
  setEmployees: (employees: Employee[]) => void
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  removeEmployee: (id: string) => void
  
  // Bookmark Management
  toggleBookmark: (employeeId: string) => void
  setBookmarkedIds: (ids: string[]) => void
  clearBookmarks: () => void
  
  // Loading States
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Filter Management
  setFilters: (filters: Partial<FilterOptions>) => void
  resetFilters: () => void
  setSearchTerm: (term: string) => void
  setSelectedDepartment: (department: Department | null) => void
  
  // Pagination
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  setTotalPages: (pages: number) => void
  
  // Computed Actions
  getBookmarkedEmployees: () => Employee[]
  getFilteredEmployees: () => Employee[]
  getEmployeeById: (id: string) => Employee | undefined
}

// Combined Store Type
type EmployeeStore = EmployeeState & EmployeeActions

// Initial State
const initialState: EmployeeState = {
  employees: [],
  bookmarkedIds: new Set(),
  loading: false,
  error: null,
  filters: {},
  searchTerm: '',
  selectedDepartment: null,
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1,
}

// Create the Employee Store
export const useEmployeeStore = create<EmployeeStore>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      ...initialState,
      
      // Data Management Actions
      setEmployees: (employees) =>
        set((state) => {
          state.employees = employees
        }),
      
      addEmployee: (employee) =>
        set((state) => {
          state.employees.push(employee)
        }),
      
      updateEmployee: (id, updates) =>
        set((state) => {
          const index = state.employees.findIndex((emp: Employee) => emp.id === id)
          if (index !== -1) {
            state.employees[index] = { ...state.employees[index], ...updates }
          }
        }),
      
      removeEmployee: (id) =>
        set((state) => {
          state.employees = state.employees.filter((emp: Employee) => emp.id !== id)
          state.bookmarkedIds.delete(id)
        }),
      
      // Bookmark Management Actions
      toggleBookmark: (employeeId) =>
        set((state) => {
          if (state.bookmarkedIds.has(employeeId)) {
            state.bookmarkedIds.delete(employeeId)
          } else {
            state.bookmarkedIds.add(employeeId)
          }
        }),
      
      setBookmarkedIds: (ids) =>
        set((state) => {
          state.bookmarkedIds = new Set(ids)
        }),
      
      clearBookmarks: () =>
        set((state) => {
          state.bookmarkedIds.clear()
        }),
      
      // Loading State Actions
      setLoading: (loading) =>
        set((state) => {
          state.loading = loading
        }),
      
      setError: (error) =>
        set((state) => {
          state.error = error
        }),
      
      // Filter Management Actions
      setFilters: (filters) =>
        set((state) => {
          state.filters = { ...state.filters, ...filters }
          state.currentPage = 1 // Reset to first page when filters change
        }),
      
      resetFilters: () =>
        set((state) => {
          state.filters = {}
          state.searchTerm = ''
          state.selectedDepartment = null
          state.currentPage = 1
        }),
      
      setSearchTerm: (searchTerm) =>
        set((state) => {
          state.searchTerm = searchTerm
          state.currentPage = 1
        }),
      
      setSelectedDepartment: (department) =>
        set((state) => {
          state.selectedDepartment = department
          state.currentPage = 1
        }),
      
      // Pagination Actions
      setCurrentPage: (currentPage) =>
        set((state) => {
          state.currentPage = currentPage
        }),
      
      setItemsPerPage: (itemsPerPage) =>
        set((state) => {
          state.itemsPerPage = itemsPerPage
          state.currentPage = 1
        }),
      
      setTotalPages: (totalPages) =>
        set((state) => {
          state.totalPages = totalPages
        }),
      
      // Computed Actions
      getBookmarkedEmployees: () => {
        const { employees, bookmarkedIds } = get()
        return employees.filter(emp => bookmarkedIds.has(emp.id))
      },
      
      getFilteredEmployees: () => {
        const { employees, filters, searchTerm, selectedDepartment } = get()
        let filtered = [...employees]
        
        // Apply search term filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase()
          filtered = filtered.filter(emp => 
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
            emp.email.toLowerCase().includes(term) ||
            emp.department.toLowerCase().includes(term)
          )
        }
        
        // Apply department filter
        if (selectedDepartment) {
          filtered = filtered.filter(emp => emp.department === selectedDepartment)
        }
        
        // Apply other filters
        if (filters.departments?.length) {
          filtered = filtered.filter(emp => filters.departments!.includes(emp.department))
        }
        
        if (filters.performanceRating?.length) {
          filtered = filtered.filter(emp => filters.performanceRating!.includes(emp.performanceRating))
        }
        
        if (filters.status?.length) {
          filtered = filtered.filter(emp => filters.status!.includes(emp.status))
        }
        
        if (filters.salaryRange) {
          filtered = filtered.filter(emp => 
            emp.salary >= filters.salaryRange!.min && emp.salary <= filters.salaryRange!.max
          )
        }
        
        return filtered
      },
      
      getEmployeeById: (id) => {
        const { employees } = get()
        return employees.find(emp => emp.id === id)
      },
    })),
    {
      name: 'employee-store',
    }
  )
) 