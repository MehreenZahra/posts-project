import {  cleanup,render, screen, waitFor } from '@testing-library/react'
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SignupForm from '@/components/features/signup-form'
import { AuthProvider } from '@/contexts/auth-context'
import userEvent from '@testing-library/user-event'

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
    }),
  }));
  const mockSignup = vi
  .fn()
  .mockImplementation((name,email, password) =>
    Promise.resolve({name, email, password })
  );
  vi.mock("@/contexts/auth-context", () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    useAuth: () => ({
      register: mockSignup,
    }),
  }));

  describe('SignupForm', () => {
    beforeEach(() => {
      cleanup(); // Clean up before each test
    });
  
    afterEach(() => {
      cleanup(); // Clean up after each test
      vi.clearAllMocks();
    });
    const renderSignupForm = () => {
        render(
            <AuthProvider>
              <SignupForm />
            </AuthProvider>
          )
          return {
            nameField: screen.getByRole("textbox", { name: /name/i }),
            emailField: screen.getByRole("textbox", { name: /email/i }),
            passwordField: screen.getByLabelText('Password'),
            signupButton: screen.getByRole('button', { name: 'Sign up' }),
          }
    }
    it('should render the form correctly', () => {
        const { nameField,emailField,passwordField,signupButton} = renderSignupForm()
       
        expect(nameField).toBeInTheDocument()
        expect(emailField).toBeInTheDocument()
        expect(passwordField).toBeInTheDocument()
        expect(signupButton).toBeInTheDocument()
    });
    it('should show the signup button remain disabled initially', () => {
      const {signupButton} = renderSignupForm()
      expect(signupButton).toBeDisabled()
    });
    it('should enable the signup button when all fields are filled with valid inputs', async () => {
      const {nameField,emailField,passwordField,signupButton} = renderSignupForm()
       //initially the button should be disabled
       expect(signupButton).toBeDisabled();
       //fill in the form
      await userEvent.type(nameField,'test user');
      await userEvent.type(emailField, 'test@gmail.com');
      await userEvent.type(passwordField, 'password');
      expect(signupButton).toBeEnabled();
       //fill in invalid email
      await userEvent.clear(emailField);
      await userEvent.type(emailField, 'test');
      expect(signupButton).toBeDisabled();
        //fill in invalid password
      await userEvent.clear(passwordField);
      await userEvent.type(passwordField, 'pass');
      expect(signupButton).toBeDisabled();
      //fill in valid email and password
      await userEvent.clear(emailField);
      await userEvent.type(emailField, 'test@gmail.com');
      await userEvent.clear(passwordField);
      await userEvent.type(passwordField, 'password');
      expect(signupButton).toBeEnabled();
       //fill in valid name and email and password
      await userEvent.clear(nameField);
      await userEvent.type(nameField, 'test user');
      await userEvent.clear(emailField);
      await userEvent.type(emailField, 'test@gmail.com');
      await userEvent.clear(passwordField);
      await userEvent.type(passwordField, 'password');
      expect(signupButton).toBeEnabled();
    });
    it('should call the signup function when the user submits the form', async () => {
        const {nameField,emailField,passwordField,signupButton} = renderSignupForm()
        //initially the button should be disabled
        expect(signupButton).toBeDisabled();
        //fill in the form
        await userEvent.type(nameField, 'test user');
        await userEvent.type(emailField, 'test@gmail.com');
        await userEvent.type(passwordField, 'password');
        expect(signupButton).toBeEnabled();
        //submit the form
        await userEvent.click(signupButton);
         await waitFor(() => {
              expect(mockSignup).toHaveBeenCalledTimes(1);
              expect(mockSignup).toHaveBeenCalledWith("test user","test@gmail.com", "password");
            });

    })
  })