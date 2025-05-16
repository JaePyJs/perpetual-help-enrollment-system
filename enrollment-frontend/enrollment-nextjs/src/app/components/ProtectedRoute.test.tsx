import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the AuthContext
jest.mock('@/lib/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });
  
  it('should show loading state when authentication is being checked', () => {
    // Mock authentication loading
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null,
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
  
  it('should redirect to login when user is not authenticated', async () => {
    // Mock user not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Should not render content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    
    // Should redirect to login
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
  
  it('should render children when user is authenticated', () => {
    // Mock user authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '123', email: 'test@example.com', user_metadata: { role: 'student' } },
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
  
  it('should render children when user has allowed role', () => {
    // Mock user authenticated with student role
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '123', email: 'test@example.com', user_metadata: { role: 'student' } },
    });
    
    render(
      <ProtectedRoute allowedRoles={['student', 'admin']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
  
  it('should show access denied when user does not have allowed role', () => {
    // Mock user authenticated with teacher role
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '123', email: 'test@example.com', user_metadata: { role: 'teacher' } },
    });
    
    render(
      <ProtectedRoute allowedRoles={['student', 'admin']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
  
  it('should show access denied when user has no role', () => {
    // Mock user authenticated with no role
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '123', email: 'test@example.com', user_metadata: {} },
    });
    
    render(
      <ProtectedRoute allowedRoles={['student', 'admin']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
