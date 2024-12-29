/*
  # Fix revenue reporting function

  1. Changes
    - Drop existing function to ensure clean slate
    - Recreate get_revenue_by_date function with proper parameter handling
    - Add proper error handling and validation
*/

-- First drop the existing function if it exists
DROP FUNCTION IF EXISTS get_revenue_by_date(int);

-- Recreate the function with proper parameter handling
CREATE OR REPLACE FUNCTION get_revenue_by_date(p_days int DEFAULT 30)
RETURNS json AS $$
DECLARE
  v_result json;
  v_start_date date;
BEGIN
  -- Input validation
  IF p_days <= 0 THEN
    RAISE EXCEPTION 'Number of days must be positive';
  END IF;

  -- Calculate start date
  v_start_date := CURRENT_DATE - (p_days - 1) * interval '1 day';

  -- Generate result
  WITH daily_revenue AS (
    SELECT 
      date_trunc('day', created_at)::date as date,
      SUM(total_amount) as revenue
    FROM service_orders
    WHERE status = 'completed'
    AND created_at >= v_start_date
    GROUP BY date_trunc('day', created_at)::date
  ),
  date_series AS (
    SELECT generate_series(
      v_start_date,
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
  ) INTO v_result
  FROM date_series ds
  LEFT JOIN daily_revenue dr ON dr.date = ds.date;

  -- Handle case where no data is found
  IF v_result IS NULL THEN
    v_result := '[]'::json;
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;