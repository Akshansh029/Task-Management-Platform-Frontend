'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import LabelBadge from '@/components/labels/LabelBadge';
import LabelForm from '@/components/labels/LabelForm';
import { useLabels } from '@/lib/hooks/useLabels';
import { CardGridSkeleton } from '@/components/shared/LoadingSkeleton';
import ErrorBanner from '@/components/shared/ErrorBanner';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

export default function LabelsPage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState(null);
  const { labels, isLoading, isError, error, createLabel, deleteLabel } = useLabels();

  const handleCreate = (data) => {
    createLabel.mutate(data, {
      onSuccess: () => setIsFormOpen(false)
    });
  };

  const handleDeleteClick = (label) => {
    setSelectedLabel(label);
    setIsDeleteOpen(true);
  };

  const onConfirmDelete = () => {
    deleteLabel.mutate(selectedLabel.id, {
      onSuccess: () => setIsDeleteOpen(false)
    });
  };

  const actions = (
    <Button onClick={() => setIsFormOpen(true)}>
      <Plus className="h-4 w-4 mr-2" />
      New Label
    </Button>
  );

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Labels" subtitle="Manage task categories and tags" actions={actions} />
        <ErrorBanner message={error.userMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Labels" 
        subtitle="Manage task categories and tags" 
        actions={actions} 
      />

      {isLoading ? (
        <CardGridSkeleton count={8} />
      ) : labels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {labels.map((label) => (
            <Card key={label.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div 
                    className="w-4 h-4 rounded-full shrink-0" 
                    style={{ backgroundColor: label.color }} 
                  />
                  <span className="font-medium text-gray-900 truncate">{label.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteClick(label)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Tag}
          title="No labels yet"
          description="Create labels to categorize your tasks and keep your projects organized."
          action={
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Label
            </Button>
          }
        />
      )}

      <LabelForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreate}
        loading={createLabel.isPending}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Label"
        description={`Are you sure you want to delete the "${selectedLabel?.name}" label? This will remove it from all tasks.`}
        onConfirm={onConfirmDelete}
        loading={deleteLabel.isPending}
      />
    </div>
  );
}
