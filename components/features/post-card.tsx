'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Comments } from './comments'
import { MessageCircle, ThumbsUp, Share2, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useContextAPI } from '@/contexts/auth-posts-context'
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
import { useToast } from '@/hooks/use-toast'

interface PostCardProps {
  id: number
  title: string
  content: string
  author?: {
    email: string
    name: string
  }
}


export function PostCard({ id, title, content, author }: PostCardProps) {
  const { user, deletePost, editPost } = useContextAPI()
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editContent, setEditContent] = useState(content)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const { toast } = useToast()

  const handleEdit = () => {
    editPost(id, editTitle, editContent)
    setIsEditing(false)
  }

  const handleDelete = () => {
    deletePost(id)
    setShowDeleteAlert(false)
    toast({
      title: "✅ Post deleted",
      description: "Your post has been deleted successfully.",
    })
  }

  const isAuthor = author?.email === user?.email

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="line-clamp-2">{title}</CardTitle>
            {author && (
              <p className="text-sm text-muted-foreground">
                Posted by {author.name} • ({author.email})
              </p>
            )}
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteAlert(true)}
                  className="cursor-pointer font-semibold text-destructive hover:text-destructive-foreground dark:hover:text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
              className={cn(
                "transition-all duration-200 hover:scale-105 active:scale-95",
                liked 
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <ThumbsUp className={cn(
                "mr-2 h-4 w-4 transition-transform duration-200",
                liked && "scale-110"
              )} />
              <span className={cn(
                "font-medium",
                liked && "font-semibold"
              )}>
                Like
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className={cn(
                "transition-colors duration-200 hover:scale-105 active:scale-95",
                showComments 
                  ? "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <MessageCircle className={cn(
                "mr-2 h-4 w-4 transition-transform duration-200",
                showComments && "scale-110"
              )} />
              <span className={cn(
                "font-medium",
                showComments && "font-semibold"
              )}>
                Comments
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Share2 className="mr-2 h-4 w-4 transition-transform hover:scale-110" />
              <span className="font-medium">Share</span>
            </Button>
          </div>
          {showComments && (
            <div className="w-full">
              <Comments postId={id} />
            </div>
          )}
        </CardFooter>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Post title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Post content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

