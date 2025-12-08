-- ============================================
-- School Management System - Database Migration
-- ============================================
-- This script ensures the tenants table has all required columns
-- for the school management system.
-- 
-- Run this in your Supabase SQL Editor
-- ============================================

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
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS updated_by UUID;

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tenants_created_by_fkey'
    ) THEN
        ALTER TABLE tenants 
        ADD CONSTRAINT tenants_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tenants_updated_by_fkey'
    ) THEN
        ALTER TABLE tenants 
        ADD CONSTRAINT tenants_updated_by_fkey 
        FOREIGN KEY (updated_by) REFERENCES auth.users(id);
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_created_at ON tenants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tenants_school_type ON tenants(school_type);
CREATE INDEX IF NOT EXISTS idx_tenants_subscription_plan ON tenants(subscription_plan);

-- Add check constraints for data integrity
DO $$
BEGIN
    -- Check constraint for status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tenants_status_check'
    ) THEN
        ALTER TABLE tenants 
        ADD CONSTRAINT tenants_status_check 
        CHECK (status IN ('active', 'inactive', 'suspended', 'trial'));
    END IF;

    -- Check constraint for school_type
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tenants_school_type_check'
    ) THEN
        ALTER TABLE tenants 
        ADD CONSTRAINT tenants_school_type_check 
        CHECK (school_type IN ('SD', 'SMP', 'SMA', 'SMK', 'TK', 'Other') OR school_type IS NULL);
    END IF;

    -- Check constraint for accreditation
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tenants_accreditation_check'
    ) THEN
        ALTER TABLE tenants 
        ADD CONSTRAINT tenants_accreditation_check 
        CHECK (accreditation IN ('A', 'B', 'C', 'Not Accredited') OR accreditation IS NULL);
    END IF;

    -- Check constraint for subscription_plan
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tenants_subscription_plan_check'
    ) THEN
        ALTER TABLE tenants 
        ADD CONSTRAINT tenants_subscription_plan_check 
        CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise') OR subscription_plan IS NULL);
    END IF;
END $$;

-- Create or replace function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing records to have default status if NULL
UPDATE tenants SET status = 'active' WHERE status IS NULL;

-- Add comments to columns for documentation
COMMENT ON COLUMN tenants.name IS 'Official name of the school';
COMMENT ON COLUMN tenants.subdomain IS 'Unique subdomain for the school (e.g., sma-negeri-1)';
COMMENT ON COLUMN tenants.status IS 'Current status: active, inactive, suspended, or trial';
COMMENT ON COLUMN tenants.school_type IS 'Type of school: SD, SMP, SMA, SMK, TK, or Other';
COMMENT ON COLUMN tenants.npsn IS 'Nomor Pokok Sekolah Nasional (National School Number)';
COMMENT ON COLUMN tenants.accreditation IS 'School accreditation level: A, B, C, or Not Accredited';
COMMENT ON COLUMN tenants.subscription_plan IS 'Current subscription plan: free, basic, premium, or enterprise';
COMMENT ON COLUMN tenants.max_students IS 'Maximum number of students allowed';
COMMENT ON COLUMN tenants.max_teachers IS 'Maximum number of teachers allowed';

-- Grant necessary permissions (adjust based on your RLS policies)
-- Note: Make sure to set up proper Row Level Security (RLS) policies

COMMENT ON TABLE tenants IS 'Stores information about schools (tenants) in the multi-tenant system';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'All required columns have been added to the tenants table.';
    RAISE NOTICE 'Indexes and constraints have been created.';
    RAISE NOTICE 'Please verify the changes and set up Row Level Security (RLS) policies if needed.';
END $$;
