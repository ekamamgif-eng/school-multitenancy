# Update Tenant Profiles Feature

## 1. Database Schema Update
To support direct editing of branding fields, I have created a migration script that adds specific columns (`primary_color`, `secondary_color`, `border_radius`, `font_family`) to the `tenants` table.

**Run this script in Supabase:**
`database/migrations/add_branding_columns.sql`

## 2. New Feature: School Profile
I have implemented a new "School Profile" page for Tenant Admins.

- **URL**: `/admin/profile`
- **Features**:
  - Edit School Name, Contact Info
  - **Live Branding Preview**: Change colors, fonts, and border radius and see the result instantly.
  - Updates both the new columns and the `theme_config` JSON for backward compatibility.

## 3. How to Verify
1.  Run the migration script above.
2.  Log in as a Tenant Admin (or use a user linked to a tenant).
3.  Navigate to `/admin/profile`.
4.  Try changing the "Primary Color" or "Border Radius".
5.  Click "Save Changes".
6.  The application theme should update immediately without a refresh.
