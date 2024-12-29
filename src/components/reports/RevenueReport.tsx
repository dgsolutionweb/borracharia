import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

interface RevenueData {
  date: string;
  revenue: number;
}

export function RevenueReport() {
  const { data, loading } = useQuery<RevenueData[]>('get_revenue_by_date', { p_days: 30 });

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Faturamento por Período</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}