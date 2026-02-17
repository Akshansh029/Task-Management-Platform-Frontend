"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  User as UserIcon,
  Tag as TagIcon,
  Trash2,
  Clock,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTask } from "@/lib/hooks/useTasks";
import { useProject } from "@/lib/hooks/useProjects";
import { useComments } from "@/lib/hooks/useComments";
import { useActiveUser } from "@/providers/ActiveUserContext";
import {
  formatDate,
  getInitials,
  isOverdue,
  TASK_STATUSES,
  TASK_PRIORITIES,
} from "@/lib/utils";
import TaskStatusBadge from "@/components/tasks/TaskStatusBadge";
import TaskPriorityBadge from "@/components/tasks/TaskPriorityBadge";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";
import LabelBadge from "@/components/labels/LabelBadge";
import LabelSelector from "@/components/labels/LabelSelector";
import { DetailSkeleton } from "@/components/shared/LoadingSkeleton";
import ErrorBanner from "@/components/shared/ErrorBanner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Textarea } from "@/components/ui/textarea";

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");
  const { activeUser } = useActiveUser();

  const {
    task,
    isLoading,
    isError,
    error,
    updateTask,
    updateStatus,
    assignUser,
    deleteTask,
    addLabel,
    removeLabel,
  } = useTask(id, projectIdFromUrl);

  const { members } = useProject(projectIdFromUrl);
  const { comments, createComment, updateComment, deleteComment } =
    useComments(id);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");

  const onConfirmDelete = async () => {
    const projectId = task?.project?.id;
    await deleteTask.mutateAsync();
    setIsDeleteOpen(false);
    router.push(`/projects/${projectId}`);
  };

  const handleUpdateDescription = () => {
    updateTask.mutate(
      { ...task, description: descValue },
      {
        onSuccess: () => setIsEditingDesc(false),
      },
    );
  };

  const handleUpdateTitle = () => {
    if (titleValue.trim() && titleValue !== task.title) {
      updateTask.mutate(
        { ...task, title: titleValue },
        {
          onSuccess: () => setIsEditingTitle(false),
        },
      );
    } else {
      setIsEditingTitle(false);
    }
  };

  if (isLoading) return <DetailSkeleton />;
  if (isError)
    return (
      <ErrorBanner message={error?.message ?? "Failed to load task details"} />
    );
  if (!task) return <ErrorBanner message="Task not found." />;

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Link
        href={`/projects/${task.project?.id}`}
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors group mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to {task.project?.title}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Title, Description, Comments */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleUpdateTitle}
                  autoFocus
                  className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 bg-transparent outline-none w-full py-1"
                />
              </div>
            ) : (
              <h1
                className="text-4xl font-extrabold tracking-tight text-gray-900 cursor-pointer hover:bg-gray-100/50 rounded-md p-1 transition-colors"
                onClick={() => {
                  setTitleValue(task.title);
                  setIsEditingTitle(true);
                }}
              >
                {task.title}
              </h1>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  Description
                </h3>
                {!isEditingDesc && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      setDescValue(task.description || "");
                      setIsEditingDesc(true);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1.5" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditingDesc ? (
                <div className="space-y-3">
                  <Textarea
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                    className="min-h-[150px] text-gray-700 leading-relaxed"
                    placeholder="Describe this task..."
                    autoFocus
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={handleUpdateDescription}
                      // disabled={updateTask.isPending}
                    >
                      Save Changes
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingDesc(false)}
                      // disabled={updateTask.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 shadow-sm whitespace-pre-wrap">
                  {task.description || (
                    <span className="text-gray-400 italic">
                      No description provided for this task.
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              Discussion
              <Badge
                variant="secondary"
                className="ml-3 bg-gray-100 text-gray-600 font-bold px-2 rounded-full"
              >
                {comments.length}
              </Badge>
            </h3>
            <CommentList
              comments={comments}
              onUpdateComment={(id, content) =>
                updateComment.mutate({ id, data: { content } })
              }
              onDeleteComment={(id) => deleteComment.mutate(id)}
            />
            <CommentForm
              onSubmit={(content) =>
                createComment.mutate({ content, authorId: activeUser?.id })
              }
              loading={createComment.isPending}
            />
          </div>
        </div>

        {/* Right Column: Metadata Panel */}
        <div className="space-y-6">
          <Card className="sticky top-8 shadow-sm border-gray-200 overflow-hidden rounded-2xl">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <CardContent className="p-6 space-y-8">
              {/* Status */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                  Current Status
                </label>
                <Select
                  value={task.status}
                  onValueChange={(val) => updateStatus.mutate(val)}
                >
                  <SelectTrigger className="w-full h-11 bg-gray-50/50 border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue>
                      <TaskStatusBadge status={task.status} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        <TaskStatusBadge status={s} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                  Priority level
                </label>
                <Select
                  value={task.priority}
                  onValueChange={(val) =>
                    updateTask.mutate({ ...task, priority: val })
                  }
                >
                  <SelectTrigger className="w-full h-11 bg-gray-50/50 border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue>
                      <TaskPriorityBadge priority={task.priority} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        <TaskPriorityBadge priority={p} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  Assignee
                </label>
                <Select
                  value={task.assignee?.id?.toString() || ""}
                  onValueChange={(val) => assignUser.mutate(parseInt(val))}
                >
                  <SelectTrigger className="w-full h-11 bg-gray-50/50 border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue
                      placeholder={task.assigneeName || "Unassigned"}
                    >
                      {/* {task.assigneeName && ( */}
                      {/* <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[8px] bg-blue-50 text-blue-700">
                            {getInitials(task.assigneeName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {task.assigneeName}
                        </span>
                      </div> */}
                      {/* )} */}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {members.content.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[8px]">
                              {getInitials(m.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{m.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Labels */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block font-semibold">
                  Categories & Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {task.labels?.map((l) => (
                    <LabelBadge
                      key={l.id}
                      label={l}
                      onRemove={() => removeLabel.mutate(l.id)}
                    />
                  ))}
                  {(!task.labels || task.labels.length === 0) && (
                    <span className="text-xs text-slate-400 italic">
                      No labels
                    </span>
                  )}
                </div>
                <LabelSelector
                  selectedLabelIds={task.labels?.map((l) => l.id)}
                  onSelect={(id) => addLabel.mutate(id)}
                  onRemove={(id) => removeLabel.mutate(id)}
                />
              </div>

              {/* Due Date */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block font-semibold">
                  Schedule
                </label>
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${overdue ? "bg-red-50 border-red-100 text-red-700" : "bg-gray-50 border-gray-100 text-gray-700"}`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock
                      className={`h-4 w-4 ${overdue ? "text-red-500" : "text-gray-400"}`}
                    />
                    <span className="text-sm font-medium">
                      {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                    </span>
                  </div>
                  {overdue && (
                    <Badge className="bg-red-600 hover:bg-red-700 text-[9px] uppercase tracking-wider px-1.5 h-4">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>

                <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-400">
                  <span className="uppercase tracking-widest">Created</span>
                  <span className="font-bold">
                    {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Permanently Delete Task?"
        description="This will remove the task and all associated comments. This action cannot be reversed."
        onConfirm={onConfirmDelete}
        loading={deleteTask.isPending}
      />
    </div>
  );
}
