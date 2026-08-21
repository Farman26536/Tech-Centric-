import { forwardRef, SelectHTMLAttributes } from 'react';
type Props = SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string };
const Select=forwardRef<HTMLSelectElement,Props>(({label,error,id,className='',...props},ref)=>{const selectId=id||props.name;return <div><label htmlFor={selectId} className="text-sm font-medium text-slate-700">{label}</label><select ref={ref} id={selectId} aria-invalid={!!error} className={`mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${error?'border-red-400':''} ${className}`} {...props}/>{error&&<p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}</div>});
Select.displayName='Select'; export default Select;
