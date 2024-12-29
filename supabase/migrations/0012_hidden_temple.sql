/*
  # Fix Services RLS Policies

  1. Changes
    - Drop existing RLS policies for services table
    - Add new policies for CRUD operations on services
    
  2. Security
    - Enable RLS on services table
    - Add policies for authenticated users to:
      - View all services
      - Create new services
      - Update existing services
      - Delete services
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Services are viewable by all users" ON services;
DROP POLICY IF EXISTS "Services are editable by admins" ON services;

-- Create new policies
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);