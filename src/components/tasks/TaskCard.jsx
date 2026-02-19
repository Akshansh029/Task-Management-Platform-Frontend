"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  User,
} from "lucide-react";
import { formatDate, getInitials, isOverdue } from "@/lib/utils";
import { useRouter } from "next/navigation";
import TaskPriorityBadge from "./TaskPriorityBadge";
import LabelBadge from "@/components/labels/LabelBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const TaskCard = ({ task, onEdit, onDelete, projectId, members, onAssign }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tasks/${task.id}?projectId=${projectId}`);
  };

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <Card
      className="group p-4 space-y-3 hover:shadow-md transition-shadow cursor-pointer border-slate-200"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <TaskPriorityBadge priority={task.priority} />
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task)}
                className="text-red-600 focus:text-red-700 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h4 className="font-medium text-sm text-gray-900 leading-tight">
        {task.title}
      </h4>

      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <LabelBadge
              key={label.id}
              label={label}
              className="text-[10px] px-1.5 py-0"
            />
          ))}
        </div>
      )}

      <div className="pt-2 flex items-center justify-between">
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {task.assigneeName ? (
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors group/assignee">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[8px] bg-blue-50 text-blue-700">
                      {getInitials(task.assigneeName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] font-medium text-gray-600 truncate max-w-[80px]">
                    {task.assigneeName}
                  </span>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[10px] text-gray-400 italic hover:text-blue-600 group/unassigned"
                >
                  <UserPlus className="h-3 w-3 mr-1 opacity-0 group-hover/unassigned:opacity-100 transition-opacity" />
                  Unassigned
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 border-b mb-1">
                Assign to Member
              </div>
              {members?.content?.map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  onClick={() => onAssign(task.id, member.id)}
                  className="text-xs"
                >
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarFallback className="text-[7px]">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  {member.name}
                  {task.assignee?.id === member.id && (
                    <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
              {(!members?.content || members.content.length === 0) && (
                <div className="px-2 py-4 text-[10px] text-center text-gray-400 italic">
                  No members available
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.dueDate && (
          <div
            className={`flex items-center space-x-1 text-[10px] ${overdue ? "text-red-600 font-medium" : "text-gray-400"}`}
          >
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
