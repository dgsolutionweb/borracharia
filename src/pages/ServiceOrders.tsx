import React, { useState } from 'react';
import { ServiceOrderList } from '../components/service-orders/ServiceOrderList';
import { ServiceOrderForm } from '../components/service-orders/ServiceOrderForm';
import { Plus } from 'lucide-react';

export default function ServiceOrders() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Ordens de Serviço</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova OS
        </button>
      </div>

      <ServiceOrderList />
      
      {isFormOpen && (
        <ServiceOrderForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}