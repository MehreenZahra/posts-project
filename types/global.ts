export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional since we don't always want to include it
  avatar?: string; // Optional profile picture
} 