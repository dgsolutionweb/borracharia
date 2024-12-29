/*
  # Add Financial Metrics Function
  
  Creates a function to calculate detailed financial metrics for service orders
*/

CREATE OR REPLACE FUNCTION get_service_orders_financial_metrics(
  start_date timestamptz,
  end_date timestamptz
)
RETURNS json AS $$
DECLARE
  v_total_orders bigint;
  v_services_revenue numeric;
  v_products_revenue numeric;
  v_products_cost numeric;
  v_total_revenue numeric;
  v_total_services bigint;
  v_total_products bigint;
BEGIN
  -- Get total number of orders
  SELECT COUNT(*) INTO v_total_orders
  FROM service_orders
  WHERE created_at >= start_date
  AND created_at < end_date + interval '1 day'
  AND status = 'completed';

  -- Calculate services revenue
  SELECT COALESCE(SUM(sos.price), 0) INTO v_services_revenue
  FROM service_orders so
  JOIN service_order_services sos ON sos.service_order_id = so.id
  WHERE so.created_at >= start_date
  AND so.created_at < end_date + interval '1 day'
  AND so.status = 'completed';

  -- Calculate products revenue and cost
  SELECT 
    COALESCE(SUM(sop.total_price), 0),
    COALESCE(SUM(sop.quantity * p.cost_price), 0)
  INTO v_products_revenue, v_products_cost
  FROM service_orders so
  JOIN service_order_products sop ON sop.service_order_id = so.id
  JOIN products p ON p.id = sop.product_id
  WHERE so.created_at >= start_date
  AND so.created_at < end_date + interval '1 day'
  AND so.status = 'completed';

  -- Calculate total revenue
  v_total_revenue := v_services_revenue + v_products_revenue;

  -- Count total services and products
  SELECT COUNT(*) INTO v_total_services
  FROM service_orders so
  JOIN service_order_services sos ON sos.service_order_id = so.id
  WHERE so.created_at >= start_date
  AND so.created_at < end_date + interval '1 day'
  AND so.status = 'completed';

  SELECT COUNT(*) INTO v_total_products
  FROM service_orders so
  JOIN service_order_products sop ON sop.service_order_id = so.id
  WHERE so.created_at >= start_date
  AND so.created_at < end_date + interval '1 day'
  AND so.status = 'completed';

  RETURN json_build_object(
    'revenue', json_build_object(
      'total', v_total_revenue,
      'services', v_services_revenue,
      'products', v_products_revenue
    ),
    'costs', json_build_object(
      'total', v_products_cost,
      'products', v_products_cost
    ),
    'profits', json_build_object(
      'gross', v_total_revenue - v_products_cost,
      'margin', CASE 
        WHEN v_total_revenue > 0 
        THEN ((v_total_revenue - v_products_cost) / v_total_revenue * 100)
        ELSE 0 
      END
    ),
    'averages', json_build_object(
      'ticket', CASE 
        WHEN v_total_orders > 0 
        THEN v_total_revenue / v_total_orders 
        ELSE 0 
      END,
      'service_value', CASE 
        WHEN v_total_services > 0 
        THEN v_services_revenue / v_total_services 
        ELSE 0 
      END,
      'product_value', CASE 
        WHEN v_total_products > 0 
        THEN v_products_revenue / v_total_products 
        ELSE 0 
      END
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;