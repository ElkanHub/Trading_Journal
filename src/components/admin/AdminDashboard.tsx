"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAdminService } from "@/lib/hooks/useAdminService";
import { toast } from "@/lib/hooks/use-toast";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Switch } from "@/components/ui/switch";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/Modal";
import ReplyForm from "@/components/admin/ReplyForm";
import { FeedbackData, AboutInfo } from "@/lib/db/beta";

// In a real app, this should be stored in a secure way, not hardcoded
const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID; // Replace with your actual admin UID

const AdminDashboard = () => {
  const { user } = useAuth();
  const { dbType, setDbType } = useDatabase();
  const adminService = useAdminService();
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo[]>([]);
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [editingAbout, setEditingAbout] = useState<AboutInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDbSwitch = (isFirestore: boolean) => {
    setDbType(isFirestore ? "firestore" : "realtime");
  };

  const fetchAboutInfo = async () => {
    const info = await adminService.getAboutInfo();
    setAboutInfo(info);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      if (user && user.uid === ADMIN_UID) {
        const feedbackList = await adminService.getFeedback("all"); // 'all' to fetch all feedback
        setFeedback(feedbackList);
      }
    };

    if (user && user.uid === ADMIN_UID) {
      fetchFeedback();
      fetchAboutInfo();
    }
  }, [user, adminService]);

  const handleReply = async (feedbackId: string, reply: string) => {
    try {
      await adminService.addFeedbackReply({
        feedbackId,
        reply,
        createdAt: new Date(),
      });
      toast({ title: "Success", description: "Reply sent successfully!" });
      // Refresh feedback list to show the reply
      const feedbackList = await adminService.getFeedback("all");
      setFeedback(feedbackList);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleAddAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutTitle.trim() || !aboutContent.trim()) {
      toast({
        title: "Error",
        description: "Title and content cannot be empty.",
      });
      return;
    }
    try {
      await adminService.addAboutInfo({
        title: aboutTitle,
        content: aboutContent,
        createdAt: new Date(),
        isNew: true,
      });
      toast({
        title: "Success",
        description: "About info added successfully!",
      });
      setAboutTitle("");
      setAboutContent("");
      fetchAboutInfo();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleDeleteAbout = async (infoId: string) => {
    try {
      await adminService.deleteAboutInfo(infoId);
      toast({
        title: "Success",
        description: "About info deleted successfully!",
      });
      fetchAboutInfo();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleEditAbout = (info: AboutInfo) => {
    setEditingAbout(info);
    setIsModalOpen(true);
  };

  const handleUpdateAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAbout) return;

    try {
      await adminService.updateAboutInfo(editingAbout.id, {
        title: editingAbout.title,
        content: editingAbout.content,
      });
      toast({
        title: "Success",
        description: "About info updated successfully!",
      });
      setIsModalOpen(false);
      setEditingAbout(null);
      fetchAboutInfo();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
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
          <ThemeSwitcher />
          <Label htmlFor="db-switch">Use Firestore</Label>
          <Switch
            id="db-switch"
            checked={dbType === "firestore"}
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
                {fb.featureRequest && (
                  <p className="text-muted-foreground mt-2">
                    <strong>Feature Request:</strong> {fb.featureRequest}
                  </p>
                )}
                <ReplyForm feedbackId={fb.id} onReply={handleReply} />
                {fb.replies && fb.replies.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Replies:</h4>
                    {fb.replies.map((reply, index: number) => (
                      <div
                        key={index}
                        className="border-l-2 border-primary pl-2"
                      >
                        <p className="text-sm text-muted-foreground">
                          {reply.reply}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage About Info</h2>
          <form onSubmit={handleAddAbout} className="space-y-4 mb-8">
            <div>
              <label
                htmlFor="aboutTitle"
                className="block text-sm font-medium text-muted-foreground"
              >
                Title
              </label>
              <input
                id="aboutTitle"
                type="text"
                className="mt-1 block w-full border border-input rounded-md shadow-sm p-2"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="aboutContent"
                className="block text-sm font-medium text-muted-foreground"
              >
                Content
              </label>
              <textarea
                id="aboutContent"
                rows={4}
                className="mt-1 block w-full border border-input rounded-md shadow-sm p-2"
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Add Info
            </button>
          </form>
          <div className="space-y-4">
            {aboutInfo.map((info) => (
              <div key={info.id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">{info.title}</h3>
                <p className="text-muted-foreground mb-2">{info.content}</p>
                <div className="flex space-x-2">
                  <Button onClick={() => handleEditAbout(info)}>Edit</Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteAbout(info.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingAbout && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit About Info"
        >
          <form onSubmit={handleUpdateAbout} className="space-y-4">
            <div>
              <label
                htmlFor="editAboutTitle"
                className="block text-sm font-medium text-muted-foreground"
              >
                Title
              </label>

              <input
                id="editAboutTitle"
                type="text"
                className="mt-1 block w-full border border-input rounded-md shadow-sm p-2"
                value={editingAbout.title}
                onChange={(e) =>
                  setEditingAbout({ ...editingAbout, title: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="editAboutContent"
                className="block text-sm font-medium text-muted-foreground"
              >
                Content
              </label>

              <textarea
                id="editAboutContent"
                rows={4}
                className="mt-1 block w-full border border-input rounded-md shadow-sm p-2"
                value={editingAbout.content}
                onChange={(e) =>
                  setEditingAbout({
                    ...editingAbout,

                    content: e.target.value,
                  })
                }
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
