import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { Edit, Trash2, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { formatDuration } from '../../utils/duration';

interface Service {
  id: string;
  description: string;
  estimated_time: string | null;
  price: number;
}

export function ServiceList() {
  const { data: services, loading } = useQuery<Service[]>('get_services');

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serviço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tempo Estimado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services?.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {service.description}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.estimated_time ? formatDuration(service.estimated_time) : 'Não definido'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatCurrency(service.price)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}