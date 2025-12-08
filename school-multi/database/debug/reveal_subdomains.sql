-- Query to reveal all tenant subdomains
SELECT name, subdomain, created_at FROM tenants ORDER BY created_at DESC;
