import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { AlertCircle } from 'lucide-react';

interface LowStockProduct {
  id: string;
  description: string;
  current_stock: number;
  min_stock: number;
}

export function LowStockAlert() {
  const { data: products, loading } = useQuery<LowStockProduct[]>('get_low_stock_products');

  if (loading || !products?.length) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-yellow-400" />
        <p className="ml-3 text-sm text-yellow-700">
          <span className="font-medium">Atenção!</span> Existem produtos com estoque baixo.
        </p>
      </div>
      <div className="mt-2 space-y-1">
        {products.map(product => (
          <p key={product.id} className="text-sm text-yellow-700 ml-8">
            • {product.description}: {product.current_stock} un (mín: {product.min_stock} un)
          </p>
        ))}
      </div>
    </div>
  );
}