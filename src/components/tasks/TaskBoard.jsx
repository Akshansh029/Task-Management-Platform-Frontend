"use client";

import React from "react";
import TaskCard from "./TaskCard";
import { TASK_STATUSES } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const TaskBoard = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onAddTask,
  projectId,
}) => {
  // Group tasks by status
  const columns = TASK_STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {});

  const getColumnTitle = (status) => {
    switch (status) {
      case "TODO":
        return "To Do";
      case "IN_PROGRESS":
        return "In Progress";
      case "DONE":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
      {TASK_STATUSES.map((status) => (
        <div key={status} className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wider">
                {getColumnTitle(status)}
              </h3>
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-bold bg-gray-100 text-gray-600"
              >
                {columns[status].length}
              </Badge>
            </div>
            {status === "TODO" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-blue-600"
                onClick={() => onAddTask(status)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-col space-y-3 min-h-[500px] bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
            {columns[status].map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                projectId={projectId}
              />
            ))}

            {columns[status].length === 0 && (
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center p-8">
                <span className="text-xs text-slate-400 italic">
                  No tasks here
                </span>
              </div>
            )}

            {status === "TODO" && (
              <Button
                variant="ghost"
                className="w-full justify-start text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 mt-2 h-9"
                onClick={() => onAddTask(status)}
              >
                <Plus className="h-3.5 w-3.5 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
