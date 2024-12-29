import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { Package2, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface InventoryMovement {
  id: string;
  product_description: string;
  movement_type: 'in' | 'out';
  quantity: number;
  created_at: string;
  created_by_name: string;
}

export function InventoryList() {
  const { data: movements, loading } = useQuery<InventoryMovement[]>('get_inventory_movements');

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
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements?.map((movement) => (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Package2 className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {movement.product_description}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {movement.movement_type === 'in' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      Entrada
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <ArrowDown className="w-3 h-3 mr-1" />
                      Saída
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {movement.quantity} un
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {movement.created_by_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(movement.created_at).toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}