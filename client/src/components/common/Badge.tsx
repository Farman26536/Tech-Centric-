import React from 'react';

type Props = {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'muted';
  className?: string;
  children?: React.ReactNode;
};

export const Badge = ({ variant = 'info', children, className = '' }: Props) => {
  const styles: Record<string, string> = {
    info: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-800',
    danger: 'bg-red-50 text-red-700',
    muted: 'bg-gray-100 text-gray-700'
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[variant]} ${className}`}>{children}</span>;
};

export default Badge;
