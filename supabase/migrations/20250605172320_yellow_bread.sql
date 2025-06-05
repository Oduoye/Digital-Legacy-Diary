/*
  # Add Users Insert Policy
  
  1. Changes
    - Add RLS policy to allow users to insert their own profile during registration
    
  2. Security
    - Policy ensures users can only create their own profile
    - Matches auth.uid() with the row id being inserted
*/

CREATE POLICY "Users can create their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);