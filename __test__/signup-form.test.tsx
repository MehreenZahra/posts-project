import {  fireEvent, render, screen } from '@testing-library/react'
import { it, expect, describe, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SignupForm from '@/components/features/signup-form'
import { AuthProvider } from '@/contexts/auth-context'

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
    }),
  }))

  describe('SignupForm', () => {
    const renderSignupForm = () => {
        render(
            <AuthProvider>
              <SignupForm />
            </AuthProvider>
          )
    }
    it('should render the form correctly', () => {
        renderSignupForm()
       
        expect(screen.getByLabelText('Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Email')).toBeInTheDocument()
        expect(screen.getByLabelText('Password')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
    });
    it(' should show the login button remain disable initially', () => {
        renderSignupForm()
    const allButtons = screen.getAllByRole('button')
    expect(allButtons).toHaveLength(2)
    expect(allButtons[0]).toHaveTextContent(/sign up/i)
    expect(allButtons[0]).toBeDisabled()

    });
  })