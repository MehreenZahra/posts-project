import { User } from '../types/global';

const USERS_KEY = 'users'; // Key for local storage

// Load users from local storage
function loadUsers(): User[] {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// Save users to local storage
function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Initialize users array
let users: User[] = loadUsers();

// Function to generate a simple JWT token (not secure, just for simulation)
export function generateToken(user: User): string {
  return btoa(JSON.stringify({ id: user.id, email: user.email }));
}

// Function to verify a token
export function verifyToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token));
    const user = users.find(u => u.id === payload.id && u.email === payload.email);
    return user || null;
  } catch {
    return null;
  }
}

// Function to register a new user
export function register(name: string, email: string, password: string): User | null {
  if (users.some(u => u.email === email)) {
    return null; // User already exists
  }
  const newUser: User = { id: users.length + 1, name, email, password };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Function to login a user
export function login(email: string, password: string): string | null {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return generateToken(user);
  }
  return null;
}

// Function to get the current user from the token
export function getCurrentUser(): User | null {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='));
  if (token) {
    const tokenValue = token.split('=')[1];
    const user = verifyToken(tokenValue); 
    return user; 
  }
  return null; // Return null if no token is found
}