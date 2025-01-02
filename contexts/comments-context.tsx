'use client'

import { createContext, useContext } from 'react';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Comment, Author, CommentsContextType } from '@/types/global';


const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useLocalStorage<{ [postId: number]: Comment[] }>('comments', {});
  const { toast } = useToast();

  const fetchComments = async (postId: number) => {
    if (comments[postId]) return;

    if (postId > 100) {
      setComments(current => ({
        ...current,
        [postId]: []
      }));
      return;
    }

    try {
      const fetchedComments = await api.getPostComments(postId);
      const formattedComments = fetchedComments.map((comment: any) => ({
        id: comment.id,
        postId,
        body: comment.body,
        author: {
          email: comment.email,
          name: comment.name
        }
      }));

      setComments(current => ({
        ...current,
        [postId]: formattedComments
      }));
    } catch {
      setComments(current => ({
        ...current,
        [postId]: []
      }));
    }
  };

  const addComment = async (postId: number, body: string, author: Author) => {
    try {
      const newComment: Comment = {
        id: Date.now(),
        postId,
        body,
        author
      };

      setComments(current => ({
        ...current,
        [postId]: [newComment, ...(current[postId] || [])]
      }));

      if (postId <= 100) {
        await api.createComment(postId, {
          name: author.name,
          email: author.email,
          body
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  const editComment = (postId: number, commentId: number, body: string) => {
    setComments(current => ({
      ...current,
      [postId]: current[postId]?.map(comment =>
        comment.id === commentId
          ? { ...comment, body }
          : comment
      ) || []
    }));
  };

  const deleteComment = (postId: number, commentId: number) => {
    setComments(current => ({
      ...current,
      [postId]: current[postId]?.filter(comment => comment.id !== commentId) || []
    }));
  };
 

  return (
    <CommentsContext.Provider value={{
      comments,
      addComment,
      editComment,
      deleteComment,
      fetchComments
    }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
} 