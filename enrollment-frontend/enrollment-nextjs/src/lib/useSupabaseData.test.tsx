import { renderHook, waitFor } from '@testing-library/react';
import { useSupabaseData, createRecord, updateRecord, deleteRecord } from './useSupabaseData';
import { supabase } from './supabaseClient';

// Mock the supabaseClient
jest.mock('./supabaseClient', () => {
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockOrder = jest.fn();
  const mockLimit = jest.fn();
  const mockFrom = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  
  return {
    supabase: {
      from: jest.fn(() => ({
        select: mockSelect.mockReturnThis(),
        eq: mockEq.mockReturnThis(),
        order: mockOrder.mockReturnThis(),
        limit: mockLimit.mockReturnThis(),
        insert: mockInsert.mockReturnThis(),
        update: mockUpdate.mockReturnThis(),
        delete: mockDelete.mockReturnThis(),
      })),
    },
    handleSupabaseError: jest.fn((error) => ({ data: null, error: error.message || 'An error occurred' })),
    SupabaseResponse: jest.fn(),
  };
});

describe('useSupabaseData', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('fetches data successfully', async () => {
    // Mock successful response
    const mockQuery = {
      data: mockData,
      error: null,
    };
    
    // Setup the mock to resolve with our data
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: (callback: Function) => Promise.resolve(callback(mockQuery)),
    }));
    
    // Render the hook
    const { result } = renderHook(() => useSupabaseData({
      table: 'users',
    }));
    
    // Initially should be loading with no data
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    
    // Wait for the data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should have data and no error
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    
    // Should have called supabase.from with the correct table
    expect(supabase.from).toHaveBeenCalledWith('users');
  });
  
  it('handles fetch error', async () => {
    // Mock error response
    const mockQuery = {
      data: null,
      error: { message: 'Failed to fetch data' },
    };
    
    // Setup the mock to resolve with our error
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: (callback: Function) => Promise.resolve(callback(mockQuery)),
    }));
    
    // Render the hook
    const { result } = renderHook(() => useSupabaseData({
      table: 'users',
    }));
    
    // Wait for the error to be set
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should have error and no data
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Failed to fetch data');
  });
  
  it('applies match conditions correctly', async () => {
    // Mock successful response
    const mockQuery = {
      data: [mockData[0]],
      error: null,
    };
    
    // Setup the mock with spy functions
    const selectSpy = jest.fn().mockReturnThis();
    const eqSpy = jest.fn().mockReturnThis();
    
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: selectSpy,
      eq: eqSpy,
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: (callback: Function) => Promise.resolve(callback(mockQuery)),
    }));
    
    // Render the hook with match conditions
    renderHook(() => useSupabaseData({
      table: 'users',
      match: { id: 1, role: 'admin' },
    }));
    
    // Should have called select
    expect(selectSpy).toHaveBeenCalledWith('*');
    
    // Should have called eq twice with the correct parameters
    expect(eqSpy).toHaveBeenCalledWith('id', 1);
    expect(eqSpy).toHaveBeenCalledWith('role', 'admin');
  });
  
  it('applies ordering correctly', async () => {
    // Mock successful response
    const mockQuery = {
      data: mockData,
      error: null,
    };
    
    // Setup the mock with spy functions
    const selectSpy = jest.fn().mockReturnThis();
    const orderSpy = jest.fn().mockReturnThis();
    
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: selectSpy,
      eq: jest.fn().mockReturnThis(),
      order: orderSpy,
      limit: jest.fn().mockReturnThis(),
      then: (callback: Function) => Promise.resolve(callback(mockQuery)),
    }));
    
    // Render the hook with ordering
    renderHook(() => useSupabaseData({
      table: 'users',
      order: { column: 'name', ascending: false },
    }));
    
    // Should have called order with the correct parameters
    expect(orderSpy).toHaveBeenCalledWith('name', { ascending: false });
  });
  
  it('applies limit correctly', async () => {
    // Mock successful response
    const mockQuery = {
      data: [mockData[0]],
      error: null,
    };
    
    // Setup the mock with spy functions
    const selectSpy = jest.fn().mockReturnThis();
    const limitSpy = jest.fn().mockReturnThis();
    
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: selectSpy,
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: limitSpy,
      then: (callback: Function) => Promise.resolve(callback(mockQuery)),
    }));
    
    // Render the hook with limit
    renderHook(() => useSupabaseData({
      table: 'users',
      limit: 1,
    }));
    
    // Should have called limit with the correct parameter
    expect(limitSpy).toHaveBeenCalledWith(1);
  });
  
  it('refetches data when called', async () => {
    // Mock successful response
    const mockQuery = {
      data: mockData,
      error: null,
    };
    
    // Setup the mock
    const fromSpy = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: (callback: Function) => Promise.resolve(callback(mockQuery)),
    }));
    
    (supabase.from as jest.Mock).mockImplementation(fromSpy);
    
    // Render the hook
    const { result } = renderHook(() => useSupabaseData({
      table: 'users',
    }));
    
    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Reset the spy count
    fromSpy.mockClear();
    
    // Call refetch
    await result.current.refetch();
    
    // Should have called from again
    expect(fromSpy).toHaveBeenCalledTimes(1);
  });
});
