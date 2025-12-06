-- FIX: Students RLS Policy - Proper Admin Check
-- Masalah: Policy strict terlalu ketat atau ada issue dengan subquery
-- Solusi: Simplify policy check

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view students from their tenant" ON students;
DROP POLICY IF EXISTS "Admins can insert students" ON students;
DROP POLICY IF EXISTS "Admins can update students" ON students;
DROP POLICY IF EXISTS "Admins can delete students" ON students;
DROP POLICY IF EXISTS "Allow authenticated users to insert students" ON students;

-- CREATE POLICY for SELECT (semua authenticated bisa lihat tenant mereka)
CREATE POLICY "tenant_select_policy"
ON students FOR SELECT
TO authenticated
USING (
    tenant_id = (
        SELECT tenant_id FROM profiles 
        WHERE id = auth.uid()
        LIMIT 1
    )
);

-- CREATE POLICY for INSERT (admin bisa insert ke tenant mereka)
CREATE POLICY "admin_insert_policy"
ON students FOR INSERT
TO authenticated
WITH CHECK (
    -- Check 1: Tenant ID harus match dengan profile user
    tenant_id = (
        SELECT tenant_id FROM profiles 
        WHERE id = auth.uid()
        LIMIT 1
    )
    AND
    -- Check 2: User harus punya role admin atau super_admin
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
        LIMIT 1
    )
);

-- CREATE POLICY for UPDATE (admin bisa update di tenant mereka)
CREATE POLICY "admin_update_policy"
ON students FOR UPDATE
TO authenticated
USING (
    tenant_id = (
        SELECT tenant_id FROM profiles 
        WHERE id = auth.uid()
        LIMIT 1
    )
    AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
        LIMIT 1
    )
);

-- CREATE POLICY for DELETE (admin bisa delete di tenant mereka) 
CREATE POLICY "admin_delete_policy"
ON students FOR DELETE
TO authenticated
USING (
    tenant_id = (
        SELECT tenant_id FROM profiles 
        WHERE id = auth.uid()
        LIMIT 1
    )
    AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
        LIMIT 1
    )
);

-- Verify policies created
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as operation
FROM pg_policies
WHERE tablename = 'students'
ORDER BY cmd;

SELECT '✅ RLS Policies updated successfully! Try adding student again.' as message;
