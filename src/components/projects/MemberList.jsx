"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Search, ShieldCheck } from "lucide-react";
import { getInitials } from "@/lib/utils";
import UserRoleBadge from "@/components/users/UserRoleBadge";
import { useActiveUser } from "@/providers/ActiveUserContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const MemberList = ({
  project,
  members,
  onAddMember,
  onRemoveMember,
  loading,
}) => {
  const { activeUser, users } = useActiveUser();
  const [open, setOpen] = useState(false);

  // Check if active user can manage members
  const isAdmin = activeUser?.role === "ADMIN";
  const isOwner = activeUser?.id === project?.owner?.id;
  const canManage = isAdmin || isOwner;

  // Filter out users who are already members
  const memberIds = members.content.map((m) => m.id);
  const nonMembers = users.content.filter((u) => !memberIds.includes(u.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-blue-600" />
          Project Team
        </h3>

        {canManage && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[240px]" align="end">
              <Command>
                <CommandInput placeholder="Search users..." />
                <CommandList>
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup heading="Platform Users">
                    {nonMembers.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => {
                          onAddMember(user.id);
                          setOpen(false);
                        }}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px]">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-12"></TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              {canManage && (
                <TableHead className="text-right">Action</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.content.map((member) => (
              <TableRow key={member.id} className="group transition-colors">
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-slate-100 text-slate-700 text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {member.name}
                    </span>
                    {project.owner?.id === member.id && (
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                        Owner
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{member.email}</TableCell>
                <TableCell>
                  <UserRoleBadge role={member.role} />
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    {project.owner?.id !== member.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => onRemoveMember(member.id)}
                        disabled={loading}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {members.totalElements === 0 && (
              <TableRow>
                <TableCell
                  colSpan={canManage ? 5 : 4}
                  className="h-32 text-center text-gray-500 italic"
                >
                  No members added to this project yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MemberList;
