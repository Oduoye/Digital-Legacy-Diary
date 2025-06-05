/*
  # Update RLS policies for user registration

  1. Changes
    - Remove duplicate policies for user profile creation
    - Add policy for anon users to create their profile during registration
    - Update existing policies to be more specific

  2. Security
    - Ensures only the user can create their own profile
    - Maintains existing security for authenticated users
*/

-- First, clean up duplicate policies
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile during registration" ON users;
DROP POLICY IF EXISTS "Users can insert own profile during registration" ON users;
DROP POLICY IF EXISTS "Enable insert for new user registration" ON users;

-- Create a single, clear policy for user registration
CREATE POLICY "Enable insert for new user registration"
ON users
FOR INSERT
TO anon, authenticated
WITH CHECK (auth.uid() = id);