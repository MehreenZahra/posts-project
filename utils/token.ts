import { User } from '@/types/global';


export function generateToken(user: User, refresh: boolean): string {
  if (!user) throw new Error('User is required');
  
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    exp: `${refresh} ? 'Math.floor(Date.now() / 1000) + 300, // 5 minutes' : 'Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour'`,
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