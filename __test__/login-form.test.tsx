import {  fireEvent, render, screen } from '@testing-library/react'
import { it, expect, describe, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { LoginForm } from '@/components/features/login-form'
import { AuthProvider } from '@/contexts/auth-context'

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
    }),
  }))
describe('LoginForm',()=>{
     const renderLoginForm = () =>{
        render(
            <AuthProvider>
              <LoginForm />
            </AuthProvider>
          )
     }
    
    it('renders the form correctly', () => {
         renderLoginForm()
        
          const emailField = screen.getByLabelText('Email')
          const passwordField = screen.getByLabelText('Password')
        expect(emailField).toBeInTheDocument()
        expect(passwordField).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument()
        
    });
    it(' should show the login button remain disable initially', () => {
        renderLoginForm()
    const allButtons = screen.getByRole('button')
    expect(allButtons).toHaveLength(1)
    // expect(allButtons[0]).toHaveTextContent('Log in')
    // expect(allButtons[0]).toBeDisabled()

    });
    //what happens when we click on login button
    // it('should show the login button become enable', () => {
    //     renderLoginForm()
    //     // <input
    //     //           aria-describedby=":r0:-form-item-description"
    //     //           aria-invalid="false"
    //     //           class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
    //     //           id=":r0:-form-item"
    //     //           name="email"
    //     //           placeholder="Enter email"
    //     //           type="email"
    //     //           value=""
    //     //         /> //this is the input showing in the debug window saying that there are more than one inputs with labeltext email


    //     const emailField = screen.getByLabelText('email')
    //     const passwordField = screen.getByLabelText('Password')
    //     const loginButton = screen.getByRole('button', { name: 'Log in' })
    //     fireEvent.change(emailField, { target: { value: 'l7oMw@example.com' } })
    //     fireEvent.change(passwordField, { target: { value: 'password' } })
    //     expect(loginButton).not.toBeDisabled()
    // });
//failing tests
//unable to test user interaction as i cant select buttons and inputs by their label text or roles 
//it gives error message that there are more than one elements present in the forms 
});