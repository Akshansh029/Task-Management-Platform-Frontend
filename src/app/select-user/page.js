"use client";

import React from "react";
import { useActiveUser } from "@/providers/ActiveUserContext";
import { useUsers } from "@/lib/hooks/useUsers";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import UserRoleBadge from "@/components/users/UserRoleBadge";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SelectUserPage() {
  const { users, isLoading, pageNo, setPageNo } = useUsers(0, 6); // Smaller page size for the cards
  const { setActiveUser } = useActiveUser();
  const router = useRouter();

  const handleSelect = (user) => {
    setActiveUser(user);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-500 font-medium">
            Loading workspace users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-4xl w-full space-y-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Select your profile to continue to your workspace
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(users.content || []).map((user) => (
            <Card
              key={user.id}
              className="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:shadow-xl transition-all duration-300 group overflow-hidden border-none shadow-sm"
              onClick={() => handleSelect(user)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <Avatar className="h-20 w-20 ring-4 ring-slate-100 group-hover:ring-blue-50 transition-all">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>

                <UserRoleBadge role={user.role} />
              </CardContent>
            </Card>
          ))}
        </div>

        {users.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 pt-4">
            <Button
              variant="ghost"
              onClick={() => setPageNo((prev) => Math.max(0, prev - 1))}
              disabled={users.first || pageNo === 0}
            >
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {pageNo + 1} of {users.totalPages}
            </div>
            <Button
              variant="ghost"
              onClick={() => setPageNo((prev) => prev + 1)}
              disabled={users.last}
            >
              Next
            </Button>
          </div>
        )}

        {(users.content || []).length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
            <p className="text-slate-500 italic text-lg">
              No users found in the system. Please ensure the backend is
              running.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
