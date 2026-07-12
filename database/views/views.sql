-- Views for TransitOps operational modules

-- Active users with mapped roles
CREATE OR REPLACE VIEW active_user_roles_view AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    r.code as role_code,
    r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.deleted_at IS NULL
LEFT JOIN roles r ON ur.role_id = r.id AND r.deleted_at IS NULL
WHERE u.deleted_at IS NULL AND u.is_active = TRUE;
