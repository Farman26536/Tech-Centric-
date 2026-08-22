import React from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export const Card = ({ children, className = '' }: Props) => (
  <div className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>{children}</div>
);

export default Card;
