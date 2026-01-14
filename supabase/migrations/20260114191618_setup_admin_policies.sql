/*
  # Complete Admin Setup and Policies
  
  1. Admin Policies
    - Admins can delete any review (moderation)
    - Admins can view all user roles
    - Admins can manage user roles
  
  2. Helper Functions
    - Function to promote user to admin
    - Function to check if email is admin
  
  3. Security
    - Secure admin role management
    - Proper RLS policies for all admin operations
*/

-- Admin policies for reviews (moderation)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'reviews' 
    AND policyname = 'Admins can delete any review'
  ) THEN
    CREATE POLICY "Admins can delete any review" 
      ON public.reviews 
      FOR DELETE 
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Admin policies for user_roles (viewing and management)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_roles' 
    AND policyname = 'Admins can view all roles'
  ) THEN
    CREATE POLICY "Admins can view all roles" 
      ON public.user_roles 
      FOR SELECT 
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_roles' 
    AND policyname = 'Admins can manage roles'
  ) THEN
    CREATE POLICY "Admins can manage roles" 
      ON public.user_roles 
      FOR ALL 
      USING (public.has_role(auth.uid(), 'admin')) 
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Function to promote user to admin by email
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  role_exists BOOLEAN;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'Error: User not found with email: ' || user_email;
  END IF;
  
  -- Check if already admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = target_user_id AND role = 'admin'
  ) INTO role_exists;
  
  IF role_exists THEN
    RETURN 'User ' || user_email || ' is already an admin';
  END IF;
  
  -- Add admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN 'Successfully made ' || user_email || ' an admin';
END;
$$;

-- Function to check admin status by email (for debugging)
CREATE OR REPLACE FUNCTION public.check_admin_status(user_email TEXT)
RETURNS TABLE(email TEXT, is_admin BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.email,
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = u.id AND ur.role = 'admin'
    ) as is_admin
  FROM auth.users u
  WHERE u.email = user_email;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.make_user_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_admin_status(TEXT) TO authenticated;
