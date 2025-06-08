/*
  # Fix Email Verification Issues

  This migration addresses issues with email verification processing by:
  1. Removing any problematic triggers on auth.users
  2. Ensuring proper RLS policies don't interfere with verification
  3. Creating a proper user profile creation trigger
  4. Adding debugging capabilities

  ## Changes Made:
  1. Clean up any existing problematic triggers
  2. Create a safe trigger for profile creation
  3. Ensure RLS policies don't block verification
  4. Add verification debugging
*/

-- Drop any existing problematic triggers that might interfere with email verification
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create a safe function to handle new user profile creation
-- This only creates profiles AFTER email is confirmed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile if email is confirmed and no profile exists yet
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
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
    ON CONFLICT (id) DO NOTHING; -- Prevent duplicate creation
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that only fires on UPDATE (when email gets confirmed)
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure RLS is properly configured and doesn't interfere with verification
-- Temporarily disable RLS on users table to check if it's causing issues
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with clean policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.users;

-- Create clean, simple RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.users FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Allow the trigger function to insert profiles (service role access)
CREATE POLICY "Allow profile creation via trigger"
  ON public.users FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Ensure all verified users have profiles
-- This fixes any existing users who might be missing profiles
INSERT INTO public.users (
  id,
  name,
  email,
  subscription_tier,
  subscription_start_date
)
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
  );

-- Create a function to check verification status (for debugging)
CREATE OR REPLACE FUNCTION public.check_user_verification_status(user_email text)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'auth_user_exists', EXISTS(SELECT 1 FROM auth.users WHERE email = user_email),
    'email_confirmed', (SELECT email_confirmed_at IS NOT NULL FROM auth.users WHERE email = user_email),
    'email_confirmed_at', (SELECT email_confirmed_at FROM auth.users WHERE email = user_email),
    'profile_exists', EXISTS(SELECT 1 FROM public.users u JOIN auth.users au ON u.id = au.id WHERE au.email = user_email),
    'created_at', (SELECT created_at FROM auth.users WHERE email = user_email)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;