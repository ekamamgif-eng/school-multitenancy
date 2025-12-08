# Database Migrations

This directory contains SQL migration scripts for the school management system.

## How to Run Migrations

### Using Supabase Dashboard

1. Log in to your Supabase project
2. Navigate to the **SQL Editor**
3. Click **New Query**
4. Copy the contents of the migration file
5. Paste into the editor
6. Click **Run** or press `Ctrl/Cmd + Enter`

### Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

## Migration Files

### `add_school_management_columns.sql`

**Purpose**: Adds all required columns to the `tenants` table for comprehensive school management.

**What it does**:
- Adds contact information columns (email, phone, address, etc.)
- Adds school details columns (type, accreditation, NPSN, etc.)
- Adds principal information columns
- Adds status and subscription columns
- Adds metadata columns (created_by, updated_by, etc.)
- Creates indexes for better query performance
- Adds check constraints for data integrity
- Creates trigger for auto-updating `updated_at`

**Safe to run multiple times**: Yes, uses `IF NOT EXISTS` checks

**Rollback**: Not included (create manually if needed)

## Verification

After running the migration, verify it worked:

```sql
-- Check if all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tenants'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'tenants';

-- Check constraints
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'tenants'::regclass;
```

## Troubleshooting

### Error: "relation 'tenants' does not exist"

The `tenants` table hasn't been created yet. Create it first:

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) NOT NULL UNIQUE,
  theme JSONB DEFAULT '{}',
  active_modules TEXT[] DEFAULT ARRAY['academic', 'payment'],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Then run the migration.

### Error: "column already exists"

This is normal if you're running the migration multiple times. The `IF NOT EXISTS` checks will skip existing columns.

### Error: "permission denied"

Make sure you're running the migration with sufficient privileges (usually as the database owner or superuser).

## Best Practices

1. **Backup First**: Always backup your database before running migrations
2. **Test in Development**: Run migrations in a development environment first
3. **Review Changes**: Review the migration file before running
4. **Monitor Performance**: Check query performance after adding indexes
5. **Document Changes**: Update this README when adding new migrations

## Migration History

| Date | File | Description | Status |
|------|------|-------------|--------|
| 2025-12-08 | `add_school_management_columns.sql` | Initial school management schema | ✅ Ready |

---

**Note**: This is a living document. Update it as you add more migrations.
