import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  date: string;
  revenue: number;
}

export function RevenueChart() {
  const { data, loading } = useQuery<RevenueData[]>('get_revenue_by_date');

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Faturamento por Período</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fill="#93c5fd"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}