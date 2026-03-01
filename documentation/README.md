# Gran Kush Platform - Complete Documentation

## Overview

This documentation provides comprehensive information about the Gran Kush fullstack club administration platform. The documentation is organized by application and covers architecture, technical decisions, modules, and implementation details.

## Documentation Structure

### Core Documentation

- **[Backend Documentation](./backend/README.md)** - Complete backend API documentation
  - Architecture and design patterns
  - Module descriptions
  - Authentication system
  - Database schema
  - Queue system and scalability

- **[Site Documentation](./site/README.md)** - Public website and member portal
  - Next.js application structure
  - Frontend architecture (FSD)
  - Member registration flow
  - Portfolio (personal cabinet) features
  - Internationalization

- **[CRM Documentation](./crm/README.md)** - CRM system for employees
  - Employee management interface
  - Member management features
  - Email campaign system
  - Administrative tools

### Technical Documentation

- **[Authentication System](./AUTHENTICATION.md)** - Dual authentication architecture
  - Member authentication flow
  - Employee authentication flow
  - JWT token system
  - Security considerations

- **[Storage Module](./STORAGE.md)** - File storage system
  - Storage architecture
  - File upload and management
  - Document handling
  - Digital signatures

## Project Concept

### Fullstack Club Administration Platform

Gran Kush is a universal platform designed for managing clubs, their members, and employees. The system is built as a TypeScript/JavaScript monorepository and can be adapted for various types of clubs:

- Sports clubs
- Educational institutions
- Business communities
- Private associations
- Cannabis clubs (current implementation)

### System Components

The platform consists of three major parts:

1. **Public Website** (`apps/web`)
   - Attract new members
   - Present club information
   - Member registration
   - Multilingual content

2. **Member Portal (Portfolio)** (`apps/web` - authenticated routes)
   - Personal dashboard
   - Profile management
   - Application status tracking
   - Document management

3. **CRM System** (`apps/crm` - planned)
   - Employee dashboard
   - Member management
   - Email campaigns
   - Administrative tools

## Architecture Principles

### Monorepository Structure

The project is implemented as a monorepo, providing:

- **Shared Types**: TypeScript types shared between frontend and backend
- **Reusable DTOs**: Common data transfer objects
- **Centralized Dependencies**: Single source of truth for package versions
- **Simplified CI/CD**: Unified build and deployment processes
- **Code Reusability**: Shared utilities and configurations

### Technology Stack

#### Backend
- **NestJS 11** - Progressive Node.js framework
- **Prisma ORM** - Type-safe database access
- **MySQL 8.0** - Relational database
- **Redis** - Caching and session storage
- **Bull** - Queue system for async operations
- **JWT** - Token-based authentication

#### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TanStack Query** - Data fetching and state management
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library (Radix UI)
- **next-intl** - Internationalization

### Core System Modules

#### Backend Modules

1. **Users Module** - Base user authentication
2. **Members Module** - Club member management
3. **Employees Module** - Employee management
4. **Auth Module** - Authentication and authorization
5. **Storage Module** - File storage and management
6. **Mail Module** - Email sending and templates

#### Frontend Modules

1. **Authentication** - Login and registration
2. **Member Registration** - Multi-step registration form
3. **Profile Management** - Member profile editing
4. **Document Upload** - File upload with validation
5. **Digital Signature** - Signature capture
6. **Internationalization** - Multi-language support

## Key Features

### Dual Authentication Architecture

The system implements two parallel authentication mechanisms:

- **Member Authentication** - For club members
  - Registration via public website
  - Access to personal account
  - Document upload and management
  - Digital signature handling

- **Employee Authentication** - For employees
  - Access to CRM system
  - Member management capabilities
  - Email campaign management
  - Administrative functions

**Benefits:**
- Single person can be both member and employee
- Complete separation of access contexts
- Enhanced security isolation
- Independent token systems

### Multilingual Support

All text content is extracted into constants:

- UI text and labels
- System messages
- Email templates
- Error messages

**Supported Languages:**
- Russian (ru)
- English (en)
- Spanish (es)

**Architecture:**
- Frontend: next-intl with JSON message files
- Backend: Localized email templates
- Database: Prepared for content localization

### Scalability Features

- **Queue System**: Bull queues for async operations
  - Email sending
  - File processing
  - Background tasks

- **Caching**: Redis for performance
  - Session storage
  - API response caching
  - Rate limiting

- **Database Optimization**:
  - Proper indexing
  - Query optimization
  - Connection pooling

- **File Storage**: Modular system
  - Multiple backend support
  - CDN integration ready
  - Scalable storage solutions

### Security

- **Separation of Authentication Contexts**
- **Role-Based Access Control (RBAC)**
- **Protected API Endpoints**
- **Secure Document Access**
- **File Validation and Upload Restrictions**
- **JWT Token Security**
- **Password Hashing (bcrypt)**

## Database Architecture

### Core Models

- **User** - Minimal authentication model
  - `id`, `email`, `passwordHash`, `isActive`

- **Member** - Club member data
  - Personal information
  - Membership details
  - Application status
  - Related documents and signatures

- **Employee** - Employee data
  - Personal information
  - Role and permissions
  - Department and position

- **Token** - Refresh tokens for members
- **EmployeeToken** - Refresh tokens for employees

### Design Principles

1. **User as Base Model**: User contains only authentication data
2. **Member/Employee Extension**: Business logic uses Member or Employee
3. **Repository Pattern**: All database operations through repositories
4. **Scalable Schema**: Separate tables for statuses and documents

## Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Start infrastructure
docker-compose -f docker-compose-dev.yml up -d

# Run migrations
cd apps/api
pnpm prisma migrate dev
pnpm prisma generate

# Start applications
pnpm dev  # From root (runs all apps)
```

### Code Organization

- **Backend**: Domain-driven design with modules
- **Frontend**: Feature-Sliced Design (FSD)
- **Shared**: Common types and utilities
- **Packages**: Reusable configurations

## Future Development

### Planned Features

- **Payment Integration**: Subscription and billing system
- **Advanced Analytics**: Member and club analytics
- **Mobile Application**: React Native app
- **Third-party Integrations**: External service integrations
- **Content Management**: Database-driven content localization
- **Advanced Reporting**: Comprehensive reporting system

### Scalability Roadmap

- Microservices architecture (if needed)
- Horizontal scaling
- CDN integration
- Advanced caching strategies
- Database sharding (if required)

## Navigation

- [Backend Documentation](./backend/README.md) - Detailed backend information
- [Site Documentation](./site/README.md) - Frontend application details
- [CRM Documentation](./crm/README.md) - CRM system documentation
- [Authentication](./AUTHENTICATION.md) - Authentication system details
- [Storage](./STORAGE.md) - File storage documentation
