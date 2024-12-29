import React, { useState } from 'react';
import { useQuery } from '../../../hooks/useQuery';
import { Search } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  document: string;
  phone: string;
}

interface CustomerSelectProps {
  onSelect: (customer: Customer) => void;
  error?: string;
}

export function CustomerSelect({ onSelect, error }: CustomerSelectProps) {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { data: customers } = useQuery<Customer[]>(
    'search_customers',
    { search_term: search },
    { enabled: search.length >= 3 }
  );

  const handleSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearch(customer.name);
    onSelect(customer);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">
        Cliente *
      </label>
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedCustomer(null);
          }}
          placeholder="Buscar cliente..."
          className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {!selectedCustomer && customers && customers.length > 0 && (
        <div className="absolute z-50 mt-1 w-full">
          <ul className="max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {customers.map((customer) => (
              <li
                key={customer.id}
                onClick={() => handleSelect(customer)}
                className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <span className="font-normal block truncate">{customer.name}</span>
                </div>
                <span className="text-gray-500 text-sm block truncate">
                  {customer.document && `CPF/CNPJ: ${customer.document} - `}
                  Tel: {customer.phone}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}