import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Input } from '../ui/Input';

const productSchema = z.object({
  description: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  barcode: z.string().optional(),
  brand: z.string().min(2, 'Marca deve ter no mínimo 2 caracteres'),
  model: z.string().optional(),
  cost_price: z.number().min(0.01, 'Preço de custo deve ser maior que zero'),
  sale_price: z.number().min(0.01, 'Preço de venda deve ser maior que zero'),
  min_stock: z.number().min(0, 'Estoque mínimo não pode ser negativo'),
  current_stock: z.number().min(0, 'Estoque atual não pode ser negativo'),
  supplier: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onClose: () => void;
  product?: ProductFormData;
}

export function ProductForm({ onClose, product }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product,
  });

  async function onSubmit(data: ProductFormData) {
    try {
      const { error } = await supabase
        .from('products')
        .insert([data]);

      if (error) throw error;

      toast.success('Produto cadastrado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao cadastrar produto');
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Novo Produto</h2>
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
            label="Código de Barras"
            {...register('barcode')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Marca *"
              error={errors.brand?.message}
              {...register('brand')}
            />

            <Input
              label="Modelo"
              {...register('model')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço de Custo *"
              type="number"
              step="0.01"
              error={errors.cost_price?.message}
              {...register('cost_price', { valueAsNumber: true })}
            />

            <Input
              label="Preço de Venda *"
              type="number"
              step="0.01"
              error={errors.sale_price?.message}
              {...register('sale_price', { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estoque Mínimo *"
              type="number"
              error={errors.min_stock?.message}
              {...register('min_stock', { valueAsNumber: true })}
            />

            <Input
              label="Estoque Atual *"
              type="number"
              error={errors.current_stock?.message}
              {...register('current_stock', { valueAsNumber: true })}
            />
          </div>

          <Input
            label="Fornecedor"
            {...register('supplier')}
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