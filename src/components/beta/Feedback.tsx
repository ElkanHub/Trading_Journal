
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { addFeedback, getFeedback } from '@/lib/db/beta';
import { toast } from '@/lib/hooks/use-toast';

const Feedback = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [featureRequest, setFeatureRequest] = useState('');
  const [previousFeedback, setPreviousFeedback] = useState<any[]>([]);

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
