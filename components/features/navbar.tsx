'use client'
import { useRouter } from 'next/navigation';
import { ModeToggle } from '../ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavbarProps } from '@/types/global';
import {  useContextAPI } from '@/contexts/auth-posts-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User as UserIcon, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"



export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const { logout } = useContextAPI();
  const userName = user ? user.name : null;
  const userAvatar = user ? user.avatar : null;
  const [showLogoutAlert, setShowLogoutAlert] = useState(false)
  const { toast } = useToast()

  const handleLogout = () => {
    logout();
    router.push('/login');
    setShowLogoutAlert(false)
    toast({
      title: "👋 Goodbye!",
      description: "You have been logged out successfully.",
    })
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex ml-16 items-center gap-2 transition-transform duration-200 hover:scale-105">
            <Home className="h-5 w-5" />
            <span className="text-lg font-semibold">Social Feed</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full border border-border bg-background px-2 py-1 transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95">
                  <span className="hidden text-sm font-medium md:inline-block">
                    {userName || 'Guest'}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar || ''} alt={userName || 'User Avatar'} />
                    <AvatarFallback>{userName ? userName[0].toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-accent">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowLogoutAlert(true)}
                  className="cursor-pointer font-semibold text-destructive hover:text-destructive-foreground dark:hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
