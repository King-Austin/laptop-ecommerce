# Admin Authentication & RBAC Setup Guide

## Overview

This guide will help you set up admin authentication and role-based access control (RBAC) for your e-commerce platform.

## Features Implemented

### 1. **Admin Authentication**
- Secure login page at `/admin/login`
- Session management with Supabase Auth
- Protected admin routes
- Automatic redirect to login for unauthorized access

### 2. **Role-Based Access Control (RBAC)**
- Four role levels: `super_admin`, `admin`, `manager`, `viewer`
- Granular permissions for products, orders, and users
- Admin audit logging for all actions

### 3. **Mobile-Responsive UI**
- Cart page optimized for mobile devices
- Admin dashboard responsive on all screen sizes
- Order management dashboard mobile-friendly
- Touch-optimized buttons and controls

## Setup Instructions

### Step 1: Run Database Migrations

Run the migrations in order:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL files in Supabase SQL Editor:
# 1. 20251112093906_84b4314a-2173-4e07-861b-903f5ce1e00b.sql
# 2. 20251113000000_create_products_table.sql
# 3. 20251114000000_create_storage_bucket.sql
# 4. 20251118000000_enhanced_order_system.sql
# 5. 20251203000000_add_admin_roles.sql (NEW)
```

### Step 2: Create Your First Admin User

1. **Sign up a user in Supabase Auth:**
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add user" → "Create new user"
   - Enter email and password
   - Copy the User ID (UUID)

2. **Add the user to admin_users table:**
   - Go to Supabase Dashboard → SQL Editor
   - Run this query (replace with your user ID and email):

```sql
INSERT INTO public.admin_users (user_id, email, role, permissions)
VALUES (
  'your-user-uuid-here',  -- Replace with actual UUID from auth.users
  'admin@yourdomain.com',  -- Replace with actual email
  'super_admin',
  '{"products": true, "orders": true, "users": true}'::jsonb
);
```

### Step 3: Test Admin Login

1. Navigate to `http://localhost:5173/admin/login`
2. Enter the email and password you created
3. You should be redirected to `/admin` dashboard
4. Try accessing `/admin/orders` to verify permissions

### Step 4: Configure Environment Variables

Ensure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
```

## User Roles & Permissions

### Super Admin
- Full access to all features
- Can create/edit/delete products
- Can manage all orders
- Can add/remove other admins
- Access to audit logs

### Admin
- Can create/edit/delete products
- Can manage all orders
- Cannot manage other admins

### Manager
- Can edit products (no delete)
- Can update order status
- Read-only access to admin users

### Viewer
- Read-only access to products
- Read-only access to orders
- Cannot make any changes

## Customizing Permissions

Edit permissions for a user:

```sql
UPDATE public.admin_users
SET permissions = '{"products": true, "orders": false, "users": false}'::jsonb
WHERE email = 'user@example.com';
```

## Security Best Practices

### 1. **Strong Passwords**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Use a password manager

### 2. **Row Level Security (RLS)**
- All tables have RLS enabled
- Policies enforce role-based access
- Database-level security (not just app-level)

### 3. **Audit Logging**
- All admin actions are logged
- Track who did what and when
- Review logs regularly

### 4. **Session Management**
- Sessions expire after inactivity
- Automatic logout on browser close
- Refresh tokens for extended sessions

## Troubleshooting

### Issue: "Cannot read properties of undefined (reading 'email')"
**Solution:** Make sure you're logged in and the AuthProvider is wrapping your app.

### Issue: "User not authorized" when accessing admin pages
**Solution:** 
1. Check if user exists in `admin_users` table
2. Verify `is_active = true`
3. Check permissions JSON

### Issue: "Failed to fetch products/orders"
**Solution:**
1. Verify RLS policies are created
2. Check if user is authenticated
3. Review browser console for errors

### Issue: Mobile layout issues
**Solution:**
1. Clear browser cache
2. Test in incognito mode
3. Check responsive breakpoints (sm: 640px, md: 768px, lg: 1024px)

## API Routes

### Public Routes
- `/` - Home page
- `/products` - Product listing
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page

### Protected Routes (Require Authentication)
- `/admin` - Admin dashboard (product management)
- `/admin/orders` - Order management
- `/admin/login` - Admin login page (public)

## Adding More Admins

### Via SQL:
```sql
-- First, create user in Supabase Auth Dashboard
-- Then add to admin_users:
INSERT INTO public.admin_users (user_id, email, role, permissions)
VALUES (
  'user-uuid-from-auth',
  'newadmin@example.com',
  'admin',
  '{"products": true, "orders": true, "users": false}'::jsonb
);
```

### Future Enhancement:
Create an admin user management UI at `/admin/users` where super_admins can:
- Invite new admins via email
- Set roles and permissions
- Deactivate users
- View audit logs

## Mobile Responsiveness

### Breakpoints Used:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl)

### Optimizations:
- Stacked layouts on mobile
- Collapsible tables
- Touch-friendly buttons (min 44x44px)
- Reduced text on small screens
- Horizontal scrolling for tables

## Next Steps

1. **Email Notifications**
   - Set up Supabase Edge Functions
   - Send order confirmation emails
   - Admin notification for new orders

2. **Two-Factor Authentication (2FA)**
   - Add TOTP support
   - SMS verification
   - Backup codes

3. **Admin User Management UI**
   - Create `/admin/users` page
   - Invite system
   - Permission editor

4. **Advanced Audit Logging**
   - Export logs to CSV
   - Filter by date/user/action
   - Real-time notifications

5. **API Rate Limiting**
   - Prevent brute force attacks
   - Limit login attempts
   - IP-based throttling

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase logs in the dashboard
3. Check browser console for errors
4. Review the `PROJECT_AUDIT_AND_RECOMMENDATIONS.md` file

## Security Checklist

- [ ] Admin users created in `admin_users` table
- [ ] Strong passwords enforced
- [ ] RLS policies verified
- [ ] Environment variables secured
- [ ] HTTPS enabled in production
- [ ] Regular security audits scheduled
- [ ] Backup strategy in place
- [ ] Audit logs reviewed monthly

---

**Last Updated:** December 3, 2025  
**Version:** 1.0
