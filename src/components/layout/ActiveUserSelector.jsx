'use client';

import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useActiveUser } from '@/providers/ActiveUserContext';
import { getInitials } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

const ActiveUserSelector = () => {
  const { activeUser, setActiveUser, users, loading } = useActiveUser();

  if (loading || !activeUser) {
    return <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-md" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-gray-100 p-1 px-2 rounded-md transition-colors outline-none">
        <Avatar className="h-8 w-8 outline-none border border-slate-200">
          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs text-slate-800">
            {getInitials(activeUser.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="text-sm font-medium text-gray-900 line-clamp-1">
            {activeUser.name}
          </span>
          <span className="text-xs text-gray-500 capitalize">{activeUser.role?.toLowerCase()}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Active User</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => setActiveUser(user)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-[10px] text-gray-500 uppercase">{user.role}</span>
              </div>
            </div>
            {activeUser.id === user.id && <Check className="h-4 w-4 text-blue-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActiveUserSelector;
