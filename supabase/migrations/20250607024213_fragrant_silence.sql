/*
  # Fix Users Table RLS Policies

  1. Changes
    - Remove problematic INSERT policy that allowed duplicate entries
    - Create proper INSERT policy that prevents duplicates
    - Add DELETE policy for account deletion
    - Ensure proper access control for all operations

  2. Security
    - Users can only create their own profile (matching auth.uid)
    - Users can only read, update, and delete their own data
    - Prevents duplicate user entries
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Enable insert for new user registration" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create proper INSERT policy that prevents duplicates
CREATE POLICY "Users can create own profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create SELECT policy
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create UPDATE policy
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create DELETE policy for account deletion
CREATE POLICY "Users can delete own profile"
ON users
FOR DELETE
TO authenticated
USING (auth.uid() = id);