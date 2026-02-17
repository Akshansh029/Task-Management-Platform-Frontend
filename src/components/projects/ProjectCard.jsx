"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  CheckSquare,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <Card
      className="group hover:shadow-md transition-all cursor-pointer border-t-4 overflow-hidden"
      style={{ borderTopColor: "#3b82f6" }}
      onClick={handleClick}
    >
      <CardHeader className="p-5 pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 min-h-8">
              {project.description || "No description provided."}
            </p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(project)}
                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-2 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-400 font-normal">Owner</span>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-blue-50 text-blue-700">
                {getInitials(project.ownerName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{project.ownerName}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <Users className="h-4 w-4" />
            <span className="text-sm">{project.totalMembers || 0} Members</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <CheckSquare className="h-4 w-4" />
            <span className="text-sm">{project.totalTasks || 0} Tasks</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-5 py-3 border-t bg-gray-50/50">
        <div className="flex items-center space-x-2 text-xs text-gray-500 w-full justify-between">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </span>
          </div>
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 font-normal border-blue-100"
          >
            Active
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
