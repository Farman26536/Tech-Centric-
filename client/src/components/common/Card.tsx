import React from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export const Card = ({ children, className = '' }: Props) => (
  <div className={`bg-white shadow-sm rounded-lg p-4 ${className}`}>{children}</div>
);

export default Card;
