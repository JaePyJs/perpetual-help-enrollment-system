import tokenService, { JwtPayload } from '@/services/token-service';
import { jwtDecode } from 'jwt-decode';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

describe('Token Service', () => {
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    // Clear localStorage before each test
    localStorageMock.clear();
    
    // Clear mocks
    jest.clearAllMocks();
  });

  test('should store and retrieve access token', () => {
    tokenService.setAccessToken('test-access-token');
    expect(localStorageMock.getItem('accessToken')).toBe('test-access-token');
    expect(tokenService.getAccessToken()).toBe('test-access-token');
  });

  test('should store and retrieve refresh token', () => {
    tokenService.setRefreshToken('test-refresh-token');
    expect(localStorageMock.getItem('refreshToken')).toBe('test-refresh-token');
    expect(tokenService.getRefreshToken()).toBe('test-refresh-token');
  });

  test('should clear all tokens', () => {
    // Set tokens
    tokenService.setAccessToken('test-access-token');
    tokenService.setRefreshToken('test-refresh-token');
    tokenService.setGlobalAdmin(true);
    
    // Clear tokens
    tokenService.clearTokens();
    
    // Verify tokens are cleared
    expect(tokenService.getAccessToken()).toBeNull();
    expect(tokenService.getRefreshToken()).toBeNull();
    expect(tokenService.isGlobalAdmin()).toBe(false);
  });

  test('should check if token is valid', () => {
    // Mock valid token
    const validToken = 'valid-token';
    tokenService.setAccessToken(validToken);
    
    // Mock jwt-decode to return a valid payload
    (jwtDecode as jest.Mock).mockReturnValueOnce({
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    });
    
    expect(tokenService.isTokenValid()).toBe(true);
  });

  test('should detect expired token', () => {
    // Mock expired token
    const expiredToken = 'expired-token';
    tokenService.setAccessToken(expiredToken);
    
    // Mock jwt-decode to return an expired payload
    (jwtDecode as jest.Mock).mockReturnValueOnce({
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    
    expect(tokenService.isTokenValid()).toBe(false);
  });

  test('should handle invalid token format', () => {
    // Mock invalid token
    const invalidToken = 'invalid-token';
    tokenService.setAccessToken(invalidToken);
    
    // Mock jwt-decode to throw an error
    (jwtDecode as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });
    
    expect(tokenService.isTokenValid()).toBe(false);
  });

  test('should get user from token', () => {
    // Mock valid token
    const validToken = 'valid-token';
    tokenService.setAccessToken(validToken);
    
    // Mock jwt-decode to return a valid payload
    const mockPayload: JwtPayload = {
      sub: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'student',
      firstName: 'Test',
      lastName: 'User',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };
    
    (jwtDecode as jest.Mock).mockReturnValueOnce(mockPayload);
    
    const user = tokenService.getUserFromToken();
    expect(user).toEqual({
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'student',
      firstName: 'Test',
      lastName: 'User',
    });
  });

  test('should handle global admin flag', () => {
    // Set global admin flag
    tokenService.setGlobalAdmin(true);
    expect(tokenService.isGlobalAdmin()).toBe(true);
    
    // Mock valid token for admin
    const validToken = 'valid-token';
    tokenService.setAccessToken(validToken);
    
    // Mock jwt-decode to return an admin payload
    const mockPayload: JwtPayload = {
      sub: 'admin-123',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin', // Regular admin role
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    
    (jwtDecode as jest.Mock).mockReturnValueOnce(mockPayload);
    
    // Should return global-admin role due to the flag
    const user = tokenService.getUserFromToken();
    expect(user?.role).toBe('global-admin');
    
    // Clear global admin flag
    tokenService.setGlobalAdmin(false);
    
    // Mock jwt-decode again for the same payload
    (jwtDecode as jest.Mock).mockReturnValueOnce(mockPayload);
    
    // Should return regular admin role
    const regularUser = tokenService.getUserFromToken();
    expect(regularUser?.role).toBe('admin');
  });

  test('should return null when no token is available', () => {
    // No token set
    expect(tokenService.getUserFromToken()).toBeNull();
  });

  test('should return null for expired token', () => {
    // Mock expired token
    const expiredToken = 'expired-token';
    tokenService.setAccessToken(expiredToken);
    
    // Mock jwt-decode to return an expired payload
    (jwtDecode as jest.Mock).mockReturnValueOnce({
      sub: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'student',
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    
    expect(tokenService.getUserFromToken()).toBeNull();
  });
});
