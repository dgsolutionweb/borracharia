/*
  # Funções do módulo de Ordens de Serviço

  1. Funções
    - Listagem de ordens de serviço
    - Busca de ordens de serviço
    - Detalhes da ordem de serviço
*/

-- Função para listar ordens de serviço
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
      JOIN customers c ON c.id = so.customer_id
      ORDER BY so.created_at DESC
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar ordens de serviço
CREATE OR REPLACE FUNCTION search_service_orders(search_term text)
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
      JOIN customers c ON c.id = so.customer_id
      WHERE 
        c.name ILIKE '%' || search_term || '%'
        OR CAST(so.number AS text) = search_term
        OR so.vehicle_plate ILIKE '%' || search_term || '%'
      ORDER BY so.created_at DESC
      LIMIT 10
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;