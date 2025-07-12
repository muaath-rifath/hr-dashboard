# Backend API Integration Guide

This HR Dashboard frontend is designed to work with both a real backend API and the DummyJSON API as a fallback. Here's how to connect it to your backend.

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_MAX_RETRIES=3
```

### 2. Backend API Endpoints

Your backend should implement the following endpoints:

#### Employee Endpoints
- `GET /api/employees` - List employees with pagination and filtering
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

#### Department Endpoints
- `GET /api/departments` - List all departments

#### Dashboard Endpoints
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data

#### Bookmark Endpoints
- `POST /api/bookmarks/employees/:id` - Toggle employee bookmark

#### Health Check
- `GET /api/health` - Health check endpoint

### 3. API Response Formats

#### Employee List Response
```json
{
  "data": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
      "age": 32,
      "department": "Engineering",
      "phone": "+1 (555) 123-4567",
      "address": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94105",
        "country": "USA"
      },
      "bio": "John Doe is an Engineering professional with 5 years of experience.",
      "performanceRating": 4,
      "hireDate": "2020-01-15",
      "salary": 85000,
      "status": "active",
      "avatar": "https://example.com/avatar.jpg",
      "skills": ["JavaScript", "React", "Node.js"],
      "managerId": "2"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

#### Single Employee Response
```json
{
  "id": "1",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "age": 32,
  "department": "Engineering",
  "phone": "+1 (555) 123-4567",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "USA"
  },
  "bio": "John Doe is an Engineering professional with 5 years of experience.",
  "performanceRating": 4,
  "projectHistory": [
    {
      "id": "1",
      "name": "HR Dashboard",
      "description": "Modern HR management system",
      "startDate": "2023-01-01",
      "endDate": "2023-06-30",
      "status": "completed",
      "role": "Lead Developer"
    }
  ],
  "feedback": [
    {
      "id": "1",
      "reviewerId": "2",
      "reviewerName": "Jane Smith",
      "rating": 4,
      "comment": "Excellent work on the dashboard project",
      "date": "2023-07-01",
      "category": "performance"
    }
  ],
  "hireDate": "2020-01-15",
  "salary": 85000,
  "status": "active",
  "avatar": "https://example.com/avatar.jpg",
  "skills": ["JavaScript", "React", "Node.js"],
  "certifications": [
    {
      "id": "1",
      "name": "AWS Certified Developer",
      "issuer": "Amazon Web Services",
      "issueDate": "2022-06-15",
      "expiryDate": "2025-06-15"
    }
  ],
  "emergencyContact": {
    "name": "John Doe Sr.",
    "relationship": "Parent",
    "phone": "+1 (555) 987-6543",
    "email": "john.sr@example.com"
  }
}
```

#### Dashboard Stats Response
```json
{
  "totalEmployees": 150,
  "activeEmployees": 142,
  "departments": 8,
  "pendingRequests": 12,
  "averageSalary": 75000,
  "topDepartments": [
    { "name": "Engineering", "count": 45 },
    { "name": "Sales", "count": 32 },
    { "name": "Marketing", "count": 28 }
  ]
}
```

### 4. Query Parameters

#### Employee List Endpoint
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term for name, email, or department
- `department` (string): Filter by department

Example: `GET /api/employees?page=1&limit=20&search=john&department=Engineering`

### 5. Error Handling

The frontend expects proper HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses should include a message:
```json
{
  "error": "Employee not found",
  "message": "The requested employee does not exist",
  "status": 404
}
```

## Features

### Automatic Fallback
If the backend API is not available, the frontend automatically falls back to the DummyJSON API to ensure the application continues to work.

### API Status Indicator
The header includes an API status indicator that shows:
- ✅ Backend Connected (green)
- ⚠️ Using DummyJSON (yellow)
- ❌ API Error (red)
- 🔄 Checking API (blue, spinning)

### Configuration Options
You can control API behavior through environment variables:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_API_TIMEOUT` - Request timeout (ms)
- `NEXT_PUBLIC_API_MAX_RETRIES` - Retry attempts

## Development

### Testing Backend Connection
1. Start your backend server
2. Set the `NEXT_PUBLIC_API_BASE_URL` environment variable
3. Restart the Next.js development server
4. Check the API status indicator in the header

### Disabling Backend API
To use only DummyJSON API, set in `lib/config.ts`:
```typescript
FEATURES: {
  ENABLE_BACKEND_API: false,
  ENABLE_DUMMY_JSON_FALLBACK: true,
}
```

### Custom Backend Integration
To integrate with a different backend structure, modify the API functions in `lib/api.ts` to match your backend's response format and endpoints. 