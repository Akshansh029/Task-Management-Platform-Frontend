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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const MemberList = ({
  project,
  members,
  onAddMultipleMembers,
  onRemoveMember,
  loading,
}) => {
  const { activeUser, users } = useActiveUser();
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Check if active user can manage members
  const isAdmin = activeUser?.role === "ADMIN";
  const isOwner = activeUser?.id === project?.ownerId;
  const canManage = isAdmin || isOwner;

  // Filter out users who are already members
  const memberIds = members.content.map((m) => m.id);
  const nonMembers = users.content.filter((u) => !memberIds.includes(u.id));

  const filteredUsers = nonMembers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleAddMembers = () => {
    onAddMultipleMembers(Array.from(selectedUsers));
    setOpen(false);
    setSelectedUsers(new Set());
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-blue-600" />
          Project Team
        </h3>

        {canManage && (
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) {
                setSelectedUsers(new Set());
                setSearchQuery("");
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Members
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Team Members</DialogTitle>
                <DialogDescription>
                  Search and select users to add to this project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="border rounded-md">
                  <ScrollArea className="h-[300px]">
                    <div className="p-4 space-y-4">
                      {filteredUsers.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground py-8">
                          No users found.
                        </p>
                      ) : (
                        filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-4 space-y-0"
                          >
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={selectedUsers.has(user.id)}
                              onChange={() => toggleUser(user.id)}
                              className="mt-0"
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="flex items-center space-x-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span>{user.name}</span>
                                <span className="text-xs text-muted-foreground font-normal">
                                  {user.email}
                                </span>
                              </div>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                  <span>{selectedUsers.size} users selected</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (selectedUsers.size === filteredUsers.length) {
                        setSelectedUsers(new Set());
                      } else {
                        const newSelected = new Set(selectedUsers);
                        filteredUsers.forEach((u) => newSelected.add(u.id));
                        setSelectedUsers(newSelected);
                      }
                    }}
                    className="h-auto p-0"
                  >
                    {selectedUsers.size === filteredUsers.length &&
                    filteredUsers.length > 0
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMembers}
                  disabled={selectedUsers.size === 0 || loading}
                >
                  Add ({selectedUsers.size})
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
