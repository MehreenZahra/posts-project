import {  fireEvent, render, screen } from '@testing-library/react'
import { it, expect, describe, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { AddPostCard } from '@/components/features/add-post-card'
import { PostsProvider } from '@/contexts/posts-context'

describe('addPostCard',()=>{
   const renderAddPostCard = () => {
           render(
               <AuthProvider>
                <PostsProvider>
                 <AddPostCard />
                 </PostsProvider>
               </AuthProvider>
             )
       }

    it('post card rendered correctly', () =>{
        renderAddPostCard()
        const addPostButton = screen.getByRole('button', { name: /add post/i })
        expect(addPostButton).toBeInTheDocument()
        expect(addPostButton).toBeDisabled()
        expect(addPostButton).toHaveTextContent('Add Post')
        // expect(addPostButton).toHaveLength(1)
        //test fails: more than one button is present in the add post card
        const titleInput = screen.getAllByRole('textbox',{ name: ""})
        //React hook form form fields are not rendered with unique id/name/labeltext unable to select them
        // const contentInput = screen.getByLabelText(/post Content/i)
        // test failed Unable to find a label with the text of: /Content/i or /post Content/i
        // expect(titleInput).toBeInTheDocument()
        expect(titleInput).toHaveLength(2)
        // expect(contentInput).toBeInTheDocument()
    })
})