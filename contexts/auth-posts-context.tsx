'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/global';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { generateAccessToken, generateRefreshToken, parseToken } from '@/utils/token';

interface Post {
  id: number;
  title: string;
  body: string;
  author?: {
    email: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  posts: Post[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addPost: (title: string, content: string, author: { email: string; name: string }) => void;
  deletePost: (postId: number) => void;
  editPost: (postId: number, title: string, body: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    checkAuth();
    fetchInitialPosts();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: User) => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: users.length + 1,
        name,
        email,
        password,
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);

      if (user) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        setCookie('accessToken', accessToken, { maxAge: 300, secure: true,
          sameSite: 'strict' }); // 5 minutes
        setCookie('refreshToken', refreshToken, { maxAge: 24 * 60 * 60 , secure: true,
          sameSite: 'strict'}); // 1 day
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  const logout = () => {
    setUser(null);
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
  };


  const checkAuth = async () => {
    try {
      const accessToken = getCookie('accessToken');
      const refreshToken = getCookie('refreshToken');
      if (!accessToken && !refreshToken){
        logout()
        return;
      }

      if (!accessToken && refreshToken) {
        // Try to refresh the access token
        await refreshAccessToken();
      } else if (accessToken) {
        const userData = parseToken(accessToken as string);
        setUser(userData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) return false;

    try {
      const userData = parseToken(refreshToken as string);
      if (!userData) return false;
      
      const newAccessToken = generateAccessToken(userData);
      setCookie('accessToken', newAccessToken, { maxAge: 300, secure: true,
        sameSite: 'strict' }); // 5 minutes
      setUser(userData);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const fetchInitialPosts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      
      // Add dummy author to fetched posts
      const postsWithAuthor = data.map((post: Post) => ({
        ...post,
        author: {
          email: 'dummy@example.com',
          name: 'JSONPlaceholder User'
        }
      }));
      
      setPosts(postsWithAuthor);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const addPost = (title: string, content: string, author: { email: string; name: string }) => {
    const newPost = {
      id: Date.now(),
      title,
      body: content,
      author
    };
    setPosts(currentPosts => [newPost, ...currentPosts]);
  };

  const deletePost = (postId: number) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
  };

  const editPost = (postId: number, title: string, body: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, title, body }
          : post
      )
    );
  };

  

 

  
  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      posts,
      login,
      register,
      logout,
      addPost,
      deletePost,
      editPost,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useContextAPI() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useContextAPI must be used within an AuthProvider');
  }
  return context;
} 