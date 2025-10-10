
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getFeedback, addFeedbackReply, addAboutInfo } from '@/lib/db/beta';
import { toast } from '@/lib/hooks/use-toast';

// In a real app, this should be stored in a secure way, not hardcoded
const ADMIN_UID = 'YOUR_ADMIN_UID_HERE'; // Replace with your actual admin UID

const AdminDashboard = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutContent, setAboutContent] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      if (user && user.uid === ADMIN_UID) {
        const feedbackList = await getFeedback('all'); // 'all' to fetch all feedback
        setFeedback(feedbackList);
      }
    };

    fetchFeedback();
  }, [user]);

  const handleReply = async (feedbackId: string, reply: string) => {
    try {
      await addFeedbackReply({ feedbackId, reply, createdAt: new Date() });
      toast({ title: 'Success', description: 'Reply sent successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.' });
    }
  };

  const handleAddAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAboutInfo({ title: aboutTitle, content: aboutContent, createdAt: new Date(), isNew: true });
      toast({ title: 'Success', description: 'About info added successfully!' });
      setAboutTitle('');
      setAboutContent('');
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.' });
    }
  };

  if (!user || user.uid !== ADMIN_UID) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">User Feedback</h2>
          <div className="space-y-4">
            {feedback.map((fb) => (
              <div key={fb.id} className="border p-4 rounded-lg shadow-sm">
                <p className="text-muted-foreground">{fb.feedback}</p>
                {fb.featureRequest && <p className="text-muted-foreground mt-2"><strong>Feature Request:</strong> {fb.featureRequest}</p>}
                {/* Add reply form here */}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Add About Info</h2>
          <form onSubmit={handleAddAbout} className="space-y-4">
            <div>
              <label htmlFor="aboutTitle" className="block text-sm font-medium text-muted-foreground">Title</label>
              <input
                id="aboutTitle"
                type="text"
                className="mt-1 block w-full border border-input rounded-md shadow-sm p-2"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="aboutContent" className="block text-sm font-medium text-muted-foreground">Content</label>
              <textarea
                id="aboutContent"
                rows={4}
                className="mt-1 block w-full border border-input rounded-md shadow-sm p-2"
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Add Info
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
