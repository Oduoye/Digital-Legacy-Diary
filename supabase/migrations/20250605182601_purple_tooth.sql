/*
  # Update Users Table RLS Policy

  1. Changes
    - Add RLS policy to allow new user registration
    - Policy ensures users can only insert their own data
    - Maintains security while enabling registration flow

  2. Security
    - Adds INSERT policy for authenticated and anonymous users
    - Users can only insert rows where their auth.uid matches the row id
    - Maintains existing RLS policies
*/

-- First ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing insert policy if it exists to avoid conflicts
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Enable insert for new user registration'
    ) THEN
        DROP POLICY "Enable insert for new user registration" ON users;
    END IF;
END $$;

-- Create new insert policy that allows registration
CREATE POLICY "Enable insert for new user registration"
ON users
FOR INSERT
TO public
WITH CHECK (
    -- Ensure the user can only insert a row with their own ID
    auth.uid() = id
);