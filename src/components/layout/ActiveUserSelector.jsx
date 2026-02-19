"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useActiveUser } from "@/providers/ActiveUserContext";
import { getInitials } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

const ActiveUserSelector = () => {
  const { activeUser, setActiveUser, users, loading } = useActiveUser();

  if (loading || !activeUser) {
    return <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-md" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-gray-100 p-1 px-2 rounded-md transition-colors outline-none focus:ring-2 focus:ring-blue-100">
        <Avatar className="h-8 w-8 outline-none border border-slate-200">
          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
            {getInitials(activeUser.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-col items-start hidden sm:flex">
          <span className="text-sm font-medium text-gray-900 line-clamp-1">
            {activeUser.name}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {activeUser.role?.toLowerCase()}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1">
        <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Switch User
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto custom-scrollbar">
          <DropdownMenuGroup>
            {(users.content || []).map((user) => (
              <DropdownMenuItem
                key={user.id}
                onSelect={() => setActiveUser(user)}
                className="flex items-center justify-between cursor-pointer py-2.5 px-3"
              >
                <div className="flex items-center space-x-3 text-left">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-slate-50 text-slate-600">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase mt-1.5 font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
                {activeUser.id === user.id && (
                  <Check className="h-4 w-4 text-blue-600 ml-2" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => setActiveUser(null)}
          className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600 py-2"
        >
          Switch Profile / Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActiveUserSelector;
