/*
  # Fix Service Orders Report Function
  
  Adds COALESCE to handle null arrays and ensures proper date handling
*/

CREATE OR REPLACE FUNCTION get_service_orders_report(
  start_date timestamptz,
  end_date timestamptz
)
RETURNS json AS $$
BEGIN
  RETURN json_build_object(
    'orders_by_status', COALESCE(
      (
        SELECT json_agg(row_to_json(t))
        FROM (
          SELECT 
            status,
            COUNT(*) as count,
            COALESCE(SUM(total_amount), 0) as total_amount
          FROM service_orders
          WHERE created_at >= start_date
          AND created_at < end_date + interval '1 day'
          GROUP BY status
          ORDER BY status
        ) t
      ),
      '[]'::json
    ),
    'orders_details', COALESCE(
      (
        SELECT json_agg(row_to_json(t))
        FROM (
          SELECT 
            so.number,
            COALESCE(c.name, 'Cliente Removido') as customer_name,
            so.created_at,
            so.status,
            so.total_amount,
            COALESCE(
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
              ),
              '[]'::json
            ) as services,
            COALESCE(
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
              ),
              '[]'::json
            ) as products
          FROM service_orders so
          LEFT JOIN customers c ON c.id = so.customer_id
          WHERE so.created_at >= start_date
          AND so.created_at < end_date + interval '1 day'
          ORDER BY so.created_at DESC
        ) t
      ),
      '[]'::json
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;