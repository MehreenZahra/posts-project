import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
const Logout = () => {
 const router = useRouter();
  useEffect(() => {
   // Clear the token cookie
   document.cookie = 'accessToken=; Max-Age=0; path=/;';
   // Redirect to login page
   router.push('/login');
 }, [router]);
  return null; // No UI needed
};
export default Logout;