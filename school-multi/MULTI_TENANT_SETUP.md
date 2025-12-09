# Multi-Tenant Scenario Setup

## Overview
This configuration sets up two distinct tenants with separate branding as requested:

1. **Brand 1: Proza Bangsa**
   - URL: `/proza-bangsa`
   - Branding: Teal Theme, standard styling
   - Modules: Full enterprise suite

2. **Brand 2: PROZA**
   - URL: `/proza`
   - Branding: Violet/Purple Theme, modern rounder styling
   - Modules: Full enterprise suite

## 1. Database Setup (Permanent Fix)
**File**: `database/migrations/seed_proza_bangsa.sql`

I have updated the seed script to include **BOTH** tenants. Run this in your Supabase SQL Editor to permanently create these schools.

```sql
-- This creates both tenants with their specific branding
-- Run the contents of database/migrations/seed_proza_bangsa.sql
```

## 2. Immediate Environment Fix (Applied)
**File**: `src/contexts/TenantContext.tsx`

I have updated the application to fallback to these specific configurations if they are not yet in the database. This allows you to verify the branding immediately.

### Verification URLs
- **Proza Bangsa**: `https://hyetal-unfiscally-voncile.ngrok-free.dev/proza-bangsa`
  - Should show Teal branding
- **PROZA**: `https://hyetal-unfiscally-voncile.ngrok-free.dev/proza`
  - Should show Violet/Purple branding

## 3. Branding Configuration
Each tenant has its own `theme_config` JSON blob in the database:

**Proza Bangsa**:
```json
{
  "primaryColor": "#0f766e",
  "logo": "...",
  "borderRadius": "8px"
}
```

**PROZA**:
```json
{
  "primaryColor": "#7c3aed",
  "logo": "...",
  "borderRadius": "12px"
}
```

These settings are applied automatically when a user visits the respective tenant URL.
