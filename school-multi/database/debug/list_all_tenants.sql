-- Count all tenants
SELECT count(*) as total_tenants FROM tenants;

-- List details of all tenants
SELECT id, name, subdomain, created_at, status FROM tenants;
