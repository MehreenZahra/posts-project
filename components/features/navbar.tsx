'use client'

import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/utils/authentication'; 
import { ModeToggle } from '../ui/theme-toggle';
const Navbar = () => {
 const router = useRouter();
 const user = getCurrentUser(); // Get the current user
  const handleLogout = () => {
   // Clear the token cookie
   document.cookie = 'token=; Max-Age=0; path=/;';
   // Redirect to login page
   router.push('/login');
 };
  const getInitials = (name: string) => {
   const names = name.split(' ');
   return names.map(n => n.charAt(0).toUpperCase()).join('');
 };
  return (
   <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800">
     <div className="flex items-center">
       <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-white">
        
         {user ? getInitials(user.name) : 'U'}
        
       </div>
       <span className="ml-2 text-lg font-semibold">{user ? user.name : 'Guest'}</span>
     </div>
     <div className="flex items-center space-x-4">
      <ModeToggle/>
       <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
         Logout
       </button>
     </div>
   </nav>
 );
};
export default Navbar;