'use client'
import { useRouter } from 'next/navigation';
import { ModeToggle } from '../ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from '@/types/global';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User as UserIcon, Home } from 'lucide-react';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const userName = user ? user.name : null;
  const userAvatar = user ? user.avatar : null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span className="text-lg font-semibold">Social Feed</span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full border border-border bg-background px-2 py-1 hover:bg-accent">
                <span className="hidden text-sm font-medium md:inline-block">
                  {userName || 'Guest'}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar || '/default-avatar.png'} alt={userName || 'User Avatar'} />
                  <AvatarFallback>{userName ? userName[0].toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
