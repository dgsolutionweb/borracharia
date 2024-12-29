/*
  # Add inventory movements function

  1. New Functions
    - get_inventory_movements: Returns recent inventory movements with product and user details
*/

CREATE OR REPLACE FUNCTION get_inventory_movements(limit_count int DEFAULT 50)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        im.id,
        p.description as product_description,
        im.movement_type,
        im.quantity,
        im.created_at,
        pr.name as created_by_name
      FROM inventory_movements im
      JOIN products p ON p.id = im.product_id
      JOIN profiles pr ON pr.id = im.created_by
      ORDER BY im.created_at DESC
      LIMIT limit_count
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;