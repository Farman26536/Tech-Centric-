import React from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export const Card = ({ children, className = '' }: Props) => (
  <div className={`rounded-lg p-4 shadow-sm card ${className}`}>{children}</div>
);

export default Card;
