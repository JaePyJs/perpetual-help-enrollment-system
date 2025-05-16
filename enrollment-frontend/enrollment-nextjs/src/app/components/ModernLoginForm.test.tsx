import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModernLoginForm from './ModernLoginForm';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

// Mock the supabaseClient
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ModernLoginForm Integration Test', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    // Setup supabase auth mock
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'student@example.com',
          user_metadata: { role: 'student' },
        },
        session: { access_token: 'mock-token' },
      },
      error: null,
    });
  });
  
  it('renders all role tabs', () => {
    render(<ModernLoginForm />);
    
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
  
  it('switches between tabs when clicked', async () => {
    render(<ModernLoginForm />);
    
    // Default tab should be Student
    expect(screen.getByLabelText(/student id or email/i)).toBeInTheDocument();
    
    // Click on Teacher tab
    await userEvent.click(screen.getByText('Teacher'));
    expect(screen.getByLabelText(/teacher id or email/i)).toBeInTheDocument();
    
    // Click on Admin tab
    await userEvent.click(screen.getByText('Admin'));
    expect(screen.getByLabelText(/admin id or email/i)).toBeInTheDocument();
  });
  
  it('handles input changes', async () => {
    render(<ModernLoginForm />);
    
    const emailInput = screen.getByLabelText(/student id or email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await userEvent.type(emailInput, 'student@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('student@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
  
  it('toggles password visibility', async () => {
    render(<ModernLoginForm />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click the visibility toggle button
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    await userEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
  
  it('shows validation error when fields are empty', async () => {
    render(<ModernLoginForm />);
    
    // Submit the form without filling fields
    const loginButton = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(loginButton);
    
    // Should show validation error
    expect(screen.getByText(/please enter both username and password/i)).toBeInTheDocument();
  });
  
  it('handles successful login for student', async () => {
    render(<ModernLoginForm />);
    
    // Fill in the form
    await userEvent.type(screen.getByLabelText(/student id or email/i), 'student@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit the form
    const loginButton = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(loginButton);
    
    // Check if Supabase auth was called with correct params
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'student@example.com',
      password: 'password123',
    });
    
    // Should redirect to student dashboard
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/student-dashboard');
    });
  });
  
  it('handles login with student ID', async () => {
    // Mock the Supabase query for student ID lookup
    (supabase.single as jest.Mock).mockResolvedValue({
      data: { email: 'student@example.com' },
      error: null,
    });
    
    render(<ModernLoginForm />);
    
    // Fill in the form with student ID
    await userEvent.type(screen.getByLabelText(/student id or email/i), 's23-1234-567');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit the form
    const loginButton = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(loginButton);
    
    // Should look up the email from the ID
    expect(supabase.from).toHaveBeenCalledWith('students');
    expect(supabase.eq).toHaveBeenCalledWith('studentId', 's23-1234-567');
    
    // Should sign in with the resolved email
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'student@example.com',
        password: 'password123',
      });
    });
  });
  
  it('handles login error', async () => {
    // Mock auth error
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' },
    });
    
    render(<ModernLoginForm />);
    
    // Fill in the form
    await userEvent.type(screen.getByLabelText(/student id or email/i), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    
    // Submit the form
    const loginButton = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(loginButton);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
    });
    
    // Should not redirect
    expect(mockPush).not.toHaveBeenCalled();
  });
  
  it('handles role mismatch error', async () => {
    // Mock user with wrong role
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'teacher@example.com',
          user_metadata: { role: 'teacher' },
        },
        session: { access_token: 'mock-token' },
      },
      error: null,
    });
    
    render(<ModernLoginForm />);
    
    // Fill in the student form with teacher credentials
    await userEvent.type(screen.getByLabelText(/student id or email/i), 'teacher@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit the form
    const loginButton = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(loginButton);
    
    // Should show role mismatch error
    await waitFor(() => {
      expect(screen.getByText(/this account doesn't have student privileges/i)).toBeInTheDocument();
    });
    
    // Should sign out
    expect(supabase.auth.signOut).toHaveBeenCalled();
    
    // Should not redirect
    expect(mockPush).not.toHaveBeenCalled();
  });
});
