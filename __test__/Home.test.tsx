import Home from '@/app/page'
import { render, screen } from '@testing-library/react'
import { it, expect, describe } from 'vitest'

import '@testing-library/jest-dom/vitest'
describe('Home', () => {
     const testComponent = () => {
            render ( <Home />)
            return {
                signupButton: screen.getByRole('link', {name: 'Sign Up'}),
                loginButton: screen.getByRole('link', {name: 'Log In'})
            }
    }

    it('should render 2 buttons', () => {

       const { signupButton, loginButton } = testComponent()

        const buttons = screen.getAllByRole('link')
        expect(buttons).toHaveLength(2)

        expect(signupButton).toBeInTheDocument()
        expect(signupButton).toHaveAttribute('href', '/signup')
        
        expect(loginButton).toBeInTheDocument()
        expect(loginButton).toHaveAttribute('href', '/login')
    });
})