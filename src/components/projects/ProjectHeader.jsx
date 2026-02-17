'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users as UsersIcon, 
  CheckSquare, 
  Edit, 
  Plus, 
  ArrowLeft 
} from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';
import Link from 'next/link';

const ProjectHeader = ({ project, onEdit, onAddTask }) => {
  if (!project) return null;

  return (
    <div className="space-y-6 mb-8">
      <Link 
        href="/projects" 
        className="flex items-center text-sm text-muted-foreground hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{project.title}</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-400 hover:text-blue-600"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {project.description || 'No description provided for this project.'}
          </p>
        </div>
        <Button onClick={onAddTask} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center pt-2">
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[8px] bg-blue-50 text-blue-700">
              {getInitials(project.owner?.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-gray-700">{project.owner?.name}</span>
          <span className="text-[10px] text-gray-400">Owner</span>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-700">
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </span>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
          <UsersIcon className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-700">
            {project.members?.length || 0} Members
          </span>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
          <CheckSquare className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-700">
            {project.tasks?.length || 0} Tasks
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
