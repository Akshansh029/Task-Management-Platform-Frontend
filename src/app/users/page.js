"use client";

import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import UserTable from "@/components/users/UserTable";
import UserForm from "@/components/users/UserForm";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useUsers } from "@/lib/hooks/useUsers";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import ErrorBanner from "@/components/shared/ErrorBanner";
import EmptyState from "@/components/shared/EmptyState";
import { Users as UsersIcon } from "lucide-react";

export default function UsersPage() {
  const {
    users,
    isLoading,
    isError,
    error,
    pageNo,
    setPageNo,
    search,
    setSearch,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const onFormSubmit = async (data) => {
    if (selectedUser) {
      await updateUser.mutateAsync({ id: selectedUser.id, data });
    } else {
      await createUser.mutateAsync(data);
    }
    setIsFormOpen(false);
  };

  const onConfirmDelete = async () => {
    await deleteUser.mutateAsync(selectedUser.id);
    setIsDeleteOpen(false);
  };

  const actions = (
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      New User
    </Button>
  );

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Users"
          subtitle="Manage platform users and roles"
          actions={actions}
        />
        <ErrorBanner message={error.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage platform users and roles"
        actions={actions}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <TableSkeleton columns={5} rows={6} />
      ) : users.content.length > 0 ? (
        <>
          <UserTable
            users={users.content}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">{users.numberOfElements}</span> of{" "}
              <span className="font-medium">{users.totalElements}</span> users
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNo((prev) => Math.max(0, prev - 1))}
                disabled={users.first || pageNo === 0}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1 px-4">
                <span className="text-sm font-medium">Page {pageNo + 1}</span>
                <span className="text-sm text-gray-500">
                  of {users.totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNo((prev) => prev + 1)}
                disabled={users.last}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={UsersIcon}
          title={search ? "No matches found" : "No users yet"}
          description={
            search
              ? `Your search for "${search}" didn't return any results.`
              : "Get started by adding your first team member to the platform."
          }
          action={
            !search && (
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            )
          }
        />
      )}

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
        onSubmit={onFormSubmit}
        loading={createUser.isPending || updateUser.isPending}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        onConfirm={onConfirmDelete}
        loading={deleteUser.isPending}
      />
    </div>
  );
}
