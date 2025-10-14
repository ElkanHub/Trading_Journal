
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { addFeedback, getFeedback } from '@/lib/db/beta';
import { toast } from '@/lib/hooks/use-toast';
import { FeedbackData } from '@/lib/db/beta';

const Feedback = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [featureRequest, setFeatureRequest] = useState('');
  const [previousFeedback, setPreviousFeedback] = useState<FeedbackData[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (user) {
        const feedbackList = await getFeedback(user.uid);
        setPreviousFeedback(feedbackList);
      }
    };

    fetchFeedback();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to submit feedback.' });
      return;
    }

    if (!feedback.trim() && !featureRequest.trim()) {
      toast({ title: 'Error', description: 'Feedback or feature request cannot be empty.' });
      return;
    }

    try {
      await addFeedback({
        userId: user.uid,
        feedback,
        featureRequest,
        createdAt: new Date(),
      });
      toast({ title: 'Success', description: 'Feedback submitted successfully!' });
      setFeedback('');
      setFeatureRequest('');
      // Refresh feedback list
      const feedbackList = await getFeedback(user.uid);
      setPreviousFeedback(feedbackList);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({ title: 'Error', description: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Leave a Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-muted-foreground">Your Feedback</label>
          <textarea
            id="feedback"
            rows={4}
            className="mt-1 block w-full border border-input rounded-md shadow-sm p-2"
            placeholder="Tell us what you think..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="featureRequest" className="block text-sm font-medium text-muted-foreground">Feature Request</label>
          <textarea
            id="featureRequest"
            rows={4}
            className="mt-1 block w-full border border-input rounded-md shadow-sm p-2"
            placeholder="What new features would you like to see?"
            value={featureRequest}
            onChange={(e) => setFeatureRequest(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
          Submit
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Your Previous Feedback</h3>
        <div className="space-y-4">
          {previousFeedback.length > 0 ? (
            previousFeedback.map((fb) => (
              <div key={fb.id} className="border p-4 rounded-lg shadow-sm">
                <p className="text-muted-foreground">{fb.feedback}</p>
                {fb.featureRequest && <p className="text-muted-foreground mt-2"><strong>Feature Request:</strong> {fb.featureRequest}</p>}
                {fb.replies && fb.replies.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Replies:</h4>
                    {fb.replies.map((reply, index: number) => (
                      <div key={index} className="border-l-2 border-primary pl-2">
                        <p className="text-sm text-muted-foreground">{reply.reply}</p>
                        <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="border p-4 rounded-lg shadow-sm">
              <p className="text-muted-foreground">You haven't submitted any feedback yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
