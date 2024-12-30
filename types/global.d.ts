export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; 
  avatar?: string; 
} 
export interface NavbarProps {
  user: User | null;
}