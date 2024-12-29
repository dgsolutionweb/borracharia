/*
  # Add Financial Metrics Functions

  1. New Functions
    - get_financial_metrics: Returns revenue, costs, and profit metrics
    - get_detailed_revenue: Returns revenue breakdown by services and products
    - get_cost_metrics: Returns cost of goods sold (COGS) and operational costs
*/

-- Function to get financial metrics with date range
CREATE OR REPLACE FUNCTION get_financial_metrics(
  start_date timestamptz DEFAULT CURRENT_DATE - interval '30 days',
  end_date timestamptz DEFAULT CURRENT_DATE
)
RETURNS json AS $$
DECLARE
  v_result json;
BEGIN
  WITH revenue_data AS (
    SELECT
      COALESCE(SUM(total_amount), 0) as total_revenue,
      COUNT(*) as total_orders
    FROM service_orders
    WHERE status = 'completed'
    AND created_at >= start_date
    AND created_at <= end_date
  ),
  product_costs AS (
    SELECT
      COALESCE(SUM(sop.quantity * p.cost_price), 0) as total_product_costs
    FROM service_order_products sop
    JOIN products p ON p.id = sop.product_id
    JOIN service_orders so ON so.id = sop.service_order_id
    WHERE so.status = 'completed'
    AND so.created_at >= start_date
    AND so.created_at <= end_date
  )
  SELECT json_build_object(
    'total_revenue', rd.total_revenue,
    'total_orders', rd.total_orders,
    'average_ticket', CASE 
      WHEN rd.total_orders > 0 
      THEN rd.total_revenue / rd.total_orders 
      ELSE 0 
    END,
    'total_costs', pc.total_product_costs,
    'gross_profit', rd.total_revenue - pc.total_product_costs,
    'gross_margin', CASE 
      WHEN rd.total_revenue > 0 
      THEN ((rd.total_revenue - pc.total_product_costs) / rd.total_revenue * 100)
      ELSE 0 
    END
  ) INTO v_result
  FROM revenue_data rd, product_costs pc;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get revenue breakdown
CREATE OR REPLACE FUNCTION get_revenue_breakdown(
  start_date timestamptz DEFAULT CURRENT_DATE - interval '30 days',
  end_date timestamptz DEFAULT CURRENT_DATE
)
RETURNS json AS $$
BEGIN
  RETURN json_build_object(
    'services', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT 
          s.description,
          COUNT(*) as service_count,
          SUM(sos.price) as total_revenue
        FROM service_order_services sos
        JOIN services s ON s.id = sos.service_id
        JOIN service_orders so ON so.id = sos.service_order_id
        WHERE so.status = 'completed'
        AND so.created_at >= start_date
        AND so.created_at <= end_date
        GROUP BY s.id, s.description
        ORDER BY total_revenue DESC
      ) t
    ),
    'products', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT 
          p.description,
          SUM(sop.quantity) as quantity_sold,
          SUM(sop.total_price) as total_revenue,
          SUM(sop.quantity * p.cost_price) as total_cost,
          SUM(sop.total_price - (sop.quantity * p.cost_price)) as profit
        FROM service_order_products sop
        JOIN products p ON p.id = sop.product_id
        JOIN service_orders so ON so.id = sop.service_order_id
        WHERE so.status = 'completed'
        AND so.created_at >= start_date
        AND so.created_at <= end_date
        GROUP BY p.id, p.description
        ORDER BY total_revenue DESC
      ) t
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;