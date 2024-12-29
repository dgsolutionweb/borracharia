-- Enable RLS for all related tables
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_order_services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view service orders" ON service_orders;
DROP POLICY IF EXISTS "Anyone can create service orders" ON service_orders;
DROP POLICY IF EXISTS "Anyone can update service orders" ON service_orders;
DROP POLICY IF EXISTS "Anyone can delete service orders" ON service_orders;

-- Create new policies for service_orders
CREATE POLICY "Service orders are viewable by authenticated users"
  ON service_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service orders are insertable by authenticated users"
  ON service_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Service orders are updatable by authenticated users"
  ON service_orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Policies for service_order_products
CREATE POLICY "Service order products are viewable by authenticated users"
  ON service_order_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service order products are insertable by authenticated users"
  ON service_order_products FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM service_orders
    WHERE id = service_order_id AND created_by = auth.uid()
  ));

-- Policies for service_order_services
CREATE POLICY "Service order services are viewable by authenticated users"
  ON service_order_services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service order services are insertable by authenticated users"
  ON service_order_services FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM service_orders
    WHERE id = service_order_id AND created_by = auth.uid()
  ));