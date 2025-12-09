-- ============================================
-- Add Branding Columns to Tenants Table
-- ============================================
-- Adds explicit columns for branding to allow direct editing
-- by tenant admins.
-- ============================================

-- Add branding columns
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS primary_color VARCHAR(50);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(50);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS border_radius VARCHAR(20) DEFAULT '8px';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS font_family VARCHAR(50) DEFAULT 'Inter';

-- Comment on columns
COMMENT ON COLUMN tenants.primary_color IS 'Primary brand color (hex code)';
COMMENT ON COLUMN tenants.secondary_color IS 'Secondary brand color (hex code)';
COMMENT ON COLUMN tenants.border_radius IS 'UI Border radius preference (e.g., 4px, 8px, 1rem)';
COMMENT ON COLUMN tenants.font_family IS 'Preferred font family for the tenant';

-- Migrate existing data from theme_config JSONB to new columns (if applicable)
UPDATE tenants 
SET 
  primary_color = COALESCE(theme_config->>'primaryColor', '#0f766e'),
  secondary_color = COALESCE(theme_config->>'secondaryColor', '#115e59'),
  border_radius = COALESCE(theme_config->>'borderRadius', '8px'),
  font_family = COALESCE(theme_config->>'fontFamily', 'Inter')
WHERE primary_color IS NULL;
