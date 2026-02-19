"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatRelativeTime, getInitials } from "@/lib/utils";
import { Edit, Trash2, Check, X } from "lucide-react";
import { useActiveUser } from "@/providers/ActiveUserContext";

const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const { activeUser } = useActiveUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = activeUser?.id === comment.authorId;

  const handleUpdate = () => {
    if (editContent.trim()) {
      onUpdate(comment.commentId, editContent);
      setIsEditing(false);
    }
  };

  return (
    <div className="group flex space-x-4 py-4 border-b last:border-0">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-[10px] bg-slate-100 text-slate-700">
          {getInitials(comment.authorName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-900">
              {comment.authorName}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span
              className="text-xs text-gray-500"
              title={formatDate(comment.createdAt)}
            >
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          {isAuthor && !isEditing && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-blue-600"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-red-600"
                onClick={() => onDelete(comment.commentId)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2 mt-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="text-sm min-h-[80px]"
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={handleUpdate} className="h-8">
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-8"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
