import React from 'react';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    ACTIVE: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
    ARCHIVED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    COMPLETED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    OVERDUE: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
  };
  const cls = map[status] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
};

export default StatusBadge;
