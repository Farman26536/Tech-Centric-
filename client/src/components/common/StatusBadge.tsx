import React from 'react';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    ACTIVE: 'bg-indigo-50 text-indigo-700',
    ARCHIVED: 'bg-gray-100 text-gray-700',
    COMPLETED: 'bg-green-50 text-green-700',
    IN_PROGRESS: 'bg-amber-50 text-amber-700',
    PENDING: 'bg-amber-50 text-amber-700',
    OVERDUE: 'bg-red-50 text-red-700'
  };
  const cls = map[status] ?? 'bg-gray-100 text-gray-700';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
};

export default StatusBadge;
