import React, { useState } from 'react';
import { ServiceList } from '../components/services/ServiceList';
import { ServiceForm } from '../components/services/ServiceForm';
import { Plus } from 'lucide-react';

export default function Services() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Serviços</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      <ServiceList />
      
      {isFormOpen && (
        <ServiceForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}