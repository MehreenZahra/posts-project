"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "../ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";
import LoaderButton from "../ui/loader-button";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormSchemaType = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const { register, login } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formHook = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleSignup(values: SignupFormSchemaType) {
    try {
      setLoading(true);

      const success = await register(
        values.name,
        values.email,
        values.password
      );
      if (!success) {
        toast({
          title: "❌ User already exists",
          description: "Please use a different email.",
        });
        return;
      }

      // Automatically log in after successful registration
      await login(values.email, values.password);

      toast({
        title: "✅ Success",
        description: "Account created successfully!",
      });
      router.push("/home");
    } catch (error: any) {
      toast({
        title: "❌ Signup failed",
        description: error.message || "An error occurred during signup.",
      });
    } finally {
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
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        {...field}
                      />
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
                        type={showPassword ? "text" : "password"}
                        {...field}
                        endIcon={showPassword ? Eye : EyeOff}
                        onEndIconClick={() => setShowPassword((prev) => !prev)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading || !formHook.formState.isValid}
              >
                {loading ? <LoaderButton /> : "Sign up"}
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
