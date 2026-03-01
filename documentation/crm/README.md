# CRM System Documentation

## Overview

The CRM system (`apps/crm`) is a Next.js application designed for internal employee use. It provides tools for managing club members, sending email campaigns, and performing administrative tasks. **Note: This system is currently in planning phase.**

## Purpose

The CRM system enables employees to:
- View and manage member data
- Process membership applications
- Send mass email campaigns
- Manage employee accounts
- Access administrative tools
- Generate reports and analytics

## Planned Architecture

### Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI)
- **State Management**: TanStack Query (React Query)
- **API Client**: Auto-generated from OpenAPI spec
- **Internationalization**: next-intl

### Project Structure (Planned)

```
apps/crm/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Localized routes
│   │   ├── auth/          # Employee authentication
│   │   ├── dashboard/     # Employee dashboard
│   │   ├── members/       # Member management
│   │   ├── campaigns/     # Email campaigns
│   │   ├── employees/     # Employee management
│   │   └── admin/         # Admin panel (admin role only)
│   └── layout.tsx         # Root layout
├── modules/               # Feature modules (FSD)
│   ├── shared/            # Shared resources
│   ├── features/          # Feature modules
│   └── widgets/           # Composite widgets
└── proxy.ts              # Next.js 16 proxy
```

## Features (Planned)

### 1. Employee Dashboard

**Purpose**: Central hub for employee activities

**Features**:
- Overview statistics
- Recent member registrations
- Pending applications
- Quick actions
- Activity feed

### 2. Member Management

**Purpose**: Comprehensive member data management

**Features**:
- Member list with filtering and search
- Member profile view and editing
- Application status management
- Document review and approval
- Member status updates
- Member history and activity log

**Planned Routes**:
- `/[locale]/members` - Member list
- `/[locale]/members/:id` - Member details
- `/[locale]/members/:id/edit` - Edit member
- `/[locale]/members/:id/documents` - Review documents
- `/[locale]/members/:id/history` - Activity history

### 3. Email Campaigns

**Purpose**: Mass email communication with members

**Features**:
- Create email campaigns
- Select member groups (by status, registration date, etc.)
- Email template management
- Campaign scheduling
- Campaign analytics
- Email delivery tracking

**Planned Routes**:
- `/[locale]/campaigns` - Campaign list
- `/[locale]/campaigns/new` - Create campaign
- `/[locale]/campaigns/:id` - Campaign details
- `/[locale]/campaigns/:id/analytics` - Campaign analytics

### 4. Employee Management

**Purpose**: Manage employee accounts and permissions

**Features**:
- Employee list
- Create new employees
- Role assignment (employee, manager, admin)
- Permission management
- Employee activity monitoring

**Planned Routes**:
- `/[locale]/employees` - Employee list
- `/[locale]/employees/new` - Create employee
- `/[locale]/employees/:id` - Employee details
- `/[locale]/employees/:id/edit` - Edit employee

### 5. Administrative Tools (Admin Only)

**Purpose**: Advanced administrative functions

**Features**:
- System configuration
- Database management
- User management
- System logs and monitoring
- Backup and restore
- Advanced analytics

**Planned Routes**:
- `/[locale]/admin` - Admin dashboard
- `/[locale]/admin/settings` - System settings
- `/[locale]/admin/logs` - System logs
- `/[locale]/admin/analytics` - Advanced analytics

## Authentication

### Employee Authentication

- **Endpoint**: `/auth/employee/login`
- **Token System**: Separate from member tokens
- **Roles**: employee, manager, admin
- **Guards**: `EmployeeAuthGuard`, `AdminGuard`

### Role-Based Access

- **Employee**: Basic access to member management
- **Manager**: Extended access including campaigns
- **Admin**: Full system access including admin panel

## API Integration

### Backend Endpoints

The CRM will use the following backend endpoints:

- **Members**: `/members/*` (with employee authentication)
- **Employees**: `/employees/*` (admin only)
- **Mail**: `/mail/*` (for campaigns)
- **Storage**: `/storage/*` (for file access)

### API Client

- Auto-generated from OpenAPI spec
- Type-safe API calls
- TanStack Query integration
- Automatic token injection

## UI Components

### Planned Components

- **Data Tables**: Member and employee lists
- **Filters**: Advanced filtering UI
- **Charts**: Analytics and statistics
- **Forms**: Member and employee editing
- **Modals**: Confirmation dialogs
- **Notifications**: System notifications

### Component Library

- shadcn/ui for base components
- Custom components for CRM-specific features
- Reusable widgets for common patterns

## State Management

### TanStack Query

- Server state management
- Caching and background updates
- Optimistic updates for member status changes

### Local State

- Form state (React Hook Form)
- UI state (modals, filters)
- Theme state

## Internationalization

### Locale Support

- Russian (ru)
- English (en)
- Spanish (es)

### Implementation

- next-intl for i18n
- Locale routing
- Employee-specific translations

## Security

### Access Control

- Role-based access control (RBAC)
- Route protection based on roles
- API endpoint protection
- Data access restrictions

### Security Features

- Employee authentication required
- Session management
- Secure token storage
- Audit logging (planned)

## Performance

### Optimization Strategies

- Code splitting by route
- Lazy loading of heavy components
- Virtual scrolling for large lists
- API response caching
- Background data prefetching

## Development Roadmap

### Phase 1: Core Features
- Employee authentication
- Member list and search
- Member profile view
- Basic member management

### Phase 2: Advanced Features
- Email campaigns
- Employee management
- Advanced filtering
- Analytics dashboard

### Phase 3: Admin Features
- Admin panel
- System configuration
- Advanced analytics
- Reporting system

## Integration Points

### Backend Integration

- **Members Module**: Member data access
- **Employees Module**: Employee management
- **Mail Module**: Email campaign sending
- **Storage Module**: Document access
- **Auth Module**: Employee authentication

### External Integrations (Planned)

- Email service providers
- Analytics services
- Reporting tools
- Notification services

## Testing Strategy

### Unit Tests

- Component tests
- Utility function tests
- Hook tests

### Integration Tests

- API integration tests
- Authentication flow tests
- Role-based access tests

### E2E Tests

- Complete employee workflows
- Member management flows
- Campaign creation and sending

## Future Enhancements

- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Comprehensive reporting
- **Bulk Operations**: Batch member operations
- **Export Functionality**: Data export (CSV, PDF)
- **Mobile Responsive**: Full mobile support
- **Offline Mode**: Limited offline functionality

## Related Documentation

- [Backend Documentation](../backend/README.md) - API details
- [Authentication System](../AUTHENTICATION.md) - Employee auth
- [Site Documentation](../site/README.md) - Public website
- [Storage Module](../STORAGE.md) - File access

## Notes

This CRM system is currently in the planning phase. The architecture and features described above are subject to change based on requirements and development progress.
