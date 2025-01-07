"use client";

import { useParams } from "next/navigation";

import { usePosts } from "@/contexts/posts-context";
import { PostCard } from "@/components/features/post-card";
export default function PostPage() {
  const params = useParams();
  const { posts } = usePosts();

  const postId = Array.isArray(params.id)
    ? parseInt(params.id[0])
    : parseInt(params.id || "0");
  const post = posts.find((p) => p.id === postId);
  
  if (!post) {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-center">
          Post not found
        </h1>
      </main>
    );
  };
  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <div className="space-y-6">
        <PostCard
          id={post.id}
          title={post.title}
          content={post.body}
          author={post.author}
          showComments={true}
          isDetailView={true}
          likes={post.likes}
          likedBy={post.likedBy}
        />
      </div>
    </main>
  );
}
