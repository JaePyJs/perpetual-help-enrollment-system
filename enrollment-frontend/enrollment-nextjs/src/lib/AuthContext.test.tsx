import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseClient';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock supabaseClient
jest.mock('./supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

// Test component that uses the auth context
function TestComponent() {
  const { user, isLoading, signIn, signOut, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user-state">{user ? user.email : 'No User'}</div>
      <div data-testid="auth-state">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}

describe('AuthContext', () => {
  const mockPush = jest.fn();
  const mockUser = { id: '123', email: 'test@example.com' };
  const mockSession = { user: mockUser };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    // Setup supabase auth mocks
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
  });
  
  it('should initialize with loading state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading');
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    });
  });
  
  it('should set user when session exists', async () => {
    // Mock session exists
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated');
    });
  });
  
  it('should handle sign in successfully', async () => {
    // Mock successful sign in
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    });
    
    // Click sign in button
    const user = userEvent.setup();
    await user.click(screen.getByText('Sign In'));
    
    // Verify sign in was called with correct params
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });
  
  it('should handle sign in error', async () => {
    // Mock sign in error
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    });
    
    // Click sign in button
    const user = userEvent.setup();
    const result = await user.click(screen.getByText('Sign In'));
    
    // Verify error is returned
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
    });
  });
  
  it('should handle sign out', async () => {
    // Mock successful sign out
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: null,
    });
    
    // Mock user is signed in
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to complete and user to be set
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('test@example.com');
    });
    
    // Click sign out button
    const user = userEvent.setup();
    await user.click(screen.getByText('Sign Out'));
    
    // Verify sign out was called
    expect(supabase.auth.signOut).toHaveBeenCalled();
    
    // Verify router.push was called to redirect to home
    expect(mockPush).toHaveBeenCalledWith('/');
  });
  
  it('should update user when auth state changes', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    });
    
    // Simulate auth state change
    const authStateChangeHandler = (supabase.auth.onAuthStateChange as jest.Mock).mock.calls[0][0];
    
    act(() => {
      authStateChangeHandler('SIGNED_IN', mockSession);
    });
    
    // Verify user state is updated
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated');
    });
  });
});
