# Ekaloka - Enterprise E-commerce Platform

A modern e-commerce platform built with Next.js, React, and .NET backend.

## Features

### Core Features
- Authentication & Authorization
- User Management
- Product Management
- Shopping Cart
- Order Management
- Payment Integration
- Admin Dashboard

### Frontend Stack
- Next.js 15
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Query
- React Hook Form + Zod

### Backend Stack
- .NET 8
- PostgreSQL with Prisma ORM
- Redis caching
- JWT authentication
- Cloudinary file storage
- Stripe payments

## Project Status

This repository is kept as a GitHub source-code project only.

No hosting provider configuration is included in this repository.
No CI/CD workflow is configured in this repository.

## Project Structure

```text
src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
└── config/
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Redis 6+
- .NET 8 SDK

### 1. Clone the Repository

```bash
git clone https://github.com/dihaxn/Ekaloka.git
cd Ekaloka
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
cp env.example .env.local
```

Update `.env.local` with your local configuration.

### 4. Database Setup

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Useful Commands

```bash
npm run build
npm run lint
npm run typecheck
npm test
```

## Notes

Deployment and CI/CD are intentionally not configured. The project is maintained only as source code in GitHub.

---

Built with ❤️ by the Ekaloka Team
