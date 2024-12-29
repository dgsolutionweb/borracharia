import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { formatCurrency } from '../../utils/format';
import { formatDate } from '../../utils/date';
import { ServiceOrderStatus } from '../../types/serviceOrder';
import { StatusBadge } from '../service-orders/StatusBadge';

interface ServiceOrderReport {
  orders_by_status: {
    status: ServiceOrderStatus;
    count: number;
    total_amount: number;
  }[];
  orders_details: {
    number: number;
    customer_name: string;
    created_at: string;
    status: ServiceOrderStatus;
    total_amount: number;
    services: {
      description: string;
      price: number;
    }[];
    products: {
      description: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }[];
  }[];
}

interface ServiceOrdersReportProps {
  startDate: string;
  endDate: string;
}

export function ServiceOrdersReport({ startDate, endDate }: ServiceOrdersReportProps) {
  const { data: report, loading } = useQuery<ServiceOrderReport>(
    'get_service_orders_report',
    { start_date: startDate, end_date: endDate }
  );

  if (loading) return <div>Carregando...</div>;

  const statusSummary = report?.orders_by_status ?? [];
  const orders = report?.orders_details ?? [];

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusSummary.map((status) => (
          <div key={status.status} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <StatusBadge status={status.status} />
              <span className="text-2xl font-bold">{status.count}</span>
            </div>
            <div className="text-sm text-gray-500">
              Total: {formatCurrency(status.total_amount)}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Ordens de Serviço Detalhadas</h3>
        </div>
        
        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    OS #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <React.Fragment key={order.number}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order.number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium">
                        {formatCurrency(order.total_amount)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-2">
                        <div className="text-sm">
                          <div className="font-medium text-gray-700 mb-1">Itens:</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Serviços:</div>
                              {order.services.map((service, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span>{service.description}</span>
                                  <span>{formatCurrency(service.price)}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Produtos:</div>
                              {order.products.map((product, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span>{product.description} (x{product.quantity})</span>
                                  <span>{formatCurrency(product.total_price)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma ordem de serviço encontrada no período selecionado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}