# BrilliantClone Architecture

## System Overview

BrilliantClone is a full-stack learning platform with a React frontend and Node.js backend.

### Frontend Architecture

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature modules
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript definitions
│   └── store/          # State management
```

### State Management

- React Context for global state (auth, user)
- Local component state for UI
- Custom hooks for data fetching

### Routing

- React Router v6 for navigation
- Protected routes for authenticated pages
- Lazy loading for code splitting

### Styling

- Tailwind CSS for utility-first styling
- Custom theme configuration
- Responsive design mobile-first

## Backend Architecture

### API Structure

```
server/
├── routes/         # API endpoints
├── controllers/    # Request handlers
├── models/         # Data models
├── services/       # Business logic
└── middleware/     # Express middleware
```

### Database Schema

**Users Table:**
- id, email, username, password_hash
- display_name, avatar, created_at

**Problems Table:**
- id, title, description, difficulty
- type, category, hints, solution

**Progress Table:**
- user_id, problem_id, status
- attempts, time_spent, completed_at

### Authentication

- JWT tokens for session management
- Refresh token rotation
- Password hashing with bcrypt

## Data Flow

1. User interacts with UI component
2. Component calls custom hook
3. Hook makes API request
4. Controller validates and processes
5. Service executes business logic
6. Model interacts with database
7. Response flows back to component
8. UI updates with new state

## Performance Optimizations

- Code splitting by route
- Lazy loading of heavy components
- Memoization of expensive calculations
- Database query optimization
- Redis caching for frequent queries
- CDN for static assets

## Security Measures

- Input validation on client and server
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting on API endpoints
- Helmet.js for HTTP headers