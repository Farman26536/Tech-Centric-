# TeamFlow - Project Management Application

## 🎯 Overview

TeamFlow is a full-stack project management application built with **TypeScript**, **Express.js**, **React**, **Prisma**, and **PostgreSQL**. It provides comprehensive task management, user management, and project tracking capabilities.

## 🏗️ Project Structure

```
tech-centric-/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── api/                    # API client services
│   │   │   ├── users.api.ts
│   │   │   ├── projects.api.ts
│   │   │   └── ...
│   │   ├── components/             # Reusable React components
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectForm.tsx
│   │   │   │   └── ProjectProgress.tsx
│   │   │   ├── users/
│   │   │   │   └── UserCard.tsx
│   │   │   └── ...
│   │   ├── types/                  # TypeScript type definitions
│   │   │   ├── user.types.ts
│   │   │   ├── project.types.ts
│   │   │   └── ...
│   │   ├── contexts/               # React context providers
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server/                          # Express.js backend
│   ├── src/
│   │   ├── controllers/            # Request handlers
│   │   │   ├── user.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   └── ...
│   │   ├── services/               # Business logic
│   │   │   ├── user.service.ts
│   │   │   ├── project.service.ts
│   │   │   └── ...
│   │   ├── routes/                 # API route definitions
│   │   │   ├── user.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   └── ...
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── ...
│   │   ├── utils/                  # Utility functions
│   │   │   ├── apiResponse.ts
│   │   │   ├── httpError.ts
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   └── prisma.ts
│   │   ├── config/                 # Configuration files
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   └── package.json
│
├── package.json                     # Root package.json
├── vercel.json                      # Vercel deployment config
├── .vercelignore                    # Vercel ignore patterns
└── README.md
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (authenticated)

### Users
- `GET /api/users` - List all users (paginated, searchable)
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/role` - Change user role (ADMIN only)

### Projects
- `GET /api/projects` - List all projects (paginated, searchable)
- `POST /api/projects` - Create new project (ADMIN only)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (ADMIN only)
- `DELETE /api/projects/:id` - Delete project (ADMIN only)

## 🔐 Authentication & Authorization

### Authentication Flow
1. Users register/login with email and password
2. Server returns JWT token in HTTP-only cookie
3. Client sends token in subsequent requests
4. Middleware validates token and extracts user info

### Role-Based Access Control
- **ADMIN**: Full access to all resources, can manage users and projects
- **MEMBER**: Can view assigned tasks, update task status, view their profile

### Protected Routes
- All API endpoints require authentication
- Some endpoints require admin role
- Users can only modify their own data (except admins)

## 🗄️ Database Schema

### User
```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     // ADMIN | MEMBER
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Project
```prisma
model Project {
  id          String   @id @default(uuid())
  title       String
  description String?
  deadline    DateTime?
  status      String   // ACTIVE | ON_HOLD | COMPLETED | ARCHIVED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tasks       Task[]
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Farman26536/Tech-Centric-.git
   cd Tech-Centric-
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup environment variables**
   
   Create `.env` in server directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/teamflow"
   JWT_SECRET="your-secret-key-min-32-chars"
   JWT_EXPIRES_IN="7d"
   CLIENT_URL="http://localhost:5173"
   NODE_ENV="development"
   PORT=5000
   ```

4. **Setup database**
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both server (port 5000) and client (port 5173) concurrently.

## 🛠️ Available Scripts

### Root
```bash
npm run dev              # Start both server and client
npm run build            # Build both server and client
npm run start            # Start server in production
npm run install:all      # Install all dependencies
```

### Server
```bash
cd server
npm run dev              # Start with hot reload (tsx watch)
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with initial data
```

### Client
```bash
cd client
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Check TypeScript
```

## 📦 Key Dependencies

### Server
- **express** - Web framework
- **@prisma/client** - ORM for database
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **zod** - Schema validation
- **cors** - Cross-origin requests
- **helmet** - Security headers
- **morgan** - HTTP logging

### Client
- **react** - UI library
- **react-router-dom** - Client-side routing
- **@tanstack/react-query** - Server state management
- **axios** - HTTP client
- **react-hot-toast** - Toast notifications
- **tailwindcss** - Utility-first CSS
- **zod** - Schema validation
- **react-hook-form** - Form state management

## 🌐 Deployment

### Vercel Deployment

The project is configured for Vercel deployment:

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Push to main branch** - automatic deployment

Key configuration files:
- `vercel.json` - Build and deployment settings
- `.vercelignore` - Files to ignore during deployment

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ HTTP-only secure cookies
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation with Zod
- ✅ Role-based access control
- ✅ Rate limiting ready

## 📝 Error Handling

The application includes comprehensive error handling:
- Zod validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Database constraint errors (409)
- Server errors (500)

## 🎨 UI Components

### ProjectCard
Displays project information with status, deadline, and task count.

### ProjectForm
Form for creating and editing projects with validation.

### ProjectProgress
Visual progress indicator for project completion.

### UserCard
Displays user information with role and admin actions.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Push to the branch
4. Create a pull request

## 📄 License

This project is private and maintained by Farman26536.

## 🆘 Support

For issues or questions, please open a GitHub issue.

---

**Last Updated**: August 21, 2026
