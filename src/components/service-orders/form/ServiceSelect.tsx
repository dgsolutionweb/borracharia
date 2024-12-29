import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '../../../hooks/useQuery';
import { Wrench } from 'lucide-react';

interface Service {
  id: string;
  description: string;
  price: number;
  estimated_time: string | null;
}

interface ServiceSelectProps {
  onSelect: (service: { type: 'service'; id: string; description: string; price: number }) => void;
}

export function ServiceSelect({ onSelect }: ServiceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: services } = useQuery<Service[]>(
    'search_services',
    { search_term: search },
    { enabled: isOpen && search.length >= 3 }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (service: Service) => {
    onSelect({
      type: 'service',
      id: service.id,
      description: service.description,
      price: service.price
    });
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Wrench className="h-5 w-5 mr-2" />
        Adicionar Serviço
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar serviço..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {services && services.length > 0 && (
            <ul className="max-h-60 overflow-auto">
              {services.map((service) => (
                <li
                  key={service.id}
                  onClick={() => handleSelect(service)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  <div className="flex justify-between">
                    <span>{service.description}</span>
                    <span className="text-green-600 font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(service.price)}
                    </span>
                  </div>
                  {service.estimated_time && (
                    <span className="text-sm text-gray-500">
                      Tempo estimado: {service.estimated_time}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}