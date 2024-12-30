'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AddPostCardProps {
  onAddPost: (title: string, content: string) => void;
}

export function AddPostCard({ onAddPost }: AddPostCardProps) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddPost(title, content);
      setTitle('');
      setContent('');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={!title.trim() || !content.trim()}
          >
            Add Post
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

