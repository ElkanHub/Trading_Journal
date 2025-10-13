
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/lib/hooks/use-toast';

interface ReplyFormProps {
  feedbackId: string;
  onReply: (feedbackId: string, reply: string) => Promise<void>;
}

const ReplyForm = ({ feedbackId, onReply }: ReplyFormProps) => {
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) {
      toast({ title: 'Error', description: 'Reply cannot be empty.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await onReply(feedbackId, reply);
      setReply('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <Textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write a reply..."
        rows={3}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Replying...' : 'Reply'}
      </Button>
    </form>
  );
};

export default ReplyForm;
