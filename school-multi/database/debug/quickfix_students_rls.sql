-- QUICK FIX: Students RLS Policy
-- Run this to allow INSERT for testing

-- Drop strict policy
DROP POLICY IF EXISTS "Admins can insert students" ON students;

-- Create permissive policy for testing
CREATE POLICY "Allow authenticated users to insert students"
ON students FOR INSERT
TO authenticated
WITH CHECK (
    -- User must have profile with tenant_id
    tenant_id IN (
        SELECT tenant_id FROM profiles 
        WHERE id = auth.uid()
        AND tenant_id IS NOT NULL
    )
);

-- Verify
SELECT '✅ RLS Policy updated - Try adding student again!' as message;
