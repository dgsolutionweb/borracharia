import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { DollarSign, TrendingUp, ShoppingCart, Percent } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface FinancialMetrics {
  total_revenue: number;
  total_orders: number;
  average_ticket: number;
  total_costs: number;
  gross_profit: number;
  gross_margin: number;
}

interface FinancialMetricsProps {
  startDate: string;
  endDate: string;
}

export function FinancialMetrics({ startDate, endDate }: FinancialMetricsProps) {
  const { data: metrics, loading } = useQuery<FinancialMetrics>(
    'get_financial_metrics',
    { start_date: startDate, end_date: endDate }
  );

  if (loading) return <div>Carregando...</div>;

  const stats = [
    {
      name: 'Faturamento Total',
      value: formatCurrency(metrics?.total_revenue ?? 0),
      icon: DollarSign,
      color: 'bg-green-500',
      description: 'Receita total no período'
    },
    {
      name: 'Lucro Bruto',
      value: formatCurrency(metrics?.gross_profit ?? 0),
      icon: TrendingUp,
      color: 'bg-blue-500',
      description: 'Receita total menos custos diretos'
    },
    {
      name: 'CMV',
      value: formatCurrency(metrics?.total_costs ?? 0),
      icon: ShoppingCart,
      color: 'bg-red-500',
      description: 'Custo das mercadorias vendidas'
    },
    {
      name: 'Margem Bruta',
      value: `${(metrics?.gross_margin ?? 0).toFixed(2)}%`,
      icon: Percent,
      color: 'bg-purple-500',
      description: 'Percentual de lucro sobre a receita'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}