import { User } from '@/types/global';

export function generateAccessToken(user: User): string {
  if (!user) throw new Error('User is required');
  
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
  };
  return btoa(JSON.stringify(payload));
}

export function generateRefreshToken(user: User): string {
  if (!user) throw new Error('User is required');
  
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) +  24 * 60 * 60, // 1 day
  };
  return btoa(JSON.stringify(payload));
}

export function parseToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
} 