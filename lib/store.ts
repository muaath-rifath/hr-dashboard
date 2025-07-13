import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Employee, Department, PerformanceRating } from '@/types'
import { fetchEmployees, fetchEmployeeById } from '@/lib/api'

interface EmployeeState {
  // Data
  employees: Employee[]
  bookmarkedIds: Set<string>
  
  // UI State
  loading: boolean
  error: string | null
  
  // Search and Filters
  searchTerm: string
  selectedDepartment: Department | null
  selectedPerformanceRating: PerformanceRating | null
  
  // Pagination
  currentPage: number
  itemsPerPage: number
  totalEmployees: number
}

interface EmployeeActions {
  // Data actions
  setEmployees: (employees: Employee[]) => void
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  removeEmployee: (id: string) => void
  
  // Bookmark actions
  toggleBookmark: (employeeId: string) => void
  clearBookmarks: () => void
  
  // UI state actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Search and filter actions
  setSearchTerm: (term: string) => void
  setSelectedDepartment: (department: Department | null) => void
  setSelectedPerformanceRating: (rating: PerformanceRating | null) => void
  clearFilters: () => void
  
  // Pagination actions
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  setTotalEmployees: (total: number) => void
  
  // Computed getters
  getBookmarkedEmployees: () => Employee[]
  getFilteredEmployees: () => Employee[]
  
  // API actions
  fetchEmployeesData: () => Promise<void>
  fetchEmployeeById: (id: string) => Promise<Employee>
}

type EmployeeStore = EmployeeState & EmployeeActions

const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      employees: [],
      bookmarkedIds: new Set(),
      loading: false,
      error: null,
      searchTerm: '',
      selectedDepartment: null,
      selectedPerformanceRating: null,
      currentPage: 1,
      itemsPerPage: 12,
      totalEmployees: 0,
      
      // Data actions
      setEmployees: (employees) => set({ employees }),
      
      addEmployee: (employee) => 
        set((state) => ({ 
          employees: [...state.employees, employee] 
        })),
      
      updateEmployee: (id, updates) =>
        set((state) => ({
          employees: state.employees.map(emp => 
            emp.id === id ? { ...emp, ...updates } : emp
          )
        })),
      
      removeEmployee: (id) =>
        set((state) => {
          const newBookmarkedIds = new Set(state.bookmarkedIds)
          newBookmarkedIds.delete(id)
          return {
            employees: state.employees.filter(emp => emp.id !== id),
            bookmarkedIds: newBookmarkedIds
          }
        }),
      
      // Bookmark actions
      toggleBookmark: (employeeId) =>
        set((state) => {
          const newBookmarkedIds = new Set(state.bookmarkedIds)
          if (newBookmarkedIds.has(employeeId)) {
            newBookmarkedIds.delete(employeeId)
          } else {
            newBookmarkedIds.add(employeeId)
          }
          return { bookmarkedIds: newBookmarkedIds }
        }),
      
      clearBookmarks: () => set({ bookmarkedIds: new Set() }),
      
      // UI state actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Search and filter actions
      setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
      setSelectedDepartment: (selectedDepartment) => set({ selectedDepartment, currentPage: 1 }),
      setSelectedPerformanceRating: (selectedPerformanceRating) => set({ selectedPerformanceRating, currentPage: 1 }),
      clearFilters: () => set({ searchTerm: '', selectedDepartment: null, selectedPerformanceRating: null, currentPage: 1 }),
      
      // Pagination actions
      setCurrentPage: (currentPage) => set({ currentPage }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
      setTotalEmployees: (totalEmployees) => set({ totalEmployees }),
      
      // Computed getters
      getBookmarkedEmployees: () => {
        const { employees, bookmarkedIds } = get()
        return employees.filter(emp => bookmarkedIds.has(emp.id))
      },
      
      getFilteredEmployees: () => {
        const { employees, searchTerm, selectedDepartment, selectedPerformanceRating } = get()
        let filtered = employees
        
        // Apply search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase()
          filtered = filtered.filter(emp => 
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
            emp.email.toLowerCase().includes(term) ||
            emp.department.toLowerCase().includes(term) ||
            emp.skills.some(skill => skill.toLowerCase().includes(term))
          )
        }
        
        // Apply department filter
        if (selectedDepartment) {
          filtered = filtered.filter(emp => emp.department === selectedDepartment)
        }
        
        // Apply performance rating filter
        if (selectedPerformanceRating) {
          filtered = filtered.filter(emp => emp.performanceRating === selectedPerformanceRating)
        }
        
        return filtered
      },
      
      // API actions
      fetchEmployeesData: async () => {
        const { setLoading, setError, setEmployees, setTotalEmployees } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          // Force fetch 20 employees regardless of pagination
          const result = await fetchEmployees(1, 20)
          
          setEmployees(result.employees)
          setTotalEmployees(result.total)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employees'
          setError(errorMessage)
        } finally {
          setLoading(false)
        }
      },
      
      // Fetch single employee by ID
      fetchEmployeeById: async (id: string) => {
        try {
          const employee = await fetchEmployeeById(id)
          return employee
        } catch (error) {
          console.error('Error fetching employee by ID:', error)
          throw error
        }
      }
    }),
    {
      name: 'employee-store-fresh', // Completely new cache name
      partialize: (state) => ({
        bookmarkedIds: Array.from(state.bookmarkedIds), // Convert Set to Array for serialization
        searchTerm: state.searchTerm,
        selectedDepartment: state.selectedDepartment,
        selectedPerformanceRating: state.selectedPerformanceRating,
        itemsPerPage: state.itemsPerPage
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState || {}),
        bookmarkedIds: new Set(
          Array.isArray((persistedState as Record<string, unknown>)?.bookmarkedIds) 
            ? (persistedState as Record<string, unknown>).bookmarkedIds as string[]
            : []
        ),
      }),
    }
  )
)

export { useEmployeeStore }
