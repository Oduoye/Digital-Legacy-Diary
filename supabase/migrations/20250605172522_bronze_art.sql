/*
  # Fix users table RLS policies

  1. Changes
    - Add RLS policy to allow new users to create their profile during registration
    
  2. Security
    - Maintains existing RLS policies
    - Adds new policy for user registration
    - Ensures users can only create their own profile with matching auth.uid()
*/

-- Add policy to allow new users to create their profile
CREATE POLICY "Users can create their own profile during registration"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);