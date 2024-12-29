import React, { useState } from 'react';
import { CustomerList } from '../components/customers/CustomerList';
import { CustomerForm } from '../components/customers/CustomerForm';
import { Plus } from 'lucide-react';

export default function Customers() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      <CustomerList />
      
      {isFormOpen && (
        <CustomerForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}