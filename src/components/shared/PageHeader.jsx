import React from 'react';
import { Separator } from '@/components/ui/separator';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <Separator />
    </div>
  );
};

export default PageHeader;
