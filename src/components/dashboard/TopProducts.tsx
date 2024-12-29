import React from 'react';
import { useQuery } from '../../hooks/useQuery';

interface TopProduct {
  description: string;
  total_sold: number;
  total_revenue: number;
}

export function TopProducts() {
  const { data: products, loading } = useQuery<TopProduct[]>('get_top_products');

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Produtos Mais Vendidos</h2>
      <div className="space-y-4">
        {products?.map((product) => (
          <div key={product.description} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{product.description}</p>
              <p className="text-sm text-gray-500">{product.total_sold} unidades</p>
            </div>
            <p className="font-semibold text-green-600">
              R$ {product.total_revenue.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}