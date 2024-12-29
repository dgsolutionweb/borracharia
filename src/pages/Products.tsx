import React, { useState } from 'react';
import { ProductList } from '../components/products/ProductList';
import { ProductForm } from '../components/products/ProductForm';
import { Plus } from 'lucide-react';

export default function Products() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      <ProductList />
      
      {isFormOpen && (
        <ProductForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}