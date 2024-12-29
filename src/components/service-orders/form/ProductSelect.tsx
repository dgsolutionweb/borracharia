import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '../../../hooks/useQuery';
import { Package } from 'lucide-react';

interface Product {
  id: string;
  description: string;
  sale_price: number;
  current_stock: number;
}

interface ProductSelectProps {
  onSelect: (product: { type: 'product'; id: string; description: string; price: number; quantity: number }) => void;
}

export function ProductSelect({ onSelect }: ProductSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: products } = useQuery<Product[]>(
    'search_products',
    { search_term: search },
    { enabled: isOpen && search.length >= 3 }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (product: Product) => {
    onSelect({
      type: 'product',
      id: product.id,
      description: product.description,
      price: product.sale_price,
      quantity: 1
    });
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Package className="h-5 w-5 mr-2" />
        Adicionar Produto
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {products && products.length > 0 && (
            <ul className="max-h-60 overflow-auto">
              {products.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  <div className="flex justify-between">
                    <span>{product.description}</span>
                    <span className="text-green-600 font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(product.sale_price)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Estoque: {product.current_stock} un
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}