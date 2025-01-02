const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const api = {
  // Posts
  fetchPosts: async () => {
    const response = await fetch(`${BASE_URL}/posts`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  },

  getPost: async (id: number) => {
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    if (!response.ok) throw new Error("Failed to fetch post");
    return response.json();
  },

  createPost: async (data: { title: string; body: string; userId: number }) => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
  },

  updatePost: async (
    id: number,
    data: { title: string; body: string; userId: number }
  ) => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) throw new Error("Failed to update post");
    return response.json();
  },

  deletePost: async (id: number) => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete post");
    return true;
  },

  // Comments
  getPostComments: async (postId: number) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    return response.json();
  },

  createComment: async (
    postId: number,
    data: { name: string; email: string; body: string }
  ) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ ...data, postId }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) throw new Error("Failed to create comment");
    return response.json();
  },

  updateComment: async (id: number, data: { body: string }) => {
    const response = await fetch(`${BASE_URL}/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) throw new Error("Failed to update comment");
    return response.json();
  },

  deleteComment: async (id: number) => {
    const response = await fetch(`${BASE_URL}/comments/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete comment");
    return true;
  },
};
