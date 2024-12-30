'use client'

import { AddPostCard } from "@/components/features/add-post-card";
import Navbar from "@/components/features/navbar";
import { PostCard } from "@/components/features/post-card";
import { usePosts } from "@/hooks/use-posts";
import { useState, useEffect } from "react";
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useContextAPI } from "@/contexts/auth-posts-context";

interface Post {
  id: number;
  title: string;
  body: string;
  author?: {
    email: string;
    name: string;
  };
}

export default function Home() {
  const { user } = useContextAPI();
  const { posts: fetchedPosts, loading, error } = usePosts();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (fetchedPosts) {
      // Add dummy author for fetched posts
      const postsWithAuthor = fetchedPosts.map(post => ({
        ...post,
        author: {
          email: 'dummy@example.com',
          name: 'JSONPlaceholder User'
        }
      }));
      setPosts(postsWithAuthor);
    }
  }, [fetchedPosts]);

  // Listen for post edit events
  useEffect(() => {
    const handleEditPost = (e: CustomEvent<{ postId: number; title: string; body: string }>) => {
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post.id === e.detail.postId
            ? { ...post, title: e.detail.title, body: e.detail.body }
            : post
        )
      );
    };

    const handleDeletePost = (e: CustomEvent<number>) => {
      setPosts(currentPosts => currentPosts.filter(post => post.id !== e.detail));
    };

    window.addEventListener('editPost', handleEditPost as EventListener);
    window.addEventListener('deletePost', handleDeletePost as EventListener);

    return () => {
      window.removeEventListener('editPost', handleEditPost as EventListener);
      window.removeEventListener('deletePost', handleDeletePost as EventListener);
    };
  }, []);

  const handleAddPost = (title: string, content: string, author: { email: string; name: string }) => {
    const newPost = {
      id: Date.now(),
      title,
      body: content,
      author
    };
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <main className="container mx-auto max-w-2xl px-4 py-6">
          <div className="space-y-6">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-lg bg-muted p-4 h-48" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <main className="container mx-auto max-w-2xl px-4 py-6">
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            Error: {error}
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <main className="container mx-auto max-w-2xl px-4 py-6">
          <div className="space-y-6">
            <AddPostCard onAddPost={handleAddPost} />
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                id={post.id}
                title={post.title} 
                content={post.body}
                author={post.author}
              />
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
