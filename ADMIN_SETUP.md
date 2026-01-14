# Admin Setup Guide

Your database is now fully configured! Follow these steps to set up admin access:

## Step 1: Register Your Account

1. Start the development server (it should auto-start)
2. Go to http://localhost:8080
3. Click "Join Free" or navigate to `/register`
4. Create your account with your email and password

## Step 2: Make Yourself Admin

After registering, run this SQL query in your Supabase SQL Editor:

```sql
-- Replace 'your-email@example.com' with your actual email
SELECT public.make_user_admin('your-email@example.com');
```

Or use this alternative method:

```sql
-- Manual method: Replace with your email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

## Step 3: Verify Admin Status

Check if you're an admin:

```sql
SELECT public.check_admin_status('your-email@example.com');
```

## Step 4: Access Admin Panel

1. Sign out and sign back in (to refresh your session)
2. Navigate to: http://localhost:8080/admin/login
3. Sign in with your credentials
4. You should now access the admin dashboard!

## Admin Features

Once logged in as admin, you can:
- **Dashboard** (`/admin`) - View statistics and overview
- **Recipes** (`/admin/recipes`) - Create, edit, and delete recipes
- **Reviews** (`/admin/reviews`) - Moderate user reviews
- **Users** (`/admin/users`) - View all registered users
- **Web Scraper** (`/admin/scraper`) - Automated recipe collection tool

## Troubleshooting

If you can't access the admin panel:

1. **Check your admin status:**
   ```sql
   SELECT * FROM public.user_roles WHERE role = 'admin';
   ```

2. **Verify the has_role function:**
   ```sql
   SELECT public.has_role(
     (SELECT id FROM auth.users WHERE email = 'your-email@example.com'),
     'admin'
   );
   ```
   Should return `true`

3. **Clear your browser cache and cookies**
4. **Sign out completely and sign back in**

## Database Schema

Your database includes:
- ✅ **profiles** - User profiles
- ✅ **user_roles** - Role management (user/admin)
- ✅ **recipes** - Recipe collection (8 sample recipes included)
- ✅ **reviews** - User reviews and ratings
- ✅ **bookmarks** - User favorites

All tables have proper RLS (Row Level Security) policies!
