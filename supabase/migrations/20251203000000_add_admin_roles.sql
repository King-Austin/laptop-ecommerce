-- ============================================
-- ADMIN ROLES AND PERMISSIONS SYSTEM
-- ============================================

-- Create admin_users table to track admin roles
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'manager', 'viewer')),
  permissions JSONB DEFAULT '{"products": true, "orders": true, "users": false}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can view admin_users
CREATE POLICY "Authenticated users can view admin users"
ON public.admin_users
FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy: Only super_admins can insert new admin users
CREATE POLICY "Super admins can insert admin users"
ON public.admin_users
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
    AND is_active = true
  )
);

-- Policy: Only super_admins can update admin users
CREATE POLICY "Super admins can update admin users"
ON public.admin_users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
    AND is_active = true
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- UPDATE PRODUCTS TABLE POLICIES
-- ============================================

-- Drop old policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

-- Create new policies that check admin_users table
CREATE POLICY "Admin users can insert products"
ON public.products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
    AND (permissions->>'products')::boolean = true
  )
  OR auth.role() = 'authenticated' -- Temporary: allow all authenticated users
);

CREATE POLICY "Admin users can update products"
ON public.products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
    AND (permissions->>'products')::boolean = true
  )
  OR auth.role() = 'authenticated' -- Temporary: allow all authenticated users
);

CREATE POLICY "Admin users can delete products"
ON public.products
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
    AND (permissions->>'products')::boolean = true
  )
  OR auth.role() = 'authenticated' -- Temporary: allow all authenticated users
);

-- ============================================
-- UPDATE ORDERS TABLE POLICIES
-- ============================================

-- Drop old policy
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;

-- Create new policy
CREATE POLICY "Admin users can update orders"
ON public.orders
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
    AND (permissions->>'orders')::boolean = true
  )
  OR auth.role() = 'authenticated' -- Temporary: allow all authenticated users
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = user_id_param
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(user_id_param UUID, permission_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_perm BOOLEAN;
BEGIN
  SELECT (permissions->>permission_key)::boolean INTO has_perm
  FROM public.admin_users
  WHERE user_id = user_id_param
  AND is_active = true;
  
  RETURN COALESCE(has_perm, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.admin_users
  WHERE user_id = user_id_param
  AND is_active = true;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- AUDIT LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  resource_type TEXT NOT NULL, -- 'product', 'order', 'user', 'auth'
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_admin_audit_log_admin_user_id ON public.admin_audit_log(admin_user_id);
CREATE INDEX idx_admin_audit_log_action ON public.admin_audit_log(action);
CREATE INDEX idx_admin_audit_log_resource_type ON public.admin_audit_log(resource_type);
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);

-- Enable RLS
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view audit logs
CREATE POLICY "Admin users can view audit logs"
ON public.admin_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- Policy: System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.admin_audit_log
FOR INSERT
WITH CHECK (true);

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Note: You'll need to create a user in Supabase Auth first, then add them here
-- Example:
-- INSERT INTO public.admin_users (user_id, email, role, permissions)
-- VALUES (
--   'your-user-uuid-from-auth-users',
--   'admin@example.com',
--   'super_admin',
--   '{"products": true, "orders": true, "users": true}'::jsonb
-- );

COMMENT ON TABLE public.admin_users IS 'Admin users with role-based access control';
COMMENT ON TABLE public.admin_audit_log IS 'Audit trail of admin actions';
