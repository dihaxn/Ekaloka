# Deployment Guide

This guide will walk you through deploying the Ekaloka application to Vercel and setting up Supabase for the database.

## 🚀 Prerequisites

- GitHub account with your code repository
- Vercel account (free tier available)
- Supabase account (free tier available)

## 📦 Vercel Deployment

### 1. Connect Your Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and click "Import"

### 2. Configure Project Settings

1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: `apps/frontend` (since this is a monorepo)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### 3. Environment Variables

Add these environment variables in the Vercel dashboard:

```env
# Database
DATABASE_URL=your_supabase_connection_string

# JWT Secrets (generate secure random strings)
JWT_ACCESS_SECRET=your_64_character_random_string_here
JWT_REFRESH_SECRET=your_64_character_random_string_here

# API URL (your Vercel domain)
NEXT_PUBLIC_API_URL=https://your-app.vercel.app

# Environment
NODE_ENV=production
```

**Important**: Generate secure JWT secrets:
```bash
# Generate 64-character random strings
openssl rand -hex 32
```

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-app.vercel.app`

## 🗄️ Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `ekaloka-db` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Database Connection String

1. Go to **Settings** → **Database**
2. Copy the connection string
3. Replace `<PASSWORD>` with your database password
4. Update your Vercel environment variables

### 3. Run Database Migrations

1. Clone your repository locally
2. Install dependencies: `npm install`
3. Set up your `.env` file with the Supabase connection string
4. Run migrations:

```bash
cd apps/frontend

# Generate Prisma client
npm run prisma:generate

# Push schema to database (for new projects)
npm run prisma:push

# Or run migrations (if you have migration files)
npm run prisma:migrate

# Seed the database
npm run prisma:seed
```

### 4. Verify Database Setup

1. Go to **Table Editor** in Supabase
2. Verify that `users` and `products` tables exist
3. Check that sample data was inserted

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

In Supabase dashboard:
1. Go to **Settings** → **API**
2. Add your Vercel domain to allowed origins
3. Save changes

### 2. Test Your API Endpoints

Test the deployed endpoints:

```bash
# Test products endpoint
curl https://your-app.vercel.app/api/products

# Test auth endpoint (should return method not allowed for GET)
curl https://your-app.vercel.app/api/auth/login
```

### 3. Monitor Performance

1. Check Vercel Analytics
2. Monitor Supabase database usage
3. Set up error tracking (optional)

## 🚨 Troubleshooting

### Common Issues

#### Build Failures

1. **TypeScript Errors**: Run `npm run typecheck` locally first
2. **Missing Dependencies**: Ensure all dependencies are in `package.json`
3. **Environment Variables**: Verify all required env vars are set in Vercel

#### Database Connection Issues

1. **Connection String**: Verify DATABASE_URL format
2. **IP Restrictions**: Check if Supabase has IP restrictions
3. **SSL**: Ensure SSL is enabled in connection string

#### Runtime Errors

1. **JWT Secrets**: Verify JWT secrets are set and secure
2. **CORS**: Check Supabase CORS settings
3. **Permissions**: Verify database user has proper permissions

### Debug Commands

```bash
# Check build locally
npm run build

# Test database connection
npx prisma db pull

# Verify environment variables
echo $DATABASE_URL
echo $JWT_ACCESS_SECRET
```

## 🔄 Continuous Deployment

### GitHub Actions Integration

1. Push to `main` branch triggers automatic deployment
2. Pull requests create preview deployments
3. Monitor CI/CD pipeline in GitHub Actions

### Environment Management

- **Development**: Local environment
- **Staging**: Vercel preview deployments
- **Production**: Vercel production deployment

## 📊 Monitoring and Maintenance

### 1. Performance Monitoring

- Vercel Analytics
- Supabase Database Insights
- Error tracking (optional)

### 2. Regular Maintenance

- Update dependencies monthly
- Monitor database usage
- Review and rotate JWT secrets quarterly

### 3. Backup Strategy

- Supabase provides automatic backups
- Consider additional backup solutions for critical data

## 🎯 Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
2. **Configure monitoring and alerts**
3. **Set up staging environment**
4. **Implement CI/CD pipeline**
5. **Add error tracking** (Sentry, LogRocket, etc.)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

## 🆘 Support

If you encounter issues:

1. Check Vercel build logs
2. Review Supabase database logs
3. Test locally with production environment variables
4. Check GitHub Issues for similar problems
5. Reach out to the community or support channels
