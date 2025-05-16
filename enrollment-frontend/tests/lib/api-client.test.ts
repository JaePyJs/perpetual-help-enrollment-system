import apiClient from '@/lib/api-client';
import tokenService from '@/services/token-service';
import { ApiError } from '@/lib/api-client';

// Mock fetch
global.fetch = jest.fn();

// Mock token service
jest.mock('@/services/token-service', () => ({
  getAccessToken: jest.fn(),
}));

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  test('should make a GET request', async () => {
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'test data' }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    const result = await apiClient.get('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'GET',
      })
    );
    expect(result).toEqual({ data: 'test data' });
  });

  test('should make a POST request with data', async () => {
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    const postData = { name: 'Test', value: 123 };
    const result = await apiClient.post('/test', postData);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData),
      })
    );
    expect(result).toEqual({ success: true });
  });

  test('should include auth token when available', async () => {
    // Mock token
    (tokenService.getAccessToken as jest.Mock).mockReturnValueOnce('test-token');

    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    await apiClient.get('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token',
        }),
      })
    );
  });

  test('should handle API errors', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad request' }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    await expect(apiClient.get('/test')).rejects.toThrow(ApiError);
    await expect(apiClient.get('/test')).rejects.toMatchObject({
      status: 400,
      message: 'Bad request',
    });
  });

  test('should handle network errors', async () => {
    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(apiClient.get('/test')).rejects.toThrow('Network error');
  });

  test('should handle non-JSON responses', async () => {
    // Mock text response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => 'Plain text response',
      json: async () => { throw new Error('Invalid JSON'); },
      headers: new Headers({
        'content-type': 'text/plain',
      }),
    });

    const result = await apiClient.get('/test');
    expect(result).toEqual('Plain text response');
  });

  test('should handle PUT requests', async () => {
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ updated: true }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    const putData = { id: 1, name: 'Updated' };
    const result = await apiClient.put('/test/1', putData);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(putData),
      })
    );
    expect(result).toEqual({ updated: true });
  });

  test('should handle DELETE requests', async () => {
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ deleted: true }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    const result = await apiClient.delete('/test/1');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test/1'),
      expect.objectContaining({
        method: 'DELETE',
      })
    );
    expect(result).toEqual({ deleted: true });
  });

  test('should retry on 401 errors if token refresh is available', async () => {
    // First call returns 401
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    // Second call (after token refresh) succeeds
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'refreshed data' }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });

    // Mock token refresh function
    const mockRefreshToken = jest.fn().mockResolvedValue(true);
    const originalRefreshToken = (apiClient as any).refreshToken;
    (apiClient as any).refreshToken = mockRefreshToken;

    try {
      const result = await apiClient.get('/test');
      expect(mockRefreshToken).toHaveBeenCalled();
      expect(result).toEqual({ data: 'refreshed data' });
    } finally {
      // Restore original function
      (apiClient as any).refreshToken = originalRefreshToken;
    }
  });
});
