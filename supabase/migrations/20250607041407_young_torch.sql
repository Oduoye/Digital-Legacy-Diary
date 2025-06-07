/*
  # Restore Working Authentication System

  1. Changes
    - Remove complex trigger system that's causing issues
    - Restore simple, working RLS policies
    - Fix user registration flow

  2. Security
    - Simple RLS policies that work reliably
    - Allow user registration without complex triggers
    - Maintain data security
*/

-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for own profile" ON users;
DROP POLICY IF EXISTS "Enable delete for own profile" ON users;

-- Create simple, working RLS policies
CREATE POLICY "Users can read own data"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own data"
ON users
FOR DELETE
TO authenticated
USING (auth.uid() = id);