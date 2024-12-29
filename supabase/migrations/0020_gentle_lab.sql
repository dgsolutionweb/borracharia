/*
  # Add Service Orders Report Function
  
  Creates a function to generate comprehensive service order reports including:
  - Summary by status (count and total amounts)
  - Detailed order information with services and products
*/

CREATE OR REPLACE FUNCTION get_service_orders_report(
  start_date timestamptz,
  end_date timestamptz
)
RETURNS json AS $$
BEGIN
  RETURN json_build_object(
    'orders_by_status', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT 
          status,
          COUNT(*) as count,
          COALESCE(SUM(total_amount), 0) as total_amount
        FROM service_orders
        WHERE created_at >= start_date
        AND created_at <= end_date
        GROUP BY status
        ORDER BY status
      ) t
    ),
    'orders_details', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT 
          so.number,
          c.name as customer_name,
          so.created_at,
          so.status,
          so.total_amount,
          (
            SELECT json_agg(row_to_json(s))
            FROM (
              SELECT 
                s.description,
                sos.price
              FROM service_order_services sos
              JOIN services s ON s.id = sos.service_id
              WHERE sos.service_order_id = so.id
            ) s
          ) as services,
          (
            SELECT json_agg(row_to_json(p))
            FROM (
              SELECT 
                p.description,
                sop.quantity,
                sop.unit_price,
                sop.total_price
              FROM service_order_products sop
              JOIN products p ON p.id = sop.product_id
              WHERE sop.service_order_id = so.id
            ) p
          ) as products
        FROM service_orders so
        LEFT JOIN customers c ON c.id = so.customer_id
        WHERE so.created_at >= start_date
        AND so.created_at <= end_date
        ORDER BY so.created_at DESC
      ) t
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;