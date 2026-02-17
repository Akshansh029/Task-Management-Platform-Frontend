import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '@/lib/utils';

const TaskStatusBadge = ({ status }) => {
  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {status?.replace('_', ' ')}
    </Badge>
  );
};

export default TaskStatusBadge;
