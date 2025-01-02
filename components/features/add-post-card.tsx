"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/contexts/auth-context";
import { usePosts } from "@/contexts/posts-context";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import LoaderButton from "../ui/loader-button";

const AddPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(1, "Content must be at least 10 characters")
    .max(500, "Content must be less than 500 characters"),
});

type AddPostSchemaType = z.infer<typeof AddPostSchema>;

export function AddPostCard() {
  const { user } = useAuth();
  const { addPost } = usePosts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddPostSchemaType>({
    resolver: zodResolver(AddPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (values: AddPostSchemaType) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      addPost(values.title, values.content, {
        email: user.email,
        name: user.name,
      });
      form.reset();
      toast({
        title: "✅ Success",
        description: "Post created successfully!",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Post</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Post content"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? <LoaderButton /> : "Add Post"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
