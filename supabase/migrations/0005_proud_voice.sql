/*
  # Funções do módulo de Serviços

  1. Funções
    - Listagem de serviços
    - Busca de serviços
    - Serviços mais realizados
*/

-- Função para listar serviços
CREATE OR REPLACE FUNCTION get_services()
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        id,
        description,
        estimated_time,
        price
      FROM services
      ORDER BY description
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar serviços
CREATE OR REPLACE FUNCTION search_services(search_term text)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        id,
        description,
        estimated_time,
        price
      FROM services
      WHERE description ILIKE '%' || search_term || '%'
      ORDER BY description
      LIMIT 10
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;