import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children?: React.ReactNode;
};

export const Button = ({ variant = 'primary', className = '', children, ...rest }: Props) => {
  const base = 'inline-flex items-center gap-2 px-3 py-2 rounded text-sm font-medium';
  const styles: Record<string, string> = {
    primary: 'bg-brand text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
