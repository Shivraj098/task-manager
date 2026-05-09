# TaskFlow — Realtime Team Task Management Platform

TaskFlow is a modern full-stack collaborative task management platform built with Next.js, TypeScript, Prisma, PostgreSQL, and realtime synchronization.

The application supports:
- team collaboration
- project management
- task assignment
- realtime updates
- role-based permissions
- task lifecycle workflows
- protected APIs
- production-grade architecture
- automated testing

Built as a production-focused SaaS-style application with scalable backend architecture, polished frontend UX, and deployment-ready infrastructure.

---

# Live Demo

## Production URL
[Add Your Deployment URL Here]

---

# Features

## Authentication & Authorization
- Secure credential-based authentication
- Session management with NextAuth
- Protected routes and APIs
- Role-based access control (RBAC)
- Admin/member permission separation

---

## Project Management
- Create projects
- Add team members
- Admin-controlled project access
- Isolated project visibility
- Realtime project synchronization

---

## Task Management
- Create tasks
- Assign tasks to members
- Task descriptions and priorities
- Task lifecycle enforcement:
  - PENDING
  - IN_PROGRESS
  - DONE
- Due date support
- Realtime task updates

---

## Dashboard System
- Personalized dashboard
- Task statistics
- Status breakdown
- Project ownership visibility
- Member-specific task tracking

---

## Realtime Collaboration
- Instant task updates
- Dashboard synchronization
- Project synchronization
- Multi-user realtime communication using Pusher

---

## UI/UX Features
- Modern SaaS-style interface
- Responsive layouts
- Loading skeletons
- Toast notifications
- Confirmation modals
- Empty states
- Hover interactions
- Smooth transitions
- Error boundaries
- Accessible UI patterns

---

## Backend Architecture
- Service layer architecture
- Controller separation
- Reusable validation schemas
- Centralized error handling
- Transaction-safe operations
- Typed API responses
- Environment validation
- Scalable folder structure

---

## Testing
- Service layer tests
- API route tests
- Component tests
- End-to-end testing with Playwright
- RBAC testing
- Lifecycle validation tests

---

# Tech Stack

## Frontend
- Next.js App Router
- React
- TypeScript
- Tailwind CSS

---

## Backend
- Next.js Route Handlers
- Prisma ORM
- PostgreSQL
- NextAuth
- Zod Validation

---

## Realtime
- Pusher Channels

---

## Testing
- Vitest
- Testing Library
- Playwright

---

## Deployment
- Vercel
- Railway PostgreSQL

---

# Architecture Overview

The application follows a layered architecture pattern:

```text
UI Layer
↓
Hooks & API Client
↓
API Routes
↓
Controllers
↓
Services
↓
Prisma ORM
↓
PostgreSQL