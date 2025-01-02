'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import LoaderButton from '../ui/loader-button';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formHook = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleLogin(values: LoginFormSchemaType) {
    try {
      setLoading(true);
      const success = await login(values.email, values.password);
      
      if (!success) {
        toast({
          title: '❌ Invalid credentials',
          description: 'Please check your email and password.',
        });
        return;
      }

      toast({
        title: '✅ Success',
        description: 'Logged in successfully!',
      });
      router.push('/home');
      
    } catch (error: any) {
      toast({
        title: '❌ Login failed',
        description: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

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
                      <Input 
                        type="email"
                        placeholder="Enter email" 
                        {...field} 
                      />
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
                        type={showPassword ? 'text' : 'password'}
                        {...field}
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
  );
}