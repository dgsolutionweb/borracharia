import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { ServiceOrderStatus } from '../../types/serviceOrder';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const statusConfig = {
  open: {
    label: 'Aberta',
    className: 'bg-yellow-100 text-yellow-800',
    nextStatus: ['in_progress', 'cancelled']
  },
  in_progress: {
    label: 'Em Andamento',
    className: 'bg-blue-100 text-blue-800',
    nextStatus: ['completed', 'cancelled']
  },
  completed: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-800',
    nextStatus: []
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-800',
    nextStatus: []
  }
} as const;

interface StatusChangeButtonProps {
  orderId: string;
  currentStatus: ServiceOrderStatus;
  onStatusChange: () => void;
}

export function StatusChangeButton({ orderId, currentStatus, onStatusChange }: StatusChangeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const availableStatuses = statusConfig[currentStatus].nextStatus;

  if (availableStatuses.length === 0) {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[currentStatus].className}`}>
        {statusConfig[currentStatus].label}
      </span>
    );
  }

  const handleStatusChange = async (newStatus: ServiceOrderStatus) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('service_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Status atualizado com sucesso!');
      onStatusChange();
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[currentStatus].className}`}
      >
        {statusConfig[currentStatus].label}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {availableStatuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Check className="w-4 h-4 mr-2 invisible" />
                {statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}