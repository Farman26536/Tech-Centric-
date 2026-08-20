import { forwardRef, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
const Input = forwardRef<HTMLInputElement, Props>(({label,error,id,className='',...props},ref) => { const inputId=id || props.name; return <div><label htmlFor={inputId} className="text-sm font-medium text-slate-700">{label}</label><input ref={ref} id={inputId} aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : undefined} className={`mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${error ? 'border-red-400' : ''} ${className}`} {...props}/>{error && <p id={`${inputId}-error`} role="alert" className="mt-1 text-xs text-red-600">{error}</p>}</div>; });
Input.displayName='Input';
export default Input;
