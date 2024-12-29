/*
  # Fix Products RLS Policies

  1. Changes
    - Drop existing RLS policies for products table
    - Add new policies for CRUD operations on products
    
  2. Security
    - Enable RLS on products table
    - Add policies for authenticated users to:
      - View all products
      - Create new products
      - Update existing products
      - Delete products
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Products are viewable by all users" ON products;
DROP POLICY IF EXISTS "Products are editable by admins" ON products;

-- Create new policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);