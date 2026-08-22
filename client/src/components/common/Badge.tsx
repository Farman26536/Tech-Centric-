import React from 'react';

type Props = {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'muted';
  className?: string;
  children?: React.ReactNode;
};

export const Badge = ({ variant = 'info', children, className = '' }: Props) => {
  const styles: Record<string, string> = {
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    success: 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-200',
    danger: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300',
    muted: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[variant]} ${className}`}>{children}</span>;
};

export default Badge;
