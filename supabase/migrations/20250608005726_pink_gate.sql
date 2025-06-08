/*
  # Fix Authentication Flow Issues

  1. Changes
    - Remove any problematic triggers or functions that might interfere with login
    - Clean up and recreate proper RLS policies for users table
    - Ensure proper user profile creation flow
    - Fix any database consistency issues

  2. Security
    - Maintain proper RLS policies for data protection
    - Ensure users can only access their own data
    - Allow proper profile creation during registration
*/

-- First, let's clean up any problematic triggers or functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_deletion();
DROP FUNCTION IF EXISTS public.delete_user_data();

-- Drop all existing policies on users table to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile during registration" ON users;
DROP POLICY IF EXISTS "Enable insert for new user registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;

-- Ensure RLS is enabled on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create clean, simple RLS policies for users table
CREATE POLICY "Users can view their own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
ON users
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Ensure proper permissions are granted
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.trusted_contacts TO authenticated;
GRANT ALL ON public.diary_entries TO authenticated;
GRANT ALL ON public.wills TO authenticated;
GRANT ALL ON public.dead_mans_switches TO authenticated;

-- Create a simple function to handle new user registration (optional, for consistency)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile if it doesn't already exist and user is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    INSERT INTO public.users (
      id,
      name,
      email,
      subscription_tier,
      subscription_start_date
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'subscription_tier', 'free'),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration (only when email is confirmed)
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

-- Check for any orphaned records and clean them up
-- Remove any users in public.users that don't have corresponding auth.users
DELETE FROM public.users 
WHERE id NOT IN (SELECT id FROM auth.users);

-- Ensure all verified auth.users have corresponding public.users records
INSERT INTO public.users (id, name, email, subscription_tier, subscription_start_date)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', 'User') as name,
  au.email,
  COALESCE(au.raw_user_meta_data->>'subscription_tier', 'free') as subscription_tier,
  COALESCE(au.created_at, NOW()) as subscription_start_date
FROM auth.users au
WHERE au.email_confirmed_at IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id);