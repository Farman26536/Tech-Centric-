import React from 'react';

export const ProgressBar: React.FC<{ percent: number; className?: string }> = ({ percent, className = '' }) => {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className={`w-full bg-gray-100 rounded-full h-2 ${className}`}>
      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${pct}%`, transition: 'width 300ms' }} />
    </div>
  );
};

export default ProgressBar;
