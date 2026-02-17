'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FolderPlus } from 'lucide-react';
import ProjectGrid from '@/components/projects/ProjectGrid';
import ProjectForm from '@/components/projects/ProjectForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useProjects } from '@/lib/hooks/useProjects';
import { CardGridSkeleton } from '@/components/shared/LoadingSkeleton';
import ErrorBanner from '@/components/shared/ErrorBanner';
import EmptyState from '@/components/shared/EmptyState';

export default function ProjectsPage() {
  const { 
    projects, 
    isLoading, 
    isError, 
    error, 
    createProject, 
    updateProject, 
    deleteProject 
  } = useProjects();

  console.log(projects);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = projects.content.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <PageHeader title="Projects" subtitle="Manage and track your team projects" actions={actions} />
        <ErrorBanner message={error.userMessage} />
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : filteredProjects.length > 0 ? (
        <ProjectGrid 
          projects={filteredProjects} 
          onEdit={handleEdit} 
          onDelete={handleDeleteClick} 
        />
      ) : (
        <EmptyState
          icon={FolderPlus}
          title={searchQuery ? "No matching projects" : "No projects created"}
          description={searchQuery 
            ? `We couldn't find any projects matching "${searchQuery}".` 
            : "Get started by creating your first project to organize your team's work."
          }
          action={!searchQuery && (
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Project
            </Button>
          )}
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
