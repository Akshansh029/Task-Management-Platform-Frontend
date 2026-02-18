"use client";

import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  Users,
  ArrowRight,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { useProjects } from "@/lib/hooks/useProjects";
import { useUsers } from "@/lib/hooks/useUsers";
import { useTasks } from "@/lib/hooks/useTasks";
import { useActiveUser } from "@/providers/ActiveUserContext";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import TaskStatusBadge from "@/components/tasks/TaskStatusBadge";
import TaskPriorityBadge from "@/components/tasks/TaskPriorityBadge";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon: Icon, colorClass, isLoading }) => (
  <Card className="overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-shadow">
    <div className={`h-1.5 ${colorClass}`} />
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {title}
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
          )}
        </div>
        <div
          className={`p-3 rounded-2xl ${colorClass.replace("bg-", "bg-opacity-10 text-").replace("text-", "text-opacity-100")}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { activeUser } = useActiveUser();
  const { projects, isLoading: projectsLoading } = useProjects(0, 50);
  const { users, isLoading: usersLoading } = useUsers(0, 50);

  const { tasks, isLoading: tasksLoading } = useTasks(undefined, 0, 50);
  const isLoading = projectsLoading || usersLoading || tasksLoading;

  // Stats calculation
  const totalProjects = projects.totalElements;
  const totalTasks = tasks.totalElements;
  const inProgressTasks = tasks.content.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const totalUsers = users.totalElements;

  // Recent data
  const recentProjects = projects.content.slice(0, 4);
  const myTasks = tasks.content
    .filter((t) => t.assigneeId === activeUser?.id)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        title={`Welcome back, ${activeUser?.name || "User"}!`}
        subtitle="Here's a quick look at what's happening in your workspace today."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={FolderKanban}
          colorClass="bg-blue-600 text-blue-600"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={CheckSquare}
          colorClass="bg-indigo-600 text-indigo-600"
          isLoading={isLoading}
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          icon={Clock}
          colorClass="bg-amber-600 text-amber-600"
          isLoading={isLoading}
        />
        <StatCard
          title="Team Members"
          value={totalUsers}
          icon={Users}
          colorClass="bg-purple-600 text-purple-600"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50 px-6 py-4">
            <CardTitle className="text-lg font-bold flex items-center">
              <TrendingUp className="h-5 w-5 mr-3 text-blue-600" />
              Recent Projects
            </CardTitle>
            <Link
              href="/projects"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center uppercase tracking-wider group"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentProjects.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        {project.title.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>By {project.ownerName}</span>
                          <span>•</span>
                          <span>{project.totalTasks || 0} tasks</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-400 group-hover:text-blue-500">
                      <span className="text-[10px] mr-2 hidden sm:inline">
                        Updated {formatDate(project.createdAt)}
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500 italic">
                  No projects found.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Tasks */}
        <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50 px-6 py-4">
            <CardTitle className="text-lg font-bold flex items-center">
              <CheckSquare className="h-5 w-5 mr-3 text-indigo-600" />
              Assigned to Me
            </CardTitle>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Upcoming
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {myTasks.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {myTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}?projectId=${task.projectId}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-2 h-2 rounded-full ${task.priority === "URGENT" ? "bg-red-500 ring-4 ring-red-50" : "bg-gray-300"}`}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <TaskStatusBadge status={task.status} />
                          <TaskPriorityBadge priority={task.priority} />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-700">
                        {task.project?.title}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {task.dueDate
                          ? formatDate(task.dueDate)
                          : "No due date"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500 italic">
                  You have no tasks assigned to you.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
