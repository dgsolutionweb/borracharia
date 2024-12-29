import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Input } from '../ui/Input';

const serviceSchema = z.object({
  description: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  estimated_time: z.string().optional(),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  onClose: () => void;
  service?: ServiceFormData;
}

export function ServiceForm({ onClose, service }: ServiceFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service,
  });

  async function onSubmit(data: ServiceFormData) {
    try {
      const { error } = await supabase
        .from('services')
        .insert([data]);

      if (error) throw error;

      toast.success('Serviço cadastrado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao cadastrar serviço');
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Novo Serviço</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <Input
            label="Descrição *"
            error={errors.description?.message}
            {...register('description')}
          />

          <Input
            label="Tempo Estimado (HH:MM)"
            type="time"
            step="300"
            {...register('estimated_time')}
          />

          <Input
            label="Preço *"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />

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
              disabled={isSubmitting}
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