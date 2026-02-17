import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ErrorBanner = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-between p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
      <div className="flex items-center space-x-3 text-red-700">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm font-medium">{message || 'Something went wrong. Please try again later.'}</span>
      </div>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="text-red-700 hover:bg-red-100 hover:text-red-800"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorBanner;
