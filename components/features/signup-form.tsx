'use client'

// import { useActionState } from 'react-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'; // Ensure you have this package installed // Adjust the import based on your project structure
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '../ui/form';
import { Eye, EyeOff } from 'lucide-react'; // Ensure you have these icons available
import { useToast } from '@/hooks/use-toast'; // Adjust the import based on your project structure
import { generateToken, register } from '@/utils/authentication'; // Adjust the import based on your project structure
import { useState } from 'react';
import LoaderButton from '../ui/loader-button';
import Link from 'next/link';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(20, 'Name must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormSchemaType = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formHook = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  async function handleSignup(values: SignupFormSchemaType) {
    try {
      setLoading(true);

      const newUser = register(values.name, values.email, values.password);
      if (!newUser) {
        toast({
          title: '❌ User already exists',
          description: 'Please use a different email.',
        });
        setLoading(false);
        return;
      }

      const token = generateToken(newUser);
      document.cookie = `token=${token}; path=/;`; // Store token in cookies
      router.push('/login'); // Redirect to login or dashboard after signup
    } catch (error: any) {
      toast({
        title: '❌ Signup failed',
        description: error.message || 'An error occurred during signup.',
      });
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Create an account to access the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formHook}>
            <form
              onSubmit={formHook.handleSubmit(handleSignup)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={formHook.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {loading ? <LoaderButton /> : 'Sign up'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex gap-1">
          <p className="text-sm text-muted-foreground">
            Already have an account?
          </p>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:underline"
          >
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
