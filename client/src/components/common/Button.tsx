import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
};

const ButtonBase = React.forwardRef<HTMLButtonElement, Props>(function Button({ variant = 'primary', loading, className = '', children, disabled, ...rest }, ref) {
  const base = 'inline-flex items-center gap-2 px-3 py-2 rounded text-sm font-medium';
  const styles: Record<string, string> = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100'
  };
  return (
    <button
      ref={ref}
      className={`${base} ${styles[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
});
export const Button = ButtonBase;
export default ButtonBase;
