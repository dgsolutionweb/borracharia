import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { formatCurrency } from '../../utils/format';

interface RevenueBreakdown {
  services: Array<{
    description: string;
    service_count: number;
    total_revenue: number;
  }>;
  products: Array<{
    description: string;
    quantity_sold: number;
    total_revenue: number;
    total_cost: number;
    profit: number;
  }>;
}

interface RevenueBreakdownProps {
  startDate: string;
  endDate: string;
}

export function RevenueBreakdown({ startDate, endDate }: RevenueBreakdownProps) {
  const { data: breakdown, loading } = useQuery<RevenueBreakdown>(
    'get_revenue_breakdown',
    { start_date: startDate, end_date: endDate }
  );

  if (loading) return <div>Carregando...</div>;

  const services = breakdown?.services ?? [];
  const products = breakdown?.products ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Serviços</h3>
        <div className="overflow-x-auto">
          {services.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qtd</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Receita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.description}>
                    <td className="px-4 py-2 text-sm text-gray-900">{service.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">{service.service_count}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {formatCurrency(service.total_revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum serviço encontrado no período</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Produtos</h3>
        <div className="overflow-x-auto">
          {products.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qtd</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Receita</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Lucro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.description}>
                    <td className="px-4 py-2 text-sm text-gray-900">{product.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">{product.quantity_sold}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {formatCurrency(product.total_revenue)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      <span className={product.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(product.profit)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum produto encontrado no período</p>
          )}
        </div>
      </div>
    </div>
  );
}