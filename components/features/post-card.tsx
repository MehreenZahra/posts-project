'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Comments } from './comments'
import { MessageCircle, ThumbsUp, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
  id: number
  title: string
  content: string
}

export function PostCard({ id, title, content }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(false)

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{content}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t bg-muted/50 p-4">
        <div className="flex w-full justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLiked(!liked)}
            className={cn(liked && "text-blue-600")}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Like
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Comments
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        {showComments && (
          <div className="w-full">
            <Comments postId={id} />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

