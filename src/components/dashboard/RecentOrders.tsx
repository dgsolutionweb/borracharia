import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentOrder {
  number: number;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const statusColors = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  open: 'Aberta',
  in_progress: 'Em Andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

export function RecentOrders() {
  const { data: orders, loading } = useQuery<RecentOrder[]>('get_recent_orders');

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Ordens Recentes</h2>
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.number} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                OS #{order.number} - {order.customer_name}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(order.created_at), "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status as keyof typeof statusColors]}`}>
                {statusLabels[order.status as keyof typeof statusLabels]}
              </span>
              <span className="font-semibold text-green-600">
                R$ {order.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}