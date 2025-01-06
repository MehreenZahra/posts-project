"use client";

import { usePosts } from "@/contexts/posts-context";

import { AddPostCard } from "@/components/features/add-post-card";
import { PostCard } from "@/components/features/post-card";

export default function Home() {
  const { posts } = usePosts();

  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <div className="space-y-6">
        <AddPostCard />
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.body}
            author={post.author}
            likes={post.likes}
            likedBy={post.likedBy}
          />
        ))}
      </div>
    </main>
  );
}
