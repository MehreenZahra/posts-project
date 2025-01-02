export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; 
  avatar?: string; 
} 
export interface Post {
  id: number;
  title: string;
  body: string;
  author?: Author;
  likes: number;
  comments?: Comment[];
  likedBy?: number[];
}
export interface Comment {
  id: number;
  postId: number;
  body: string;
  author: Author;
} 
export interface Author {
  email: string;
  name: string;
}

export interface PostCardProps {
  id: number;
  title: string;
  content: string;
  author?: {
    email: string;
    name: string;
  };
  likes: number;
  likedBy?: number[];
  showComments?: boolean;
  isDetailView?: boolean;
}
export interface NavbarProps {
  user: User | null;
}


//Context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
export interface PostsContextType {
  posts: Post[];
  addPost: (title: string, content: string, author: Author) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
  editPost: (postId: number, title: string, body: string) => Promise<void>;
  likePost: (postId: number) => void;
  toggleLikePost: (postId: number, userId: number) => void;
}
 export interface CommentsContextType {
  comments: { [postId: number]: Comment[] };
  addComment: (postId: number, body: string, author: Author) => Promise<void>;
  editComment: (postId: number, commentId: number, body: string) => void;
  deleteComment: (postId: number, commentId: number) => void;
  fetchComments: (postId: number) => Promise<void>;
}



