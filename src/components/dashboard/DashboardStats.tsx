import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { DollarSign, Package, FileText, Users } from 'lucide-react';

interface DashboardMetrics {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
}

export function DashboardStats() {
  const { data: metrics, loading } = useQuery<DashboardMetrics>('get_dashboard_metrics');

  if (loading) {
    return <div>Carregando...</div>;
  }

  const stats = [
    {
      name: 'Faturamento Mensal',
      value: metrics?.total_revenue ? `R$ ${metrics.total_revenue.toFixed(2)}` : 'R$ 0,00',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Ordens de Serviço',
      value: metrics?.total_orders ?? 0,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: 'Produtos em Estoque',
      value: metrics?.total_products ?? 0,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      name: 'Total de Clientes',
      value: metrics?.total_customers ?? 0,
      icon: Users,
      color: 'bg-orange-500',
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}