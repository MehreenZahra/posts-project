'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { setCookie } from 'cookies-next';
// import { COOKIES_KEYS } from '@/constants/cookies';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import  LoaderButton from '../ui/loader-button';
import { Eye, EyeOff } from 'lucide-react'; // Ensure you have these icons available
import { useToast } from '@/hooks/use-toast'; // Assuming you have a toast component
import { login } from '@/utils/authentication'; // Import your login function
import Link from 'next/link';
import { COOKIES_KEYS } from '@/utils/constants';
// Define the Zod schema for validation
const LoginFormSchema = z.object({
 email: z.string().email('Invalid email address'),
 password: z.string().min(1, 'Password is required'),
});
type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

// const loginSchema = z.object({
//   email: z.string()., Linkemail('Invalid email address'),
//   password: z.string().min(1, 'Password is required'),
// })


export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formHook = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onChange',
  });

  async function handleLogin(values: LoginFormSchemaType) {
    try {
      setLoading(true);
      const token = login(values.email, values.password); // Call your login function
       if (!token) {
        toast({
          title: '❌ Invalid credentials',
          description: 'Please check your email and password.',
        });
        setLoading(false);
        return;
      } else 
       // Set cookies for tokens
      //  document.cookie = `${COOKIES_KEYS.accessToken}=; Max-Age=0; path=/;`;
       // Set the new accessToken
      document.cookie = `token=${token}; path=/`;
      //  sameSite=strict; secure=true`;
      // setCookie(COOKIES_KEYS.accessToken, token, {
      //   sameSite: 'strict',
      //   secure: true,
      // });
       router.push('/home'); // Redirect to home after successful login
    } catch (error: any) {
      toast({
        title: '❌ Login failed',
        description: error.message || 'An error occurred. Please try again.',
      });
      setLoading(false);
    }
  }

  // async function loginAction(prevState: any, formData: FormData) {
  //   // 'use server'
  //    const validatedFields = loginSchema.safeParse({
  //     email: formData.get('email'),
  //     password: formData.get('password'),
  //   });
  //    if (!validatedFields.success) {
  //     return { errors: validatedFields.error.flatten().fieldErrors };
  //   }
  //   const token = login(validatedFields.data.email, validatedFields.data.password); // Get token
  //   console.log('Login attempt:', validatedFields.data.email, validatedFields.data.password); // Debugging log
  //   console.log('Token:', token);
  //   if (token) {
  //     document.cookie = `token=${token}; path=/;`; // Store token in cookies
  //     router.push('/home')
  //     return { success: true };
  //   }
  //   return { errors: { email: ['Invalid credentials'] } };};
   

  return (
    <div className="flex h-screen flex-col items-center justify-center">
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...formHook}>
          <form
            onSubmit={formHook.handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={formHook.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
               control={formHook.control}
               name="password"
               render={({ field }) => (
                 <FormItem className="flex-grow">
                   <FormLabel>Password</FormLabel>
                   <FormControl>
                     <Input
                       placeholder="Enter password"
                       {...field}
                       type={showPassword ? 'text' : 'password'}
                       endIcon={showPassword ? Eye : EyeOff}
                       onEndIconClick={() => setShowPassword((prev) => !prev)}
                     />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <Button type="submit" disabled={loading || !formHook.formState.isValid}>
               {loading ? <LoaderButton /> : 'Log in'}
             </Button>
           </form>
         </Form>
       </CardContent>
       <CardFooter className="flex gap-1">
         <p className="text-sm text-muted-foreground">
           Don&apos;t have an account?
         </p>
         <Link
           href="/signup"
           className="text-sm text-muted-foreground hover:underline"
         >
           Sign up
         </Link>    
       </CardFooter>
     </Card>
   </div>
  )
}