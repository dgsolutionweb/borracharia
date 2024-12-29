/*
  # Fix revenue by date function

  1. Changes
    - Recreate get_revenue_by_date function to fix nested aggregates issue
    - Improve date handling and revenue calculation
    - Add proper parameter handling
*/

-- Fix revenue by date function to avoid nested aggregates
CREATE OR REPLACE FUNCTION get_revenue_by_date(days int DEFAULT 30)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  WITH daily_revenue AS (
    SELECT 
      date_trunc('day', created_at)::date as date,
      SUM(total_amount) as revenue
    FROM service_orders
    WHERE status = 'completed'
    AND created_at >= CURRENT_DATE - (days - 1) * interval '1 day'
    GROUP BY date_trunc('day', created_at)::date
  ),
  date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (days - 1) * interval '1 day',
      CURRENT_DATE,
      interval '1 day'
    )::date as date
  )
  SELECT json_agg(
    json_build_object(
      'date', TO_CHAR(ds.date, 'DD/MM'),
      'revenue', COALESCE(dr.revenue, 0)
    )
    ORDER BY ds.date
  ) INTO result
  FROM date_series ds
  LEFT JOIN daily_revenue dr ON dr.date = ds.date;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;