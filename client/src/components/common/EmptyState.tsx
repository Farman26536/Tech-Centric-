import React from 'react';

type Props = { title?: string; description?: string; children?: React.ReactNode };

export const EmptyState = ({ title = 'Nothing here', description = '' }: Props) => (
  <div className="text-center py-12">
    <div className="text-lg font-medium mb-2">{title}</div>
    {description && <div className="text-sm text-gray-500">{description}</div>}
  </div>
);

export default EmptyState;
