import React from 'react';

export const StatCard: React.FC<{ title: string; value: React.ReactNode; subtitle?: string; icon?: React.ReactNode; accent?: string }> = ({ title, value, subtitle, icon, accent = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' }) => {
  return (
    <div className="rounded-2xl card p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
          {subtitle && <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</div>}
        </div>
        {icon && <div className={`rounded-lg p-2 ${accent}`}>{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
