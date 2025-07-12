/**
 * Application configuration
 */

export const CONFIG = {
  // API Configuration
  API: {
    // Backend API base URL - set this to your backend API URL
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
    
    // DummyJSON fallback URL
    DUMMY_JSON_URL: 'https://dummyjson.com',
    
    // Request timeout in milliseconds
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    
    // Maximum retry attempts
    MAX_RETRIES: parseInt(process.env.NEXT_PUBLIC_API_MAX_RETRIES || '3'),
  },
  
  // App Configuration
  APP: {
    NAME: 'HR Dashboard',
    VERSION: '1.0.0',
    DESCRIPTION: 'Modern HR Dashboard with Employee Management',
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },
  
  // Search configuration
  SEARCH: {
    DEBOUNCE_DELAY: 300,
    MIN_SEARCH_LENGTH: 2,
  },
  
  // Feature flags
  FEATURES: {
    ENABLE_BACKEND_API: false, // Disabled by default since no backend is running
    ENABLE_DUMMY_JSON_FALLBACK: true,
    ENABLE_OFFLINE_MODE: false,
  },
} as const

/**
 * Get API configuration with environment overrides
 */
export function getAPIConfig() {
  return {
    ...CONFIG.API,
    // Override with environment variables if present
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || CONFIG.API.BASE_URL,
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || CONFIG.API.TIMEOUT.toString()),
    MAX_RETRIES: parseInt(process.env.NEXT_PUBLIC_API_MAX_RETRIES || CONFIG.API.MAX_RETRIES.toString()),
  }
}

/**
 * Check if backend API is enabled
 */
export function isBackendEnabled(): boolean {
  return CONFIG.FEATURES.ENABLE_BACKEND_API
}

/**
 * Check if DummyJSON fallback is enabled
 */
export function isDummyJSONEnabled(): boolean {
  return CONFIG.FEATURES.ENABLE_DUMMY_JSON_FALLBACK
} 