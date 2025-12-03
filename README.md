# Ekaloka - Enterprise E-commerce Platform

A modern, scalable e-commerce platform built with Next.js, React, and .NET backend, featuring enterprise-grade security, performance, and maintainability.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: JWT-based auth with MFA/2FA support
- **User Management**: Role-based access control (RBAC)
- **Product Management**: Full CRUD operations with image handling
- **Shopping Cart**: Persistent cart with real-time updates
- **Order Management**: Complete order lifecycle
- **Payment Integration**: Stripe payment processing
- **Admin Dashboard**: Comprehensive admin interface

### Enterprise Features
- **Security**: CSRF protection, rate limiting, input validation
- **Performance**: Redis caching, React Query, optimized images
- **Scalability**: Serverless-ready, horizontal scaling support
- **Monitoring**: Comprehensive logging and error tracking
- **Testing**: Unit, integration, and E2E test coverage
- **Accessibility**: WCAG 2.1 AA compliant

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Redux Persist
- **Data Fetching**: React Query (TanStack Query)
- **UI Components**: Radix UI + Custom components
- **Forms**: React Hook Form + Zod validation

### Backend Stack
- **Framework**: .NET 8
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis/Upstash Redis
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary
- **Payment**: Stripe
- **Email**: SMTP with templates

### Infrastructure
- **Deployment**: Vercel (Frontend) + Azure/AWS (Backend)
- **Database**: PostgreSQL (Supabase/AWS RDS)
- **Caching**: Redis (Upstash/AWS ElastiCache)
- **CDN**: Vercel Edge Network
- **Monitoring**: Sentry + Logtail
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group routes
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── settings/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── user/
│   │   └── telemetry/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Shared UI components
│   ├── ui/                      # Base UI components
│   ├── forms/                   # Form components
│   ├── layout/                  # Layout components
│   └── providers/               # Context providers
├── features/                    # Feature-based modules
│   ├── auth/                    # Authentication feature
│   ├── users/                   # User management
│   ├── products/                # Product management
│   └── orders/                  # Order management
├── hooks/                       # Custom React hooks
├── lib/                         # Core utilities
│   ├── auth.ts                  # Authentication utilities
│   ├── cache.ts                 # Caching system
│   ├── csrf.ts                  # CSRF utilities
│   ├── db.ts                    # Database utilities
│   ├── validators.ts            # Validation schemas
│   └── utils.ts                 # General utilities
├── services/                    # API services
├── store/                       # State management
├── types/                       # TypeScript types
└── config/                      # Configuration files
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm 9+
- PostgreSQL 14+
- Redis 6+
- .NET 8 SDK

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/ekaloka.git
cd ekaloka
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp env.example .env.local
```

Update `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ekaloka_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Redis
REDIS_URL="redis://localhost:6379"
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# External Services
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

### Test Coverage
- Unit Tests: Jest + React Testing Library
- Integration Tests: API route testing
- E2E Tests: Playwright
- Coverage Target: >80%

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (.NET)
1. Build the .NET application
2. Deploy to Azure App Service or AWS ECS
3. Configure environment variables
4. Set up database and Redis connections

### Database
1. Set up PostgreSQL instance (Supabase/AWS RDS)
2. Run migrations: `npm run prisma:migrate`
3. Seed initial data: `npm run prisma:seed`

### Redis
1. Set up Redis instance (Upstash/AWS ElastiCache)
2. Configure connection strings
3. Test cache connectivity

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck
```

### Git Hooks
The project uses Husky for pre-commit hooks:
- Lint staged files
- Format code
- Run type checking
- Run tests

### Branching Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

## 📊 Performance

### Optimization Features
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Redis + React Query caching
- **Bundle Analysis**: Webpack bundle analyzer
- **Lighthouse Score**: >90 in all categories

### Monitoring
- **Performance**: Vercel Analytics
- **Errors**: Sentry error tracking
- **Logs**: Logtail structured logging
- **Uptime**: Status page monitoring

## 🔒 Security

### Security Features
- **CSRF Protection**: Token-based CSRF protection
- **Rate Limiting**: Per-user and per-IP limits
- **Input Validation**: Zod schema validation
- **XSS Prevention**: Content Security Policy
- **SQL Injection**: Parameterized queries
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control

### Security Headers
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Strict Transport Security

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/mfa/verify` - MFA verification

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/orders` - Get user orders
- `PUT /api/user/preferences` - Update preferences

### Product Endpoints
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Order Endpoints
- `GET /api/orders` - List orders
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/[id]` - Update order status

## 🆘 Support

### Getting Help
- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: support@ekaloka.com

### Common Issues
- **Database Connection**: Check DATABASE_URL in .env.local
- **Redis Connection**: Verify REDIS_URL configuration
- **Build Errors**: Clear .next folder and node_modules
- **Type Errors**: Run `npm run typecheck`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Prisma team for the excellent ORM
- Radix UI for accessible components
- Tailwind CSS for utility-first styling

---

**Built with ❤️ by the Ekaloka Team**
