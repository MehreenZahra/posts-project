'use client'
import { createContext, useContext, useEffect } from 'react';

import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

import { api } from '@/services/api';
import { Post, Author, PostsContextType } from '@/types/global';



const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useLocalStorage<Post[]>('posts', []);
  const { toast } = useToast();

  // Fetch initial posts only once when the component mounts
  useEffect(() => {
    const loadPosts = async () => {
      // Only fetch if we don't have any posts in local storage
      if (posts.length > 0) {
        return;
      }
        try {
        const response = await api.fetchPosts();
        const initialPosts = response.map((post: Post) => ({
          ...post,
          likes: post.likes ?? 0,
          likedBy: post.likedBy ?? []
        }));
          setPosts(initialPosts);
        } catch (error) {
          console.error('Error loading posts:', error);
          toast({ title: 'Error loading posts',
            description: 'Failed to load posts',
            variant: 'destructive',
           });
      }
    };

    loadPosts();
  }, [ setPosts, toast]);

  const addPost = async (title: string, content: string, author: Author) => {
        try {
          // Create a new post with a timestamp-based ID
          const newPost: Post = {
            id: Date.now(),
            title,
            body: content,
            author,
            likes: 0,
          };
    
          setPosts( [newPost, ...posts]);
    
          // Simulate API call
          await api.createPost({
            title,
            body: content,
            userId: 1
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to create post",
            variant: "destructive"
          });
        }
      };

  const deletePost = async (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const editPost = async (postId: number, title: string, body: string) => {
    setPosts(posts.map(post => (post.id === postId ? { ...post, title, body } : post)));
  };

  const likePost = (postId: number) => {
    setPosts(posts.map(post => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));
  };
  const toggleLikePost = (postId: number, userId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy?.includes(userId) ?? false;
        const likes = isLiked ? post.likes - 1 : post.likes + 1;
        const likedBy = isLiked
          ? post.likedBy?.filter(id => id !== userId) ?? []
          : [...(post.likedBy ?? []), userId];
        return { ...post, likes, likedBy };
      }
      return post;
    }));
  };

  return (
    <PostsContext.Provider value={{
       posts,
        addPost,
         deletePost,
          editPost,
           likePost,
           toggleLikePost
           }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};