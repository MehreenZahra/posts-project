'use client'

import { AddPostCard } from "@/components/features/add-post-card";
import Navbar from "@/components/features/navbar";
import { PostCard } from "@/components/features/post-card";
import { usePosts } from "@/hooks/use-posts";
import { useState, useEffect } from "react";
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from "@/contexts/auth-context";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function Home() {
  const { user } = useAuth();
  const { posts: fetchedPosts, loading, error } = usePosts();
  const [posts, setPosts] = useState<Post[]>([]);

  // Update local posts state when fetchedPosts changes
  useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts);
    }
  }, [fetchedPosts]);

  const handleAddPost = (title: string, content: string) => {
    const newPost = {
      id: Date.now(),
      title,
      body: content,
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
              />
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
