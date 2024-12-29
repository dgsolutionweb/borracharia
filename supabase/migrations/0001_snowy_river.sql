/*
  # Schema inicial BF Borracharia

  1. Tabelas Principais
    - users (autenticação e perfis de usuário)
    - customers (cadastro de clientes)
    - products (cadastro de produtos/mercadorias)
    - services (cadastro de serviços)
    - service_orders (ordens de serviço)
    - inventory_movements (movimentações de estoque)
    - payments (registros de pagamentos)

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas de acesso baseadas em função do usuário
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Enum para status de OS
CREATE TYPE service_order_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- Enum para tipo de pagamento
CREATE TYPE payment_method AS ENUM ('cash', 'credit_card', 'debit_card', 'pix', 'bank_slip');

-- Enum para tipo de movimento de estoque
CREATE TYPE inventory_movement_type AS ENUM ('in', 'out');

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'employee')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  document text UNIQUE,
  email text,
  phone text NOT NULL,
  address text,
  latitude numeric,
  longitude numeric,
  vehicle_plate text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  barcode text UNIQUE,
  brand text NOT NULL,
  model text,
  cost_price numeric NOT NULL,
  sale_price numeric NOT NULL,
  min_stock integer DEFAULT 0,
  current_stock integer DEFAULT 0,
  supplier text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  estimated_time interval,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de ordens de serviço
CREATE TABLE IF NOT EXISTS service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number serial UNIQUE,
  customer_id uuid REFERENCES customers(id),
  vehicle_plate text,
  status service_order_status DEFAULT 'open',
  total_amount numeric DEFAULT 0,
  observations text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de itens da OS (produtos)
CREATE TABLE IF NOT EXISTS service_order_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES service_orders(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de serviços da OS
CREATE TABLE IF NOT EXISTS service_order_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES service_orders(id),
  service_id uuid REFERENCES services(id),
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de movimentações de estoque
CREATE TABLE IF NOT EXISTS inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  movement_type inventory_movement_type NOT NULL,
  quantity integer NOT NULL,
  reference_id uuid, -- ID da OS ou outro documento
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES service_orders(id),
  amount numeric NOT NULL,
  payment_method payment_method NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança

-- Profiles: apenas admins podem criar/editar, todos podem visualizar
CREATE POLICY "Profiles are viewable by all users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Profiles are insertable by admins only"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Customers: todos os usuários autenticados podem visualizar e editar
CREATE POLICY "Customers are viewable by all users"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers are editable by all users"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Products: todos podem visualizar, apenas admin edita
CREATE POLICY "Products are viewable by all users"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Products are editable by admins"
  ON products FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Funções e triggers para atualização automática de estoque
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.movement_type = 'in' THEN
      UPDATE products 
      SET current_stock = current_stock + NEW.quantity
      WHERE id = NEW.product_id;
    ELSE
      UPDATE products 
      SET current_stock = current_stock - NEW.quantity
      WHERE id = NEW.product_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_stock
AFTER INSERT ON inventory_movements
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

-- Função para calcular o total da OS
CREATE OR REPLACE FUNCTION calculate_service_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE service_orders
  SET total_amount = (
    SELECT COALESCE(SUM(total_price), 0)
    FROM service_order_products
    WHERE service_order_id = NEW.service_order_id
  ) + (
    SELECT COALESCE(SUM(price), 0)
    FROM service_order_services
    WHERE service_order_id = NEW.service_order_id
  )
  WHERE id = NEW.service_order_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_service_order_total_products
AFTER INSERT OR UPDATE OR DELETE ON service_order_products
FOR EACH ROW
EXECUTE FUNCTION calculate_service_order_total();

CREATE TRIGGER trigger_calculate_service_order_total_services
AFTER INSERT OR UPDATE OR DELETE ON service_order_services
FOR EACH ROW
EXECUTE FUNCTION calculate_service_order_total();