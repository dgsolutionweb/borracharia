import React from 'react';
import { useQuery } from '../../hooks/useQuery';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface Product {
  id: string;
  description: string;
  barcode: string | null;
  brand: string;
  model: string | null;
  cost_price: number;
  sale_price: number;
  current_stock: number;
  min_stock: number;
  supplier: string | null;
}

export function ProductList() {
  const { data: products, loading } = useQuery<Product[]>('get_products');

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
                Preços
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fornecedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.description}</div>
                  <div className="text-sm text-gray-500">
                    {product.brand} {product.model && `- ${product.model}`}
                  </div>
                  {product.barcode && (
                    <div className="text-xs text-gray-500">{product.barcode}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">Venda: {formatCurrency(product.sale_price)}</div>
                  <div className="text-sm text-gray-500">Custo: {formatCurrency(product.cost_price)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className={`text-sm ${
                      product.current_stock <= product.min_stock ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {product.current_stock} un
                    </span>
                    {product.current_stock <= product.min_stock && (
                      <AlertCircle className="w-4 h-4 text-red-600 ml-1" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Mín: {product.min_stock} un</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.supplier}
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