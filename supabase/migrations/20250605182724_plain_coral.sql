/*
  # Update Users Table RLS Policies

  1. Changes
    - Add RLS policy to allow new user registration
    - Modify existing policies to ensure proper access control

  2. Security
    - Enable RLS on users table (if not already enabled)
    - Add policy for public registration
    - Maintain existing policies for authenticated users
*/

-- First ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Enable insert for new user registration" ON users;

-- Create new insert policy that allows registration
CREATE POLICY "Enable insert for new user registration"
ON users
FOR INSERT
TO public
WITH CHECK (true);  -- Allow initial registration without auth check

-- Ensure other policies exist and are correct
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);