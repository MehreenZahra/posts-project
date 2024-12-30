'use client'

import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
  author?: {
    email: string;
    name: string;
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        
        // Add dummy author to each post
        const postsWithAuthor = data.map((post: Post) => ({
          ...post,
          author: {
            email: 'dummy@example.com',
            name: 'JSONPlaceholder User'
          }
        }));
        
        setPosts(postsWithAuthor);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}

