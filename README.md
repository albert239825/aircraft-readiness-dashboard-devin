# Air Fleet Readiness Dashboard

A fictional demo application for U.S. Air Force maintenance tracking. **This is purely synthetic demo data** with non-realistic identifiers (DEMO-###) for demonstration purposes only.

## Technology Stack

**Frontend:**
- Angular 14 with TypeScript
- Angular Material UI
- Reactive Forms with validation
- Route guards and HTTP interceptors

**Backend:**
- Node.js 16 + Express
- In-memory storage with deterministic seed data
- JWT-like authentication (demo only)

## Prerequisites

- **Node.js 16 LTS** (required)
- npm (comes with Node.js)

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd aircraft-readiness-dashboard-devin
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm ci
```

## Running the Application

You'll need **two terminal windows** to run both backend and frontend.

### Terminal 1: Start Backend Server

```bash
cd backend
npm start
```

The backend server will run on **http://localhost:3000**

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on **http://localhost:4200**

> **Note**: The frontend uses a proxy configuration (`proxy.conf.json`) to forward all `/api/*` requests to the backend on `http://localhost:3000`. This allows the Angular dev server (port 4200) to communicate with the Express backend (port 3000) without CORS issues.

## Demo Login Credentials

- **Viewer** (limited access):
  - Username: `viewer`
  - Password: `pass`
  - Access: Can view aircraft list but **cannot** access work orders

- **Maintainer** (create/edit work orders):
  - Username: `maintainer`
  - Password: `pass`
  - Access: Can view aircraft and manage work orders

- **Admin** (full access):
  - Username: `admin`
  - Password: `pass`
  - Access: Full access to all features

## Available Scripts (Frontend)

### Development
```bash
npm start         # Start development server on port 4200
```

### Testing
```bash
npm run test      # Run unit tests with Karma
npm run lint      # Run ESLint
```

### Production
```bash
npm run build     # Build for production (output in dist/)
```

## Project Structure

```
/
├── backend/              # Express REST API
│   ├── server.js        # Main server file with routes and seed data
│   └── package.json     # Backend dependencies
│
├── frontend/            # Angular 14 application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # UI components (login, aircraft, work orders)
│   │   │   ├── guards/       # Route guards (auth, role-based)
│   │   │   ├── interceptors/ # HTTP interceptor for auth tokens
│   │   │   ├── models/       # TypeScript interfaces
│   │   │   └── services/     # API and auth services
│   │   └── ...
│   └── package.json     # Frontend dependencies
│
├── .github/
│   └── workflows/
│       └── ci.yml       # GitHub Actions CI workflow
│
└── README.md            # This file
```

## Features

### 1. Authentication & Authorization
- Hardcoded demo users with different role levels
- JWT-like token stored in localStorage
- HTTP interceptor adds auth header to API requests
- Route guards protect pages based on authentication and roles

### 2. Aircraft Management (`/aircraft`)
- Material table with search, sort, and pagination
- Row click opens detailed dialog showing:
  - Aircraft information
  - Associated work orders
- **Accessible to:** All authenticated users

### 3. Work Orders Management (`/work-orders`)
- Create and edit work orders using reactive forms
- Field validation (required, minLength)
- Priority levels: LOW, MED, HIGH
- Status workflow: Draft → Submitted → Approved
- **Accessible to:** Maintainer and Admin roles only

## API Endpoints

Backend provides the following REST endpoints:

```
GET    /api/aircraft           # List all aircraft
GET    /api/aircraft/:id       # Get aircraft details with work orders
GET    /api/work-orders        # List all work orders
POST   /api/work-orders        # Create new work order
PUT    /api/work-orders/:id    # Update existing work order
```

All `/api/*` endpoints require `Authorization: Bearer <token>` header.

## CI/CD

### GitHub Actions Workflow

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on push/PR:

1. **Lint** - ESLint checks
2. **Test** - Karma unit tests with code coverage
3. **Build** - Production build verification

```bash
# Workflow runs:
cd frontend
npm ci
npm run lint
npm run test -- --no-watch --code-coverage --browsers=ChromeHeadless
npm run build -- --configuration production
```

## Unit Tests

The project includes minimal but meaningful unit tests:

### 1. RoleGuard Tests
- ✅ Blocks viewers from `/work-orders` route
- ✅ Allows maintainer/admin access
- ✅ Redirects unauthenticated users to login

### 2. AircraftService Tests
- ✅ Retrieves aircraft list from API
- ✅ Handles HTTP errors gracefully
- ✅ Fetches aircraft details by ID

Run tests:
```bash
cd frontend
npm run test
```

## Development Notes

- **Node Version:** This project requires Node.js 16 LTS. Using other versions may cause compatibility issues.
- **Demo Data:** All data is synthetic and reset on backend restart.
- **Authentication:** Token validation is simplified for demo purposes; not production-ready.
- **Browser Support:** Tested on modern browsers (Chrome, Firefox, Edge, Safari).

## Troubleshooting

**Port already in use:**
```bash
# Backend (port 3000)
lsof -ti:3000 | xargs kill -9

# Frontend (port 4200)
lsof -ti:4200 | xargs kill -9
```

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## License

This is a demonstration project created for internal training purposes.
