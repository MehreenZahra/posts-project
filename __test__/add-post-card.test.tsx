import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { AddPostCard } from '@/components/features/add-post-card'
import { PostsProvider } from '@/contexts/posts-context'

// Mock the auth context
vi.mock('@/contexts/auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    }
  })
}))

// Mock the posts context
vi.mock('@/contexts/posts-context', () => ({
  PostsProvider: ({ children }: { children: React.ReactNode }) => children,
  usePosts: () => ({
    addPost: vi.fn().mockImplementation(() => Promise.resolve())
  })
}))

describe('AddPostCard', () => {
  beforeEach(() => {
    cleanup(); // Clean up before each test
  })

  afterEach(() => {
    cleanup(); // Clean up after each test
    vi.clearAllMocks();
  })

  const renderAddPostCard = () => {
    cleanup(); // Ensure clean state before rendering
     render(
      <AuthProvider>
        <PostsProvider>
          <AddPostCard />
        </PostsProvider>
      </AuthProvider>
    )
    return { 
      titleInput : screen.getByRole('textbox', { name: /title/i }),
      contentInput: screen.getByRole('textbox', { name: /content/i }),
      addPostButton: screen.getByRole('button', { name: /add post/i })
    }
  }

  it('renders the add post form correctly', () => {
     const { titleInput,contentInput, addPostButton } = renderAddPostCard()

    expect(titleInput).toBeInTheDocument();
    expect(contentInput).toBeInTheDocument();
    expect(addPostButton).toBeInTheDocument();
    expect(addPostButton).toBeDisabled();
  })

  it('enables add Post button when form is filled', async () => {
     const { titleInput,contentInput, addPostButton } = renderAddPostCard()

    // Fill in the form
    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(contentInput, 'Test Content');

    // Button should be enabled
    expect(addPostButton).not.toBeDisabled();
  })

  it('handles form submission correctly', async () => {
    const { titleInput,contentInput, addPostButton } = renderAddPostCard()

    // Initially button should be disabled
    expect(addPostButton).toBeDisabled();

    // Fill in the form
    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(contentInput, 'Test Content');

    // Button should be enabled after valid input
    await waitFor(() => {
      expect(addPostButton).not.toBeDisabled();
    });

    // Submit the form
    await userEvent.click(addPostButton);

    // Wait for form to be cleared and button to be disabled
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(contentInput).toHaveValue('');
      expect(addPostButton).toBeDisabled();
    });
  })
})