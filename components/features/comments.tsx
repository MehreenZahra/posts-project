'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Send, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useContextAPI } from '@/contexts/auth-posts-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const { user, deleteComment, editComment } = useContextAPI()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchComments()
  }, [postId])

  useEffect(() => {
    const handleDeleteComment = (e: CustomEvent<{ postId: number; commentId: number }>) => {
      if (e.detail.postId === postId) {
        setComments(comments.filter(comment => comment.id !== e.detail.commentId))
      }
    }

    const handleEditComment = (e: CustomEvent<{ postId: number; commentId: number; body: string }>) => {
      if (e.detail.postId === postId) {
        setComments(comments.map(comment => 
          comment.id === e.detail.commentId 
            ? { ...comment, body: e.detail.body }
            : comment
        ))
      }
    }

    window.addEventListener('deleteComment', handleDeleteComment as EventListener)
    window.addEventListener('editComment', handleEditComment as EventListener)

    return () => {
      window.removeEventListener('deleteComment', handleDeleteComment as EventListener)
      window.removeEventListener('editComment', handleEditComment as EventListener)
    }
  }, [postId, comments])

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
    if (!newComment.trim() || !user) return

    const comment: Comment = {
      id: Date.now(),
      postId,
      email: user.email,
      name: user.name,
      body: newComment,
    }

    setComments([comment, ...comments])
    setNewComment('')
    toast({
      title: "✅ Comment added",
      description: "Your comment has been added successfully.",
    })
  }

  const handleStartEdit = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditText(comment.body)
  }

  const handleSaveEdit = (commentId: number) => {
    if (!editText.trim()) return
    editComment(postId, commentId, editText)
    setEditingComment(null)
  }

  const handleDelete = (commentId: number) => {
    deleteComment(postId, commentId)
    setDeleteCommentId(null)
    toast({
      title: "✅ Comment deleted",
      description: "Your comment has been deleted successfully.",
    })
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
    <>
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
                  {comment.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {comment.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {comment.email}
                    </p>
                  </div>
                  {user?.email === comment.email && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStartEdit(comment)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteCommentId(comment.id)}
                          className="cursor-pointer font-semibold text-destructive hover:text-destructive-foreground dark:hover:text-white"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {editingComment === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingComment(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(comment.id)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{comment.body}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={deleteCommentId !== null} onOpenChange={() => setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCommentId && handleDelete(deleteCommentId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 