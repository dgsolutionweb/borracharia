/*
  # Add RLS policies for inventory movements

  1. Security
    - Enable RLS on inventory_movements table
    - Add policies for authenticated users to:
      - View all inventory movements
      - Create new inventory movements
      - Update their own inventory movements
*/

-- Enable RLS
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Inventory movements are viewable by authenticated users"
  ON inventory_movements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Inventory movements are insertable by authenticated users"
  ON inventory_movements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Inventory movements are updatable by creators"
  ON inventory_movements FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Inventory movements are deletable by creators"
  ON inventory_movements FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);