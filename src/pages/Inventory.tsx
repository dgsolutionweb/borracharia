import React, { useState } from 'react';
import { LowStockAlert } from '../components/inventory/LowStockAlert';
import { InventoryList } from '../components/inventory/InventoryList';
import { InventoryForm } from '../components/inventory/InventoryForm';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function Inventory() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');

  const handleNewMovement = (type: 'in' | 'out') => {
    setMovementType(type);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleNewMovement('in')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Nova Entrada
          </button>
          <button
            onClick={() => handleNewMovement('out')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            Nova Saída
          </button>
        </div>
      </div>
      
      <LowStockAlert />
      <InventoryList />
      
      {isFormOpen && (
        <InventoryForm
          type={movementType}
          onClose={() => setIsFormOpen(false)}
          onSave={() => window.location.reload()}
        />
      )}
    </div>
  );
}