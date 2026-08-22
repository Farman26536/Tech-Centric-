import React from 'react';

export const Avatar: React.FC<{ name?: string; size?: number; src?: string; className?: string }> = ({ name = 'User', size = 36, src, className = '' }) => {
  const initials = name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100 ${className}`} style={{ width: size, height: size }}>
      {src ? <img src={src} alt={name} className="w-full h-full rounded-full object-cover" /> : <span className="font-medium">{initials}</span>}
    </div>
  );
};

export default Avatar;
