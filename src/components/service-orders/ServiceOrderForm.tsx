import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { CustomerSelect } from './form/CustomerSelect';
import { ProductSelect } from './form/ProductSelect';
import { ServiceSelect } from './form/ServiceSelect';
import { ServiceOrderItems } from './form/ServiceOrderItems';
import { Input } from '../ui/Input';

interface ServiceOrderFormProps {
  onClose: () => void;
  onSave?: () => void;
  order?: {
    id: string;
    number: number;
    customer_name: string;
    vehicle_plate: string | null;
    status: string;
    total_amount: number;
  };
}

interface OrderItem {
  type: 'service' | 'product';
  id: string;
  description: string;
  price: number;
  quantity?: number;
}

export function ServiceOrderForm({ onClose, onSave, order }: ServiceOrderFormProps) {
  const { user } = useAuth();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState(order?.vehicle_plate || '');
  const [observations, setObservations] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order?.id) {
      // Fetch order details including items
      const fetchOrderDetails = async () => {
        const { data: orderProducts } = await supabase
          .from('service_order_products')
          .select('product_id, quantity, unit_price, products(description)')
          .eq('service_order_id', order.id);

        const { data: orderServices } = await supabase
          .from('service_order_services')
          .select('service_id, price, services(description)')
          .eq('service_order_id', order.id);

        const products = orderProducts?.map(op => ({
          type: 'product' as const,
          id: op.product_id,
          description: op.products?.description || '',
          price: op.unit_price,
          quantity: op.quantity
        })) || [];

        const services = orderServices?.map(os => ({
          type: 'service' as const,
          id: os.service_id,
          description: os.services?.description || '',
          price: os.price
        })) || [];

        setItems([...products, ...services]);
      };

      fetchOrderDetails();
    }
  }, [order?.id]);

  const handleAddItem = (item: OrderItem) => {
    setItems([...items, item]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!customerId && !order) {
      toast.error('Selecione um cliente');
      return;
    }

    if (items.length === 0) {
      toast.error('Adicione pelo menos um item');
      return;
    }

    try {
      setIsSubmitting(true);

      if (order) {
        // Update existing order
        const { error: orderError } = await supabase
          .from('service_orders')
          .update({
            vehicle_plate: vehiclePlate,
            observations
          })
          .eq('id', order.id);

        if (orderError) throw orderError;

        // Delete existing items
        await supabase
          .from('service_order_products')
          .delete()
          .eq('service_order_id', order.id);

        await supabase
          .from('service_order_services')
          .delete()
          .eq('service_order_id', order.id);

        // Add new items
        const products = items.filter(item => item.type === 'product');
        const services = items.filter(item => item.type === 'service');

        if (products.length > 0) {
          const { error: productsError } = await supabase
            .from('service_order_products')
            .insert(
              products.map(item => ({
                service_order_id: order.id,
                product_id: item.id,
                quantity: item.quantity || 1,
                unit_price: item.price,
                total_price: item.price * (item.quantity || 1)
              }))
            );

          if (productsError) throw productsError;
        }

        if (services.length > 0) {
          const { error: servicesError } = await supabase
            .from('service_order_services')
            .insert(
              services.map(item => ({
                service_order_id: order.id,
                service_id: item.id,
                price: item.price
              }))
            );

          if (servicesError) throw servicesError;
        }

        toast.success('Ordem de serviço atualizada com sucesso!');
      } else {
        // Create new order
        const { data: newOrder, error: orderError } = await supabase
          .from('service_orders')
          .insert([{
            customer_id: customerId,
            vehicle_plate: vehiclePlate,
            observations,
            created_by: user.id,
            status: 'open'
          }])
          .select()
          .single();

        if (orderError) throw orderError;

        // Add products and services
        const products = items.filter(item => item.type === 'product');
        const services = items.filter(item => item.type === 'service');

        if (products.length > 0) {
          const { error: productsError } = await supabase
            .from('service_order_products')
            .insert(
              products.map(item => ({
                service_order_id: newOrder.id,
                product_id: item.id,
                quantity: item.quantity || 1,
                unit_price: item.price,
                total_price: item.price * (item.quantity || 1)
              }))
            );

          if (productsError) throw productsError;
        }

        if (services.length > 0) {
          const { error: servicesError } = await supabase
            .from('service_order_services')
            .insert(
              services.map(item => ({
                service_order_id: newOrder.id,
                service_id: item.id,
                price: item.price
              }))
            );

          if (servicesError) throw servicesError;
        }

        toast.success('Ordem de serviço criada com sucesso!');
      }

      onSave?.();
      onClose();
    } catch (error) {
      toast.error(order ? 'Erro ao atualizar ordem de serviço' : 'Erro ao criar ordem de serviço');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {order ? `Editar OS #${order.number}` : 'Nova Ordem de Serviço'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!order && (
              <CustomerSelect
                onSelect={(customer) => setCustomerId(customer.id)}
                error={!customerId ? 'Selecione um cliente' : undefined}
              />
            )}

            <Input
              label="Placa do Veículo"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <ProductSelect onSelect={handleAddItem} />
            <ServiceSelect onSelect={handleAddItem} />
          </div>

          <ServiceOrderItems items={items} onRemove={handleRemoveItem} />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}