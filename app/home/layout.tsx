"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";
import { PostsProvider } from "@/contexts/posts-context";
import { CommentsProvider } from "@/contexts/comments-context";

import Navbar from "@/components/features/navbar";
import Loading from "./loading";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  return (
    <>
      <CommentsProvider>
        <PostsProvider>
          <Navbar user={user} />
          <Suspense fallback={<Loading />}>
            <main className="container mx-auto px-4 py-8">{children}</main>
          </Suspense>
        </PostsProvider>
      </CommentsProvider>
    </>
  );
}