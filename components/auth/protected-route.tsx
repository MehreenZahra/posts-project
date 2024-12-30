'use client'

import { useContextAPI } from '@/contexts/auth-posts-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '../ui/loader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useContextAPI();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div><Loader/></div>; 
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 