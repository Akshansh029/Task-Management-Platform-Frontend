import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getPriorityColor } from '@/lib/utils';
import { AlertCircle, ChevronDown, ChevronUp, ChevronsUp } from 'lucide-react';

const TaskPriorityBadge = ({ priority }) => {
  const getIcon = (p) => {
    switch(p) {
      case 'URGENT': return <AlertCircle className="h-3 w-3 mr-1" />;
      case 'HIGH': return <ChevronsUp className="h-3 w-3 mr-1" />;
      case 'MEDIUM': return <ChevronUp className="h-3 w-3 mr-1" />;
      case 'LOW': return <ChevronDown className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <Badge variant="outline" className={getPriorityColor(priority)}>
      {getIcon(priority)}
      {priority}
    </Badge>
  );
};

export default TaskPriorityBadge;
