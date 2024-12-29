import React from 'react';
import { useQuery } from '../../hooks/useQuery';

interface TopService {
  description: string;
  total_count: number;
  total_revenue: number;
}

export function TopServices() {
  const { data: services, loading } = useQuery<TopService[]>('get_top_services');

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Serviços Mais Realizados</h2>
      <div className="space-y-4">
        {services?.map((service) => (
          <div key={service.description} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{service.description}</p>
              <p className="text-sm text-gray-500">{service.total_count} realizações</p>
            </div>
            <p className="font-semibold text-green-600">
              R$ {service.total_revenue.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}