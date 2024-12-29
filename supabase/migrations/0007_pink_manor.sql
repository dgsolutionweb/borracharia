/*
  # Fix revenue query and add missing functions

  1. Changes
    - Fix nested aggregate in get_revenue_by_date function
    - Add missing auth functions
*/

-- Fix revenue by date function to avoid nested aggregates
CREATE OR REPLACE FUNCTION get_revenue_by_date(days int DEFAULT 30)
RETURNS json AS $$
BEGIN
  RETURN (
    WITH daily_revenue AS (
      SELECT 
        date_trunc('day', created_at)::date as date,
        SUM(total_amount) as revenue
      FROM service_orders
      WHERE status = 'completed'
      AND created_at >= CURRENT_DATE - (days - 1) * interval '1 day'
      GROUP BY date_trunc('day', created_at)::date
    )
    SELECT json_agg(
      json_build_object(
        'date', TO_CHAR(d.date, 'DD/MM'),
        'revenue', COALESCE(dr.revenue, 0)
      )
      ORDER BY d.date
    )
    FROM generate_series(
      CURRENT_DATE - (days - 1) * interval '1 day',
      CURRENT_DATE,
      interval '1 day'
    )::date d
    LEFT JOIN daily_revenue dr ON dr.date = d.date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;