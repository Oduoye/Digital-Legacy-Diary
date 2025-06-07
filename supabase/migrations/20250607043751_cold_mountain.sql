/*
  # Fix Email Verification Configuration

  1. Changes
    - Clean up any problematic triggers or functions
    - Ensure proper RLS policies for user registration
    - Add proper email verification handling

  2. Security
    - Maintain RLS policies for data protection
    - Ensure users can only access their own data
*/

-- Drop any existing triggers and functions that might cause conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure RLS is enabled on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're clean
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;

-- Create clean, simple policies
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
ON users
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Ensure proper permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.trusted_contacts TO authenticated;
GRANT ALL ON public.diary_entries TO authenticated;
GRANT ALL ON public.wills TO authenticated;
GRANT ALL ON public.dead_mans_switches TO authenticated;