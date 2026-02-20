"use client";

import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FolderPlus } from "lucide-react";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectForm from "@/components/projects/ProjectForm";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useProjects } from "@/lib/hooks/useProjects";
import { CardGridSkeleton } from "@/components/shared/LoadingSkeleton";
import ErrorBanner from "@/components/shared/ErrorBanner";
import EmptyState from "@/components/shared/EmptyState";

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
    isError,
    error,
    pageNo,
    setPageNo,
    pageSize,
    createProject,
    updateProject,
    deleteProject,
    search,
    setSearch,
  } = useProjects();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleCreate = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const onFormSubmit = async (data) => {
    if (selectedProject) {
      await updateProject.mutateAsync({ id: selectedProject.id, data });
    } else {
      await createProject.mutateAsync(data);
    }
    setIsFormOpen(false);
  };

  const onConfirmDelete = async () => {
    await deleteProject.mutateAsync(selectedProject.id);
    setIsDeleteOpen(false);
  };

  const actions = (
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      New Project
    </Button>
  );

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Projects"
          subtitle="Manage and track your team projects"
          actions={actions}
        />
        <ErrorBanner message={error.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Manage and track your team projects"
        actions={actions}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search projects..."
          className="pl-9 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : (projects?.content?.length || 0) > 0 ? (
        <>
          <ProjectGrid
            projects={projects?.content || []}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">{projects.numberOfElements}</span>{" "}
              of <span className="font-medium">{projects.totalElements}</span>{" "}
              projects
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNo((prev) => Math.max(0, prev - 1))}
                disabled={projects.first || pageNo === 0}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1 px-4">
                <span className="text-sm font-medium">Page {pageNo + 1}</span>
                <span className="text-sm text-gray-500">
                  of {projects.totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNo((prev) => prev + 1)}
                disabled={projects.last}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={FolderPlus}
          title={search ? "No matching projects" : "No projects created"}
          description={
            search
              ? `We couldn't find any projects matching "${search}".`
              : "Get started by creating your first project to organize your team's work."
          }
          action={
            !search && (
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            )
          }
        />
      )}

      <ProjectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        project={selectedProject}
        onSubmit={onFormSubmit}
        loading={createProject.isPending || updateProject.isPending}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${selectedProject?.title}"? All tasks and data within this project will be permanently removed.`}
        onConfirm={onConfirmDelete}
        loading={deleteProject.isPending}
      />
    </div>
  );
}
