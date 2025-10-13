
  "use client";

  import React, { useState, useEffect } from 'react';
  import { useAuth } from '@/lib/hooks/useAuth';
  import { useAdminService } from '@/lib/hooks/useAdminService';
  import { toast } from '@/lib/hooks/use-toast';
  import { useDatabase } from '@/contexts/DatabaseContext';
  import { Switch } from "@/components/ui/switch";
  
  import { Label } from "@/components/ui/label";
  import ReplyForm from './ReplyForm';
  
  // In a real app, this should be stored in a secure way, not hardcoded
  const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID; // Replace with your actual admin UID
  
  const AdminDashboard = () => {
    const { user } = useAuth();
    const { dbType, setDbType } = useDatabase();
    const adminService = useAdminService();
    const [feedback, setFeedback] = useState<any[]>([]);
    const [aboutTitle, setAboutTitle] = useState('');
    const [aboutContent, setAboutContent] = useState('');
  
    const handleDbSwitch = (isFirestore: boolean) => {
      setDbType(isFirestore ? 'firestore' : 'realtime');
    };
  
    useEffect(() => {
      const fetchFeedback = async () => {
        if (user && user.uid === ADMIN_UID) {
          const feedbackList = await adminService.getFeedback('all'); // 'all' to fetch all feedback
          setFeedback(feedbackList);
        }
      };
  
      fetchFeedback();
    }, [user, adminService]);
  
    const handleReply = async (feedbackId: string, reply: string) => {
      try {
        await adminService.addFeedbackReply({ feedbackId, reply, createdAt: new Date() });
        toast({ title: 'Success', description: 'Reply sent successfully!' });
        // Refresh feedback list to show the reply
        const feedbackList = await adminService.getFeedback('all');
        setFeedback(feedbackList);
      } catch (error) {
        toast({ title: 'Error', description: 'Something went wrong. Please try again.' });
      }
    };
  
    const handleAddAbout = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await adminService.addAboutInfo({ title: aboutTitle, content: aboutContent, createdAt: new Date(), isNew: true });
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="db-switch">Use Firestore</Label>
            <Switch
              id="db-switch"
              checked={dbType === 'firestore'}
              onCheckedChange={handleDbSwitch}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">User Feedback</h2>
            <div className="space-y-4">
              {feedback.map((fb) => (
                <div key={fb.id} className="border p-4 rounded-lg shadow-sm">
                  <p className="text-muted-foreground">{fb.feedback}</p>
                  {fb.featureRequest && <p className="text-muted-foreground mt-2"><strong>Feature Request:</strong> {fb.featureRequest}</p>}
                  <ReplyForm feedbackId={fb.id} onReply={handleReply} />
                  {fb.replies && fb.replies.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold">Replies:</h4>
                      {fb.replies.map((reply: any, index: number) => (
                        <div key={index} className="border-l-2 border-primary pl-2">
                          <p className="text-sm text-muted-foreground">{reply.reply}</p>
                          <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
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
  
