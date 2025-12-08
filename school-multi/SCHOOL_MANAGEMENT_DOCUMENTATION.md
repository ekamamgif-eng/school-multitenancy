# School Management Documentation

## Overview
This document describes the complete school (tenant) management system for Super Administrators. The system allows Super Admins to create, view, edit, and manage schools within the multi-tenant platform.

---

## Table of Contents
1. [User Roles](#user-roles)
2. [Features](#features)
3. [User Flows](#user-flows)
4. [Database Schema](#database-schema)
5. [API/Service Methods](#apiservice-methods)
6. [UI Components](#ui-components)
7. [Validation Rules](#validation-rules)
8. [Error Handling](#error-handling)

---

## User Roles

### Super Administrator
- **Access Level**: Full platform access
- **Permissions**:
  - View all schools
  - Create new schools
  - Edit school information
  - Delete schools
  - View school statistics
  - Manage school subscriptions and limits

---

## Features

### 1. School Dashboard
**Location**: `/super-admin`

**Purpose**: Central hub for managing all schools in the platform

**Features**:
- Platform-wide statistics (total schools, students, payments, modules)
- List of all managed schools with key information
- Quick actions for school management
- Navigation to add new schools

### 2. View School Details
**Location**: `/super-admin/schools/:id`

**Purpose**: Display comprehensive information about a specific school

**Information Displayed**:
- **Basic Information**:
  - School name
  - Subdomain
  - School type (TK, SD, SMP, SMA, SMK, Other)
  - NPSN (National School Number)
  - Accreditation (A, B, C, Not Accredited)
  - Established year

- **Contact Information**:
  - Email
  - Phone
  - Website
  - Full address (street, city, province, postal code)

- **Principal Information**:
  - Name
  - Email
  - Phone

- **Subscription & Limits**:
  - Current plan (Free, Basic, Premium, Enterprise)
  - Expiration date
  - Maximum students allowed
  - Maximum teachers allowed

- **Statistics**:
  - Current student count
  - Current teacher count
  - Payment submissions count
  - Active modules count

- **Active Modules**:
  - List of enabled modules (Academic, Payment, Meeting, Library, Transport, Attendance)

- **System Information**:
  - Created date
  - Last updated date

**Actions Available**:
- Edit school
- Delete school
- Back to dashboard

### 3. Add New School
**Location**: `/super-admin/schools/add`

**Purpose**: Create a new school in the system

**Form Sections**:

#### Basic Information
- School Name* (required)
- Subdomain* (required, lowercase, alphanumeric with hyphens only)
- School Type (dropdown: TK, SD, SMP, SMA, SMK, Other)
- NPSN
- Accreditation (dropdown: A, B, C, Not Accredited)
- Established Year

#### Contact Information
- Email
- Phone
- Website
- Address
- City
- Province
- Postal Code

#### Principal Information
- Principal Name
- Principal Email
- Principal Phone

#### Subscription & Limits
- Status* (required, dropdown: Active, Trial, Inactive, Suspended)
- Subscription Plan (dropdown: Free, Basic, Premium, Enterprise)
- Subscription Expires (date picker)
- Max Students (number)
- Max Teachers (number)

#### Active Modules
- Checkboxes for available modules:
  - Academic Management
  - Payment Management
  - Meeting & Minutes
  - Library Management
  - Transport Management
  - Attendance System

#### Notes
- Free-text area for additional comments

### 4. Edit School
**Location**: `/super-admin/schools/:id/edit`

**Purpose**: Update existing school information

**Features**:
- Pre-populated form with current school data
- Same form structure as "Add New School"
- Subdomain field is disabled (cannot be changed after creation)
- All other fields can be updated

### 5. Delete School
**Trigger**: Delete button on School Detail page

**Purpose**: Remove a school from the system

**Process**:
1. User clicks "Delete" button
2. Confirmation dialog appears
3. If confirmed, school is permanently deleted
4. User is redirected to dashboard

---

## User Flows

### Flow 1: View All Schools
```
1. Super Admin logs in
2. Navigates to /super-admin (automatically after login)
3. Sees dashboard with:
   - Platform statistics
   - List of all schools
4. Can click "View Details" or "Manage" on any school card
```

### Flow 2: View School Details
```
1. From dashboard, click "View Details" on a school card
2. Navigate to /super-admin/schools/:id
3. View comprehensive school information
4. Options:
   - Click "Edit School" to modify
   - Click "Delete" to remove
   - Click "Back" to return to dashboard
```

### Flow 3: Add New School
```
1. From dashboard, click "+ Add New School"
2. Navigate to /super-admin/schools/add
3. Fill out the form:
   a. Enter required fields (School Name, Subdomain, Status)
   b. Fill optional fields as needed
   c. Select active modules
   d. Add notes if necessary
4. Click "Create School"
5. System validates input:
   - If valid: School is created, redirect to school detail page
   - If invalid: Show error messages, stay on form
6. Success message displayed
```

### Flow 4: Edit Existing School
```
1. From school detail page, click "Edit School"
   OR from dashboard, click "Manage" on a school card
2. Navigate to /super-admin/schools/:id/edit
3. Form is pre-populated with current data
4. Modify desired fields
5. Click "Update School"
6. System validates input:
   - If valid: School is updated, redirect to school detail page
   - If invalid: Show error messages, stay on form
7. Success message displayed
```

### Flow 5: Delete School
```
1. From school detail page, click "Delete"
2. Confirmation dialog appears:
   "Are you sure you want to delete [School Name]? This action cannot be undone."
3. User confirms or cancels:
   - If confirmed: School is deleted, redirect to dashboard
   - If cancelled: Stay on detail page
4. Success message displayed (if deleted)
```

---

## Database Schema

### Table: `tenants`

```sql
CREATE TABLE tenants (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) NOT NULL UNIQUE,
  theme JSONB DEFAULT '{}',
  active_modules TEXT[] DEFAULT ARRAY['academic', 'payment'],
  
  -- Contact Information
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  website VARCHAR(255),
  
  -- School Details
  school_type VARCHAR(20), -- 'SD', 'SMP', 'SMA', 'SMK', 'TK', 'Other'
  accreditation VARCHAR(20), -- 'A', 'B', 'C', 'Not Accredited'
  npsn VARCHAR(50),
  established_year INTEGER,
  
  -- Principal Information
  principal_name VARCHAR(255),
  principal_phone VARCHAR(50),
  principal_email VARCHAR(255),
  
  -- Status & Settings
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'suspended', 'trial'
  subscription_plan VARCHAR(20), -- 'free', 'basic', 'premium', 'enterprise'
  subscription_expires_at TIMESTAMP,
  max_students INTEGER,
  max_teachers INTEGER,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  logo_url TEXT,
  notes TEXT
);

-- Indexes
CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_created_at ON tenants(created_at DESC);
```

### Migration Script

If the table doesn't exist, it will be created automatically when the first school is added. However, you can run this migration to ensure all columns exist:

```sql
-- Add new columns if they don't exist
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS province VARCHAR(100);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS school_type VARCHAR(20);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS accreditation VARCHAR(20);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS npsn VARCHAR(50);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS established_year INTEGER;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS principal_name VARCHAR(255);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS principal_phone VARCHAR(50);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS principal_email VARCHAR(255);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(20);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS max_students INTEGER;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS max_teachers INTEGER;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Rename 'theme' column if it doesn't exist (for compatibility)
-- Note: Adjust based on your actual schema
```

---

## API/Service Methods

### `tenantService.ts`

#### `getAllTenants()`
**Purpose**: Fetch all schools from the database

**Returns**: `Promise<Tenant[]>`

**Usage**:
```typescript
const schools = await tenantService.getAllTenants()
```

#### `getTenantById(id: string)`
**Purpose**: Fetch a single school by ID

**Parameters**:
- `id`: School UUID

**Returns**: `Promise<Tenant | null>`

**Usage**:
```typescript
const school = await tenantService.getTenantById('uuid-here')
```

#### `createTenant(formData: TenantFormData, userId: string)`
**Purpose**: Create a new school

**Parameters**:
- `formData`: School information
- `userId`: ID of the user creating the school

**Returns**: `Promise<Tenant>`

**Usage**:
```typescript
const newSchool = await tenantService.createTenant(formData, user.id)
```

#### `updateTenant(id: string, formData: TenantFormData, userId: string)`
**Purpose**: Update an existing school

**Parameters**:
- `id`: School UUID
- `formData`: Updated school information
- `userId`: ID of the user updating the school

**Returns**: `Promise<Tenant>`

**Usage**:
```typescript
const updatedSchool = await tenantService.updateTenant(id, formData, user.id)
```

#### `deleteTenant(id: string)`
**Purpose**: Delete a school

**Parameters**:
- `id`: School UUID

**Returns**: `Promise<void>`

**Usage**:
```typescript
await tenantService.deleteTenant(id)
```

#### `getTenantStats(tenantId: string)`
**Purpose**: Get statistics for a specific school

**Parameters**:
- `tenantId`: School UUID

**Returns**: `Promise<{ studentCount, teacherCount, paymentCount }>`

**Usage**:
```typescript
const stats = await tenantService.getTenantStats(tenantId)
```

---

## UI Components

### 1. SuperAdminDashboard
**File**: `src/pages/auth/super-admin/Dashboard.tsx`

**Purpose**: Main dashboard for Super Admin

**Features**:
- Displays platform statistics
- Lists all schools
- Provides navigation to add/view/edit schools

### 2. SchoolDetail
**File**: `src/pages/super-admin/SchoolDetail.tsx`

**Purpose**: Display detailed information about a school

**Features**:
- Shows all school information
- Displays statistics
- Provides edit and delete actions

### 3. SchoolForm
**File**: `src/pages/super-admin/SchoolForm.tsx`

**Purpose**: Form for creating and editing schools

**Features**:
- Handles both create and edit modes
- Validates input
- Submits data to backend

---

## Validation Rules

### Required Fields
- School Name
- Subdomain
- Status

### Subdomain Validation
- Must be unique
- Only lowercase letters, numbers, and hyphens
- Cannot be changed after creation
- Pattern: `/^[a-z0-9-]+$/`

### Email Validation
- Must be valid email format (if provided)

### Phone Validation
- No specific format required (flexible for international numbers)

### Number Fields
- Established Year: Must be between 1900 and current year
- Max Students: Must be positive integer
- Max Teachers: Must be positive integer

---

## Error Handling

### Common Errors

#### 1. Duplicate Subdomain
**Error**: Subdomain already exists
**Solution**: Choose a different subdomain

#### 2. Invalid Subdomain Format
**Error**: Subdomain contains invalid characters
**Solution**: Use only lowercase letters, numbers, and hyphens

#### 3. Missing Required Fields
**Error**: School name or subdomain is empty
**Solution**: Fill in all required fields

#### 4. Database Connection Error
**Error**: Failed to connect to database
**Solution**: Check Supabase configuration and network connection

#### 5. Permission Denied
**Error**: User doesn't have permission to perform action
**Solution**: Ensure user is logged in as Super Admin

---

## Security Considerations

1. **Authentication**: Only Super Admins can access school management features
2. **Authorization**: Routes are protected by role-based access control
3. **Input Validation**: All inputs are validated on both client and server
4. **SQL Injection Prevention**: Using Supabase parameterized queries
5. **XSS Prevention**: React automatically escapes user input

---

## Future Enhancements

1. **Bulk Operations**: Import/export schools via CSV
2. **Advanced Filtering**: Filter schools by status, type, subscription plan
3. **Search Functionality**: Search schools by name, subdomain, or location
4. **Audit Log**: Track all changes made to school records
5. **Email Notifications**: Notify principals when school info is updated
6. **Logo Upload**: Allow uploading school logos
7. **Theme Customization**: Visual theme editor for each school
8. **Usage Analytics**: Detailed analytics per school
9. **Billing Integration**: Automated billing based on subscription plan
10. **Multi-language Support**: Support for multiple languages

---

## Support

For technical support or questions about the school management system, contact:
- **Email**: support@sekolahku.com
- **Documentation**: [Internal Wiki Link]
- **Developer**: [Your Name/Team]

---

**Last Updated**: December 8, 2025
**Version**: 1.0.0
