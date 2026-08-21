import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export const FormInput = ({ label, className = '', ...rest }: Props) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input className={`mt-1 block w-full border rounded px-3 py-2 ${className}`} {...rest} />
  </div>
);

export default FormInput;
