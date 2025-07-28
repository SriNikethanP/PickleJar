# Admin Authentication System

## Overview

The admin authentication system provides secure access to the admin panel with preset admin credentials.

## Admin Credentials

- **Email**: admin@picklejar.com
- **Password**: admin123

## Features

### 🔐 **Admin Authentication**

- Separate admin authentication context from regular user authentication
- Admin-specific JWT tokens stored separately
- Role-based access control (ADMIN role required)
- Automatic token refresh for admin sessions

### 🛡️ **Protected Admin Routes**

- All admin routes are protected and require authentication
- Automatic redirect to admin login page for unauthenticated users
- Admin role verification on every request

### 🎯 **Admin Login Flow**

1. Navigate to `/admin/login`
2. Enter admin credentials (pre-filled in the form)
3. System verifies admin role
4. Redirects to admin dashboard on success
5. Shows error message for non-admin users

### 🚪 **Admin Logout**

- Logout button in admin navbar
- Clears admin tokens from localStorage
- Redirects to admin login page
- Shows success toast notification

## Technical Implementation

### Admin Authentication Context

- **File**: `@lib/context/admin-auth-context.tsx`
- Manages admin authentication state
- Handles admin login/logout
- Verifies admin role on authentication

### Admin API Client

- **File**: `@lib/admin-api.ts`
- Centralized API client for admin requests
- Automatic admin token handling
- Token refresh on 401 errors

### Protected Admin Route

- **File**: `@lib/components/ProtectedAdminRoute.tsx`
- Wraps admin components
- Redirects unauthenticated users to admin login
- Loading states during authentication check

### Admin Layout

- **File**: `@app/admin/layout.tsx`
- Wraps all admin pages with AdminAuthProvider
- Includes ProtectedAdminRoute for all admin content

## Admin Routes Protection

All admin routes are automatically protected:

- `/admin` - Dashboard
- `/admin/analytics` - Analytics
- `/admin/customers` - Customer management
- `/admin/inventory` - Inventory management
- `/admin/collections` - Collection management
- `/admin/categories` - Category management
- `/admin/orders` - Order management
- `/admin/payments` - Payment management
- `/admin/shipping` - Shipping management

## Database Setup

The admin user is automatically created in the database with:

- Email: admin@picklejar.com
- Password: admin123 (BCrypt hashed)
- Role: ADMIN
- Status: Active (not banned)

## Security Features

1. **Role Verification**: Only users with ADMIN role can access admin panel
2. **Separate Tokens**: Admin tokens are stored separately from user tokens
3. **Automatic Logout**: Invalid tokens automatically log out admin
4. **Route Protection**: All admin routes require authentication
5. **Token Refresh**: Automatic token refresh for seamless admin experience

## Usage

### For Developers

1. Admin authentication is handled automatically
2. Use `useAdminAuth()` hook in admin components
3. Admin API client handles authentication headers
4. Protected routes ensure security

### For Administrators

1. Navigate to `/admin/login`
2. Use provided admin credentials
3. Access all admin features
4. Logout when finished

## Error Handling

- **Invalid Credentials**: Shows error message
- **Non-Admin User**: Shows "Access denied" message
- **Token Expired**: Automatic refresh or redirect to login
- **Network Errors**: Graceful error handling with user feedback
