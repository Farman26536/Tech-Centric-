import React from 'react';

export const StatCard: React.FC<{ title: string; value: React.ReactNode; subtitle?: string; icon?: React.ReactNode; accent?: string }> = ({ title, value, subtitle, icon, accent = 'bg-indigo-50 text-indigo-600' }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
          {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
        </div>
        {icon && <div className={`p-2 rounded-lg ${accent}`}>{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
