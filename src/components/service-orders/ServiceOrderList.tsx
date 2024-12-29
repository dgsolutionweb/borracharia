import React, { useState } from 'react';
import { useQuery } from '../../hooks/useQuery';
import { Edit, FileText, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { formatDate } from '../../utils/date';
import { ServiceOrderStatus } from '../../types/serviceOrder';
import { StatusBadge } from './StatusBadge';
import { StatusChangeModal } from './StatusChangeModal';
import { ServiceOrderForm } from './ServiceOrderForm';

interface ServiceOrder {
  id: string;
  number: number;
  customer_name: string;
  vehicle_plate: string | null;
  status: ServiceOrderStatus;
  total_amount: number;
  created_at: string;
}

export function ServiceOrderList() {
  const { data: orders, loading, refetch } = useQuery<ServiceOrder[]>('get_service_orders');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium">#{order.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer_name}
                    </div>
                    {order.vehicle_plate && (
                      <div className="text-sm text-gray-500">
                        Placa: {order.vehicle_plate}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge 
                      status={order.status} 
                      onClick={() => setSelectedOrder(order)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(order.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setEditingOrder(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <StatusChangeModal
          orderId={selectedOrder.id}
          orderNumber={selectedOrder.number}
          currentStatus={selectedOrder.status}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={refetch}
        />
      )}

      {editingOrder && (
        <ServiceOrderForm
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={refetch}
        />
      )}
    </>
  );
}