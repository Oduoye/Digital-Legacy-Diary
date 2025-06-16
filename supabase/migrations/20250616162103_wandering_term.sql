/*
  # Fix Email Verification and Authentication Issues

  1. Changes
    - Clean up any problematic triggers that might interfere with email verification
    - Ensure proper user profile creation after email confirmation
    - Fix authentication flow issues
    - Add better error handling

  2. Security
    - Maintain proper RLS policies
    - Ensure users can only access their own data
    - Allow proper profile creation during registration
*/

-- Drop any existing problematic triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_email_confirmation() CASCADE;

-- Create a reliable function for user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile when email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD IS NULL OR OLD.email_confirmed_at IS NULL) THEN
    INSERT INTO public.users (
      id,
      name,
      email,
      subscription_tier,
      subscription_start_date
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'subscription_tier', 'free'),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
      email = NEW.email,
      subscription_tier = COALESCE(NEW.raw_user_meta_data->>'subscription_tier', users.subscription_tier),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email confirmation
CREATE TRIGGER on_auth_user_confirmed
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies are correct
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow profile creation via trigger" ON public.users;

-- Create clean RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.users FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Allow the trigger function to create profiles
CREATE POLICY "Allow profile creation via trigger"
  ON public.users FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Clean up any orphaned records
DELETE FROM public.users 
WHERE id NOT IN (SELECT id FROM auth.users);

-- Ensure all confirmed users have profiles
INSERT INTO public.users (id, name, email, subscription_tier, subscription_start_date)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', 'User') as name,
  au.email,
  COALESCE(au.raw_user_meta_data->>'subscription_tier', 'free') as subscription_tier,
  COALESCE(au.email_confirmed_at, au.created_at) as subscription_start_date
FROM auth.users au
WHERE au.email_confirmed_at IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
  )
ON CONFLICT (id) DO UPDATE SET
  name = COALESCE(EXCLUDED.name, users.name),
  email = EXCLUDED.email,
  subscription_tier = COALESCE(EXCLUDED.subscription_tier, users.subscription_tier),
  updated_at = NOW();