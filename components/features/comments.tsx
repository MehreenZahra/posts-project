"use client";

import { useState, useEffect } from "react";
import { Send, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Comment } from "@/types/global";
import { useAuth } from "@/contexts/auth-context";
import { useComments } from "@/contexts/comments-context";
import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentsProps {
  postId: number;
}

export function Comments({ postId }: CommentsProps) {
  const { user } = useAuth();
  const { comments, addComment, editComment, deleteComment, fetchComments } =
    useComments();
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const postComments = comments[postId] || [];

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        await fetchComments(postId);
      } finally {
        setIsLoading(false);
      }
    };
    loadComments();
  }, [postId, fetchComments]);

  const handleStartEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditText(comment.body);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await addComment(postId, newComment, {
        email: user.email,
        name: user.name,
      });
      setNewComment("");
      toast({
        title: "✅ Comment added successfully",
        description: "Your comment has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editText.trim()) return;
    editComment(postId, commentId, editText);
    setEditingComment(null);
    toast({
      title: "✅ Comment updated",
      description: "Your comment has been updated successfully.",
    });
  };

  const handleDelete = (commentId: number) => {
    deleteComment(postId, commentId);
    setDeleteCommentId(null);
    toast({
      title: "✅ Comment deleted",
      description: "Your comment has been deleted successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="flex gap-3 rounded-lg border bg-card p-4">
              <div className="h-8 w-8 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 rounded bg-muted"></div>
                <div className="h-3 w-32 rounded bg-muted"></div>
                <div className="h-4 w-full rounded bg-muted"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <form onSubmit={handleAddComment} className="flex gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px]"
          />
          <Button type="submit" size="icon" disabled={!newComment.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-4">
          {postComments.length > 0 ? (
            postComments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {comment.author.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {comment.author.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {comment.author.email}
                      </p>
                    </div>
                    {user?.email === comment.author.email && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStartEdit(comment)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteCommentId(comment.id)}
                            className="cursor-pointer font-semibold text-destructive hover:text-destructive-foreground dark:hover:text-white"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  {editingComment === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingComment(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(comment.id)}
                          disabled={!editText.trim()}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {comment.body}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={deleteCommentId !== null}
        onOpenChange={() => setDeleteCommentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCommentId && handleDelete(deleteCommentId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
