import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/format';

interface ServiceData {
  description: string;
  total_count: number;
  total_revenue: number;
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

export function ServicesReport() {
  const { data: services, loading } = useQuery<ServiceData[]>('get_top_services');

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Serviços Mais Realizados</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={services}
              dataKey="total_revenue"
              nameKey="description"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ description }) => description}
            >
              {services?.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}