import React from 'react';
import { ServiceOrderStatus } from '../../types/serviceOrder';

const statusConfig = {
  open: {
    label: 'Aberta',
    className: 'bg-yellow-100 text-yellow-800',
  },
  in_progress: {
    label: 'Em Andamento',
    className: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-800',
  },
} as const;

interface StatusBadgeProps {
  status: ServiceOrderStatus;
  onClick?: () => void;
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`px-2 py-1 rounded-full text-xs font-semibold ${config.className} hover:opacity-80`}
      >
        {config.label}
      </button>
    );
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}