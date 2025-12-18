# API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "jwt.token.here"
}
```

### POST /api/auth/login
Authenticate user and receive JWT token.

## Problem Endpoints

### GET /api/problems
Get list of problems with filtering.

**Query Parameters:**
- `category`: Filter by category
- `difficulty`: beginner | intermediate | advanced
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

### GET /api/problems/:id
Get specific problem details.

### POST /api/problems/:id/validate
Submit answer for validation.

**Request:**
```json
{
  "answer": "42"
}
```

## Progress Endpoints

### GET /api/progress/stats
Get user statistics and progress.

### POST /api/progress/complete
Mark problem as completed.

## Course Endpoints

### GET /api/courses
Get all available courses.

### GET /api/courses/:id
Get course details with chapters.