/*
  # Funções do módulo de Produtos

  1. Funções
    - Listagem de produtos
    - Busca de produtos
    - Produtos com estoque baixo
*/

-- Função para listar produtos
CREATE OR REPLACE FUNCTION get_products()
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        id,
        description,
        barcode,
        brand,
        model,
        cost_price,
        sale_price,
        min_stock,
        current_stock,
        supplier
      FROM products
      ORDER BY description
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar produtos
CREATE OR REPLACE FUNCTION search_products(search_term text)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        id,
        description,
        barcode,
        brand,
        model,
        sale_price,
        current_stock
      FROM products
      WHERE 
        description ILIKE '%' || search_term || '%'
        OR barcode ILIKE '%' || search_term || '%'
        OR brand ILIKE '%' || search_term || '%'
        OR model ILIKE '%' || search_term || '%'
      ORDER BY description
      LIMIT 10
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para listar produtos com estoque baixo
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(row_to_json(t))
    FROM (
      SELECT 
        id,
        description,
        brand,
        model,
        current_stock,
        min_stock
      FROM products
      WHERE current_stock <= min_stock
      ORDER BY (current_stock - min_stock)
    ) t
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;