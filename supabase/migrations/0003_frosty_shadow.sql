/*
  # Funções do módulo de Clientes

  1. Funções
    - Listagem de clientes
    - Busca de clientes
    - Histórico de serviços por cliente
*/

-- Função para listar clientes
CREATE OR REPLACE FUNCTION get_customers()
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        id,
        name,
        document,
        email,
        phone,
        address,
        vehicle_plate,
        created_at
      FROM customers
      ORDER BY name
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar clientes
CREATE OR REPLACE FUNCTION search_customers(search_term text)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        id,
        name,
        document,
        email,
        phone,
        address,
        vehicle_plate
      FROM customers
      WHERE 
        name ILIKE '%' || search_term || '%'
        OR document ILIKE '%' || search_term || '%'
        OR email ILIKE '%' || search_term || '%'
        OR phone ILIKE '%' || search_term || '%'
        OR vehicle_plate ILIKE '%' || search_term || '%'
      ORDER BY name
      LIMIT 10
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter histórico de serviços do cliente
CREATE OR REPLACE FUNCTION get_customer_history(customer_id uuid)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        so.number,
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
      WHERE so.customer_id = customer_id
      ORDER BY so.created_at DESC
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;