/*
  # Funções do Dashboard

  1. Métricas
    - Faturamento total
    - Total de ordens
    - Total de produtos
    - Total de clientes

  2. Gráficos e Listas
    - Faturamento por período
    - Top serviços
    - Top produtos
    - Ordens recentes
*/

-- Função para métricas do dashboard
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_revenue', COALESCE((
      SELECT SUM(total_amount)
      FROM service_orders
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
      AND status = 'completed'
    ), 0),
    'total_orders', (
      SELECT COUNT(*)
      FROM service_orders
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    ),
    'total_products', (
      SELECT COUNT(*)
      FROM products
    ),
    'total_customers', (
      SELECT COUNT(*)
      FROM customers
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para faturamento por data
CREATE OR REPLACE FUNCTION get_revenue_by_date(days int DEFAULT 30)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(
      json_build_object(
        'date', TO_CHAR(date, 'DD/MM'),
        'revenue', COALESCE(SUM(total_amount), 0)
      )
    )
    FROM (
      SELECT date_trunc('day', d)::date as date
      FROM generate_series(
        CURRENT_DATE - (days - 1) * interval '1 day',
        CURRENT_DATE,
        interval '1 day'
      ) d
    ) dates
    LEFT JOIN service_orders so ON date_trunc('day', so.created_at)::date = dates.date
    AND so.status = 'completed'
    GROUP BY dates.date
    ORDER BY dates.date
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para top serviços
CREATE OR REPLACE FUNCTION get_top_services(limit_count int DEFAULT 5)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        s.description,
        COUNT(*) as total_count,
        SUM(sos.price) as total_revenue
      FROM services s
      JOIN service_order_services sos ON sos.service_id = s.id
      JOIN service_orders so ON so.id = sos.service_order_id
      WHERE so.status = 'completed'
      AND so.created_at >= CURRENT_DATE - interval '30 days'
      GROUP BY s.id, s.description
      ORDER BY total_revenue DESC
      LIMIT limit_count
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para top produtos
CREATE OR REPLACE FUNCTION get_top_products(limit_count int DEFAULT 5)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        p.description,
        SUM(sop.quantity) as total_sold,
        SUM(sop.total_price) as total_revenue
      FROM products p
      JOIN service_order_products sop ON sop.product_id = p.id
      JOIN service_orders so ON so.id = sop.service_order_id
      WHERE so.status = 'completed'
      AND so.created_at >= CURRENT_DATE - interval '30 days'
      GROUP BY p.id, p.description
      ORDER BY total_revenue DESC
      LIMIT limit_count
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para ordens recentes
CREATE OR REPLACE FUNCTION get_recent_orders(limit_count int DEFAULT 5)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        so.number,
        c.name as customer_name,
        so.total_amount,
        so.status,
        so.created_at
      FROM service_orders so
      JOIN customers c ON c.id = so.customer_id
      ORDER BY so.created_at DESC
      LIMIT limit_count
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;