import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as usersApi from "@/lib/api/users";
import { useToast } from "@/lib/hooks/use-toast";

export function useUsers(initialPage = 0, initialSize = 10) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pageNo, setPageNo] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [search, setSearch] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users", pageNo, pageSize, search],
    queryFn: () => usersApi.getUsers(pageNo, pageSize, search),
  });

  const createUserMutation = useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", data.id] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.updateUserRole(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", data.id] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  return {
    users: usersQuery.data || { content: [] },
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    pageNo,
    pageSize,
    setPageNo,
    setPageSize,
    search,
    setSearch,
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    updateUserRole: updateUserRoleMutation,
    deleteUser: deleteUserMutation,
  };
}

export function useUser(id) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  });
}
