'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Send } from 'lucide-react'

interface Comment {
  id: number
  postId: number
  email: string
  name: string
  body: string
}

interface CommentsProps {
  postId: number
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      )
      const data = await response.json()
      setComments(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching comments:', error)
      setLoading(false)
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    // Simulate adding a new comment
    const comment: Comment = {
      id: comments.length + 1,
      postId,
      email: 'current.user@example.com',
      name: 'Current User',
      body: newComment,
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddComment} className="flex gap-2">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[60px]"
        />
        <Button type="submit" size="icon" disabled={!newComment.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {comment.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {comment.email}
              </p>
              <p className="text-sm text-muted-foreground">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 