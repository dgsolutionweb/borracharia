import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { formatCurrency } from '../../utils/format';
import { DollarSign, TrendingUp, ShoppingCart, Percent } from 'lucide-react';

interface FinancialMetrics {
  revenue: {
    total: number;
    services: number;
    products: number;
  };
  costs: {
    total: number;
    products: number;
  };
  profits: {
    gross: number;
    margin: number;
  };
  averages: {
    ticket: number;
    service_value: number;
    product_value: number;
  };
}

interface ServiceOrdersFinancialReportProps {
  startDate: string;
  endDate: string;
}

export function ServiceOrdersFinancialReport({ startDate, endDate }: ServiceOrdersFinancialReportProps) {
  const { data: metrics, loading } = useQuery<FinancialMetrics>(
    'get_service_orders_financial_metrics',
    { start_date: startDate, end_date: endDate }
  );

  if (loading) return <div>Carregando...</div>;

  if (!metrics) return null;

  const stats = [
    {
      title: 'Receita Total',
      value: formatCurrency(metrics.revenue.total),
      details: [
        { label: 'Serviços', value: formatCurrency(metrics.revenue.services) },
        { label: 'Produtos', value: formatCurrency(metrics.revenue.products) }
      ],
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Custos',
      value: formatCurrency(metrics.costs.total),
      details: [
        { label: 'CMV', value: formatCurrency(metrics.costs.products) }
      ],
      icon: ShoppingCart,
      color: 'bg-red-500'
    },
    {
      title: 'Lucro Bruto',
      value: formatCurrency(metrics.profits.gross),
      details: [
        { label: 'Margem', value: `${metrics.profits.margin.toFixed(2)}%` }
      ],
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(metrics.averages.ticket),
      details: [
        { label: 'Serviços', value: formatCurrency(metrics.averages.service_value) },
        { label: 'Produtos', value: formatCurrency(metrics.averages.product_value) }
      ],
      icon: Percent,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {stat.details.map((detail) => (
              <div key={detail.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{detail.label}:</span>
                <span className="font-medium text-gray-900">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}