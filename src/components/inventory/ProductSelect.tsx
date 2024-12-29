import React, { useState } from 'react';
import { useQuery } from '../../hooks/useQuery';
import { Search } from 'lucide-react';

interface Product {
  id: string;
  description: string;
  current_stock: number;
}

interface ProductSelectProps {
  onSelect: (product: { id: string; description: string }) => void;
  error?: string;
}

export function ProductSelect({ onSelect, error }: ProductSelectProps) {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: products } = useQuery<Product[]>(
    'search_products',
    { search_term: search },
    { enabled: search.length >= 3 }
  );

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearch(product.description);
    onSelect(product);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">
        Produto *
      </label>
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedProduct(null);
          }}
          placeholder="Buscar produto..."
          className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {!selectedProduct && products && products.length > 0 && (
        <div className="absolute z-50 mt-1 w-full">
          <ul className="max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {products.map((product) => (
              <li
                key={product.id}
                onClick={() => handleSelect(product)}
                className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <span className="font-normal block truncate">{product.description}</span>
                  <span className="text-sm text-gray-500">
                    Estoque: {product.current_stock} un
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}