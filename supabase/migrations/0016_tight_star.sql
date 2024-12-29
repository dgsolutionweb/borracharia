-- Fix profiles table and policies
ALTER TABLE profiles ALTER COLUMN name DROP NOT NULL;

-- Update service orders policies to allow status updates by any authenticated user
DROP POLICY IF EXISTS "Service orders are updatable by authenticated users" ON service_orders;

CREATE POLICY "Service orders are updatable by any authenticated user"
  ON service_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to get service orders with proper joins
CREATE OR REPLACE FUNCTION get_service_orders()
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        so.id,
        so.number,
        c.name as customer_name,
        so.vehicle_plate,
        so.status,
        so.total_amount,
        so.created_at
      FROM service_orders so
      LEFT JOIN customers c ON c.id = so.customer_id
      ORDER BY so.created_at DESC
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;