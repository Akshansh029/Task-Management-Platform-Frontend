'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const CommentForm = ({ onSubmit, loading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="relative group">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] pb-12 resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-100 transition-all rounded-xl"
        />
        <div className="absolute bottom-3 right-3">
          <Button 
            type="submit" 
            size="sm" 
            disabled={!content.trim() || loading}
            className="rounded-lg px-4 shadow-sm"
          >
            {loading ? 'Posting...' : 'Post Comment'}
            <Send className="h-3.5 w-3.5 ml-2" />
          </Button>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-gray-400 text-center">
        Use comments to discuss project details and updates with your team.
      </p>
    </form>
  );
};

export default CommentForm;
