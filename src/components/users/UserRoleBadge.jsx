import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getRoleColor } from '@/lib/utils';

const UserRoleBadge = ({ role }) => {
  return (
    <Badge variant="outline" className={getRoleColor(role)}>
      {role}
    </Badge>
  );
};

export default UserRoleBadge;
