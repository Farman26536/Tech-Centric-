import { ButtonHTMLAttributes } from 'react';
import { LoaderCircle } from 'lucide-react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };
export default function Button({ className='', loading=false, disabled, children, ...props }: Props) {
  return <button {...props} disabled={disabled || loading} aria-busy={loading || undefined} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>{loading && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}{children}</button>;
}
