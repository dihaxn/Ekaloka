# Ekaloka - Full-Stack Next.js Application

A complete Next.js application with Prisma ORM, PostgreSQL database (Supabase), JWT authentication, and comprehensive testing setup.

## 🚀 Features

- **Next.js 15** with App Router and TypeScript
- **Prisma ORM** with PostgreSQL database
- **JWT Authentication** with access and refresh tokens
- **Supabase Integration** for managed PostgreSQL
- **Comprehensive Testing** with Jest and Playwright
- **CI/CD Pipeline** with GitHub Actions
- **Vercel Deployment** ready
- **Tailwind CSS** for styling

## 🏗️ Architecture

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and API client
├── services/           # Business logic and server services
├── server/             # Database and server utilities
├── styles/             # Global styles and CSS
└── types/              # TypeScript type definitions

pages/api/              # API routes (Pages Router)
├── auth/               # Authentication endpoints
└── products/           # Product management endpoints

prisma/                 # Database schema and migrations
tests/                  # Test files (unit + e2e)
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT with bcrypt password hashing
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel, GitHub Actions CI/CD

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL database (local or Supabase)
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ekaloka
npm install
```

### 2. Environment Setup

Copy the environment template and configure your variables:

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Edit `apps/frontend/.env` with your actual values:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db>

# JWT Configuration
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Environment
NODE_ENV=development
```

### 3. Database Setup

#### Option A: Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string
4. Update your `DATABASE_URL` in `.env`

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database
3. Update your `DATABASE_URL` in `.env`

### 4. Database Migration and Seeding

```bash
cd apps/frontend

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Type Checking

```bash
npm run typecheck
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure `DATABASE_URL` points to your production database

3. **Deploy**
   - Vercel will automatically build and deploy on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Products

- `GET /api/products` - List products (with pagination and search)

### Response Format

All API responses follow this format:

```json
{
  "ok": true,
  "data": { ... },
  "error": null
}
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run E2E tests
npm run typecheck        # TypeScript type checking

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio

# Linting
npm run lint             # Run ESLint
```

## 🗄️ Database Schema

### Users Table
- `id`: Unique identifier
- `uid`: User ID string
- `name`: User's full name
- `email`: Unique email address
- `passwordHash`: Bcrypt hashed password
- `role`: User role (user/admin)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Products Table
- `id`: Unique identifier
- `name`: Product name
- `price`: Product price
- `description`: Optional product description
- `createdAt`: Product creation timestamp
- `updatedAt`: Last update timestamp

## 🔐 Authentication Flow

1. **Login**: User provides email/password
2. **Validation**: Server validates credentials against database
3. **Tokens**: Server generates JWT access token (15min) and refresh token (30 days)
4. **Cookies**: Refresh token stored as HTTP-only secure cookie
5. **Authorization**: Access token used for API requests
6. **Refresh**: When access token expires, refresh token used to get new access token

## 🚨 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Refresh tokens stored securely
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for production use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Maintenance tasks

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Check the documentation and troubleshooting guides

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)ation/deploying) for more details.
