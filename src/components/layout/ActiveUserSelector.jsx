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
import { logout as apiLogout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";

const ActiveUserSelector = () => {
  const { activeUser, setActiveUser, users, loading } = useActiveUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiLogout();
      setActiveUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="flex flex-col items-center p-4 space-y-3 bg-slate-50 rounded-lg mb-2">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
              {getInitials(activeUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center text-center">
            <span className="text-base font-bold text-gray-900 leading-tight">
              {activeUser.name}
            </span>
            <span className="text-sm font-medium text-primary mt-0.5">
              {activeUser.role}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {activeUser.email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="grid grid-cols-3 gap-2 py-3 px-1 text-center border-b border-slate-100 mb-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {activeUser.ownedProjectsCount || 0}
            </span>
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">
              Owned
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {activeUser.assignedTasksCount || 0}
            </span>
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">
              Tasks
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {activeUser.memberOfProjectsCount || 0}
            </span>
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">
              Joined
            </span>
          </div>
        </div>

        <DropdownMenuItem
          onSelect={handleLogout}
          className="text-destructive cursor-pointer focus:bg-destructive/5 focus:text-destructive py-3 px-3 flex items-center justify-center font-bold tracking-wide rounded-md transition-all duration-200"
        >
          LOG OUT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActiveUserSelector;
