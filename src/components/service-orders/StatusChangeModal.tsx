import React from 'react';
import { X } from 'lucide-react';
import { ServiceOrderStatus } from '../../types/serviceOrder';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const statusConfig = {
  open: {
    label: 'Aberta',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    nextStatus: ['in_progress', 'cancelled']
  },
  in_progress: {
    label: 'Em Andamento',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    nextStatus: ['completed', 'cancelled']
  },
  completed: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-800 border-green-200',
    nextStatus: []
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-800 border-red-200',
    nextStatus: []
  }
} as const;

interface StatusChangeModalProps {
  orderId: string;
  orderNumber: number;
  currentStatus: ServiceOrderStatus;
  onClose: () => void;
  onStatusChange: () => void;
}

export function StatusChangeModal({ 
  orderId, 
  orderNumber,
  currentStatus, 
  onClose,
  onStatusChange 
}: StatusChangeModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const availableStatuses = statusConfig[currentStatus].nextStatus;

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
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Alterar Status - OS #{orderNumber}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-sm text-gray-600">
            Status atual:
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[currentStatus].className}`}>
              {statusConfig[currentStatus].label}
            </span>
          </div>

          {availableStatuses.length > 0 ? (
            <>
              <div className="text-sm font-medium text-gray-700">
                Selecione o novo status:
              </div>
              <div className="space-y-2">
                {availableStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isLoading}
                    className={`w-full p-3 text-left rounded-lg border-2 hover:border-blue-500 transition-colors
                      ${statusConfig[status].className}`}
                  >
                    {statusConfig[status].label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Este status não pode ser alterado.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}