import React from 'react';
import { Trash2 } from 'lucide-react';

interface Item {
  type: 'service' | 'product';
  description: string;
  price: number;
  quantity?: number;
}

interface ServiceOrderItemsProps {
  items: Item[];
  onRemove: (index: number) => void;
}

export function ServiceOrderItems({ items, onRemove }: ServiceOrderItemsProps) {
  const total = items.reduce((acc, item) => {
    return acc + (item.price * (item.quantity || 1));
  }, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum item adicionado
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qtd
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subtotal
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.type === 'service' ? 'Serviço' : 'Produto'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.quantity || 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(item.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(item.price * (item.quantity || 1))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50">
            <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
              Total
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(total)}
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}