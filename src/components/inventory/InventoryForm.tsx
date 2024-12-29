import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ProductSelect } from './ProductSelect';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

const movementSchema = z.object({
  quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
  notes: z.string().optional(),
});

type MovementFormData = z.infer<typeof movementSchema>;

interface InventoryFormProps {
  onClose: () => void;
  onSave: () => void;
  type: 'in' | 'out';
}

export function InventoryForm({ onClose, onSave, type }: InventoryFormProps) {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; description: string } | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
  });

  const onSubmit = async (data: MovementFormData) => {
    if (!selectedProduct || !user) return;

    try {
      const { error } = await supabase
        .from('inventory_movements')
        .insert([{
          product_id: selectedProduct.id,
          movement_type: type,
          quantity: data.quantity,
          notes: data.notes,
          created_by: user.id,
        }]);

      if (error) throw error;

      toast.success(type === 'in' ? 'Entrada registrada com sucesso!' : 'Saída registrada com sucesso!');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Erro ao registrar movimentação');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {type === 'in' ? 'Nova Entrada' : 'Nova Saída'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <ProductSelect
            onSelect={setSelectedProduct}
            error={!selectedProduct ? 'Selecione um produto' : undefined}
          />

          <Input
            label="Quantidade *"
            type="number"
            min="1"
            error={errors.quantity?.message}
            {...register('quantity', { valueAsNumber: true })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedProduct}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}