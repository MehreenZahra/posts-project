import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { it, expect, describe, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { LoginForm } from "@/components/features/login-form";
import { AuthProvider } from "@/contexts/auth-context";
import userEvent from "@testing-library/user-event";

// Mock the useRouter hook
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockLogin = vi
  .fn()
  .mockImplementation((email, password) =>
    Promise.resolve({ email, password })
  );
vi.mock("@/contexts/auth-context", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    login: mockLogin, // Mock the login function
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    cleanup(); // Clean up before each test
  });

  afterEach(() => {
    cleanup(); // Clean up after each test
    vi.clearAllMocks();
  });
  const renderLoginForm = () => {
    cleanup();
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    return {
      emailField: screen.getByRole("textbox", { name: /email/i }),
      passwordField: screen.getByLabelText("Password"),
      loginButton: screen.getByRole("button", { name: /log in/i }),
    };
  };

  it("renders the login form correctly", () => {
    const { emailField, passwordField, loginButton } = renderLoginForm();

    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
  it("should show the login button remain disabled initially", () => {
    const { loginButton } = renderLoginForm();
    expect(loginButton).toBeDisabled();
  });
  it("should enable the login button when the user enters valid email and password", async () => {
    const { emailField, passwordField, loginButton } = renderLoginForm();
    //fill in the form
    await userEvent.type(emailField, "test@gmail.com");
    await userEvent.type(passwordField, "test22");
    //check if the button is enabled
    expect(loginButton).not.toBeDisabled();
  });
  it("should call the login function when the user submits the form", async () => {
    const { emailField, passwordField, loginButton } = renderLoginForm();
    //initially the button should be disabled
    expect(loginButton).toBeDisabled();
    //fill in the form
    await userEvent.type(emailField, "test22@gmail.com");
    await userEvent.type(passwordField, "test22");

    // Button should be enabled after valid input
    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
    });

    //submit the form
    await userEvent.click(loginButton);
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith("test22@gmail.com", "test22");
    });
  });
});
