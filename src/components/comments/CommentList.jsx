import React from "react";
import CommentItem from "./CommentItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquareOff } from "lucide-react";

const CommentList = ({ comments, onUpdateComment, onDeleteComment }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/30">
        <MessageSquareOff className="h-8 w-8 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500 font-medium">No comments yet</p>
        <p className="text-xs text-gray-400">
          Be the first to start the conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onUpdate={onUpdateComment}
          onDelete={onDeleteComment}
        />
      ))}
    </div>
  );
};

export default CommentList;
