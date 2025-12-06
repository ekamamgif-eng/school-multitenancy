-- Students Table Setup (Safe Migration)
-- This script safely drops existing table and recreates it

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view students from their tenant" ON students;
DROP POLICY IF EXISTS "Admins can insert students" ON students;
DROP POLICY IF EXISTS "Admins can update students" ON students;
DROP POLICY IF EXISTS "Admins can delete students" ON students;

-- Drop existing trigger
DROP TRIGGER IF EXISTS update_students_timestamp ON students;

-- Drop existing function
DROP FUNCTION IF EXISTS update_students_updated_at();

-- Drop existing indexes
DROP INDEX IF EXISTS idx_students_tenant_id;
DROP INDEX IF EXISTS idx_students_nis;
DROP INDEX IF EXISTS idx_students_class;
DROP INDEX IF EXISTS idx_students_status;
DROP INDEX IF EXISTS idx_students_name;

-- Drop existing table
DROP TABLE IF EXISTS students CASCADE;

-- Create students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Personal Information
    nis VARCHAR(50) NOT NULL,
    nisn VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    gender VARCHAR(20) CHECK (gender IN ('male', 'female')),
    birth_place VARCHAR(100),
    birth_date DATE,
    religion VARCHAR(50),
    
    -- Contact Information
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Academic Information
    class VARCHAR(50),
    major VARCHAR(100),
    academic_year VARCHAR(20),
    admission_date DATE,
    graduation_date DATE,
    
    -- Parent/Guardian Information
    father_name VARCHAR(255),
    father_phone VARCHAR(50),
    father_occupation VARCHAR(100),
    mother_name VARCHAR(255),
    mother_phone VARCHAR(50),
    mother_occupation VARCHAR(100),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(50),
    guardian_relation VARCHAR(50),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred', 'dropped')),
    
    -- Additional Information
    photo_url TEXT,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Constraints
    UNIQUE(tenant_id, nis)
);

-- Create indexes
CREATE INDEX idx_students_tenant_id ON students(tenant_id);
CREATE INDEX idx_students_nis ON students(tenant_id, nis);
CREATE INDEX idx_students_class ON students(tenant_id, class);
CREATE INDEX idx_students_status ON students(tenant_id, status);
CREATE INDEX idx_students_name ON students(tenant_id, full_name);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view students from their tenant"
ON students FOR SELECT
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id FROM profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Admins can insert students"
ON students FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
    )
);

CREATE POLICY "Admins can update students"
ON students FOR UPDATE
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
    )
);

CREATE POLICY "Admins can delete students"
ON students FOR DELETE
TO authenticated
USING (
    tenant_id IN (
        SELECT tenant_id FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
    )
);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_students_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_students_timestamp
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_students_updated_at();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Students table created successfully!';
END $$;
