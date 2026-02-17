import React from 'react';
import { Button } from '@/components/ui/button';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-gray-50/50 min-h-[400px]">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gray-100">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="max-w-xs mt-1 text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
