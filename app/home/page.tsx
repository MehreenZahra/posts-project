'use client'

import { AddPostCard } from "@/components/features/add-post-card";
import Navbar from "@/components/features/navbar";
import { PostCard } from "@/components/features/post-card";
import { useState, useEffect } from "react";
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useContextAPI } from "@/contexts/auth-posts-context";


export default function Home() {
  const { user, posts: contextPosts } = useContextAPI();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false once we have posts
    if (contextPosts.length > 0) {
      setLoading(false);
    }
  }, [contextPosts]);

  if (loading && contextPosts.length === 0) {
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
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <main className="container mx-auto max-w-2xl px-4 py-6">
          <div className="space-y-6">
            <AddPostCard />
            {contextPosts.map((post) => (
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
