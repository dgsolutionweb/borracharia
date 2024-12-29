-- Drop existing policies if any
DROP POLICY IF EXISTS "Service orders are viewable by all users" ON service_orders;
DROP POLICY IF EXISTS "Service orders are editable by admins" ON service_orders;

-- Create new policies for service_orders
CREATE POLICY "Anyone can view service orders"
  ON service_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create service orders"
  ON service_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update service orders"
  ON service_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete service orders"
  ON service_orders FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for service_order_products
CREATE POLICY "Anyone can view service order products"
  ON service_order_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create service order products"
  ON service_order_products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for service_order_services
CREATE POLICY "Anyone can view service order services"
  ON service_order_services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create service order services"
  ON service_order_services FOR INSERT
  TO authenticated
  WITH CHECK (true);