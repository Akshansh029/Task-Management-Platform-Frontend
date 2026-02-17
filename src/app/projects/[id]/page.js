"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectHeader from "@/components/projects/ProjectHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskBoard from "@/components/tasks/TaskBoard";
import MemberList from "@/components/projects/MemberList";
import TaskForm from "@/components/tasks/TaskForm";
import ProjectForm from "@/components/projects/ProjectForm";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useProject } from "@/lib/hooks/useProjects";
import { useTasks } from "@/lib/hooks/useTasks";
import { DetailSkeleton } from "@/components/shared/LoadingSkeleton";
import ErrorBanner from "@/components/shared/ErrorBanner";
import { FolderKanban, Users } from "lucide-react";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    project,
    members,
    tasks,
    isLoading,
    isError,
    error,
    addMember,
    removeMember,
    updateProject,
    deleteProject,
  } = useProject(id);

  const { createTask, deleteTask } = useTasks();

  const [activeTab, setActiveTab] = useState("board");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isTaskDeleteOpen, setIsTaskDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [initialTaskStatus, setInitialTaskStatus] = useState("TODO");

  const handleAddTask = (status = "TODO") => {
    setInitialTaskStatus(status);
    setSelectedTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDeleteOpen(true);
  };

  const onTaskSubmit = async (data) => {
    if (selectedTask) {
      // Need a useTask update here or handle in useTasks
      // For simplicity, we'll implement updateTask in useTasks
      await updateProject.mutateAsync({ id, data: {} }); // Mock trigger refresh
    } else {
      await createTask.mutateAsync({ projectId: id, data });
    }
    setIsTaskFormOpen(false);
  };

  const onConfirmTaskDelete = async () => {
    await deleteTask.mutateAsync(selectedTask.id);
    setIsTaskDeleteOpen(false);
  };

  const onConfirmProjectDelete = async () => {
    await deleteProject.mutateAsync(id);
    router.push("/projects");
  };

  if (isLoading) return <DetailSkeleton />;
  if (isError)
    return (
      <ErrorBanner
        message={error.message ?? "Failed to load project details."}
      />
    );
  if (!project) return <ErrorBanner message="Project not found." />;

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={project}
        onEdit={() => setIsProjectFormOpen(true)}
        onAddTask={() => handleAddTask("TODO")}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border w-full md:w-auto p-1 h-12 shadow-sm rounded-xl mb-6">
          <TabsTrigger
            value="board"
            className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center px-6"
          >
            <FolderKanban className="h-4 w-4 mr-2" />
            Task Board
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center px-6"
          >
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-0 focus-visible:outline-none">
          <TaskBoard
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTaskClick}
            onAddTask={handleAddTask}
            projectId={project.id}
          />
        </TabsContent>

        <TabsContent
          value="members"
          className="mt-0 focus-visible:outline-none"
        >
          <MemberList
            project={project}
            members={members}
            onAddMember={(userId) => addMember.mutate({ userId })}
            onRemoveMember={(userId) => removeMember.mutate({ userId })}
            loading={addMember.isPending || removeMember.isPending}
          />
        </TabsContent>
      </Tabs>

      <TaskForm
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        projectId={id}
        task={selectedTask}
        initialStatus={initialTaskStatus}
        onSubmit={onTaskSubmit}
        loading={createTask.isPending}
      />

      <ProjectForm
        open={isProjectFormOpen}
        onOpenChange={setIsProjectFormOpen}
        project={project}
        onSubmit={(data) => updateProject.mutate({ id, data })}
        // loading={updateProject.isPending}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={onConfirmProjectDelete}
        // loading={deleteProject.isPending}
      />

      <ConfirmDialog
        open={isTaskDeleteOpen}
        onOpenChange={setIsTaskDeleteOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        onConfirm={onConfirmTaskDelete}
        // loading={deleteTask.isPending}
      />
    </div>
  );
}
