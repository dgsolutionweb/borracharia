import React, { useState } from 'react';
import { ServiceOrdersReport } from '../components/reports/ServiceOrdersReport';
import { ServiceOrdersFinancialReport } from '../components/reports/ServiceOrdersFinancialReport';
import { CalendarRange } from 'lucide-react';

export default function Reports() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1); // First day of current month
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Relatório de Ordens de Serviço</h1>
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow">
          <CalendarRange className="text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="text-gray-500">até</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <ServiceOrdersFinancialReport startDate={startDate} endDate={endDate} />
      <ServiceOrdersReport startDate={startDate} endDate={endDate} />
    </div>
  );
}