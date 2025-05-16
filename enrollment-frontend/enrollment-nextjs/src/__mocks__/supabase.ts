/**
 * Supabase Mock
 * 
 * This file provides mock implementations of the Supabase client for testing.
 * It can be used to simulate Supabase responses in tests without making actual API calls.
 */

// Mock data for different tables
const mockUsers = [
  { id: '1', email: 'student@example.com', role: 'student', name: 'Student User' },
  { id: '2', email: 'teacher@example.com', role: 'teacher', name: 'Teacher User' },
  { id: '3', email: 'admin@example.com', role: 'admin', name: 'Admin User' },
];

const mockStudents = [
  { id: '1', user_id: '1', student_id: 'S-2023-0001', department: 'BSIT', year_level: '2' },
  { id: '2', user_id: '4', student_id: 'S-2023-0002', department: 'BSCS', year_level: '3' },
];

const mockTeachers = [
  { id: '1', user_id: '2', teacher_id: 'T-2023-0001', department: 'BSIT' },
  { id: '2', user_id: '5', teacher_id: 'T-2023-0002', department: 'BSCS' },
];

const mockCourses = [
  { id: '1', code: 'CS101', name: 'Introduction to Computer Science', units: 3 },
  { id: '2', code: 'CS102', name: 'Data Structures and Algorithms', units: 3 },
];

// Create a chainable query builder
const createQueryBuilder = (table: any[], errorState = { shouldError: false, message: '' }) => {
  let filtered = [...table];
  let singleResult = false;
  
  const builder = {
    // Filter methods
    eq: (column: string, value: any) => {
      filtered = filtered.filter(item => item[column] === value);
      return builder;
    },
    neq: (column: string, value: any) => {
      filtered = filtered.filter(item => item[column] !== value);
      return builder;
    },
    gt: (column: string, value: any) => {
      filtered = filtered.filter(item => item[column] > value);
      return builder;
    },
    gte: (column: string, value: any) => {
      filtered = filtered.filter(item => item[column] >= value);
      return builder;
    },
    lt: (column: string, value: any) => {
      filtered = filtered.filter(item => item[column] < value);
      return builder;
    },
    lte: (column: string, value: any) => {
      filtered = filtered.filter(item => item[column] <= value);
      return builder;
    },
    like: (column: string, value: any) => {
      filtered = filtered.filter(item => item[column]?.includes(value));
      return builder;
    },
    in: (column: string, values: any[]) => {
      filtered = filtered.filter(item => values.includes(item[column]));
      return builder;
    },
    
    // Result methods
    single: () => {
      singleResult = true;
      return builder;
    },
    
    // Execute the query
    then: (callback: Function) => {
      if (errorState.shouldError) {
        return Promise.resolve(callback({
          data: null,
          error: { message: errorState.message },
        }));
      }
      
      const result = singleResult ? (filtered[0] || null) : filtered;
      return Promise.resolve(callback({
        data: result,
        error: null,
      }));
    },
  };
  
  return builder;
};

// Mock Supabase client
export const createClient = () => {
  // Error state for simulating errors
  const errorState = { shouldError: false, message: '' };
  
  // Set error state for testing error scenarios
  const setError = (shouldError: boolean, message: string = 'An error occurred') => {
    errorState.shouldError = shouldError;
    errorState.message = message;
  };
  
  return {
    // Auth methods
    auth: {
      signIn: jest.fn().mockImplementation(({ email, password }) => {
        if (errorState.shouldError) {
          return Promise.resolve({ data: null, error: { message: errorState.message } });
        }
        
        const user = mockUsers.find(u => u.email === email);
        if (!user) {
          return Promise.resolve({ data: null, error: { message: 'Invalid email or password' } });
        }
        
        return Promise.resolve({ data: { user }, error: null });
      }),
      
      signUp: jest.fn().mockImplementation(({ email, password }) => {
        if (errorState.shouldError) {
          return Promise.resolve({ data: null, error: { message: errorState.message } });
        }
        
        if (mockUsers.some(u => u.email === email)) {
          return Promise.resolve({ data: null, error: { message: 'Email already in use' } });
        }
        
        const newUser = { id: String(mockUsers.length + 1), email, role: 'student', name: 'New User' };
        mockUsers.push(newUser);
        
        return Promise.resolve({ data: { user: newUser }, error: null });
      }),
      
      signOut: jest.fn().mockImplementation(() => {
        if (errorState.shouldError) {
          return Promise.resolve({ error: { message: errorState.message } });
        }
        
        return Promise.resolve({ error: null });
      }),
      
      getSession: jest.fn().mockImplementation(() => {
        if (errorState.shouldError) {
          return Promise.resolve({ data: { session: null }, error: { message: errorState.message } });
        }
        
        return Promise.resolve({
          data: {
            session: {
              user: mockUsers[0],
              access_token: 'mock-token',
              expires_at: Date.now() + 3600,
            }
          },
          error: null
        });
      }),
    },
    
    // Database methods
    from: (table: string) => {
      let data: any[] = [];
      
      switch (table) {
        case 'users':
          data = mockUsers;
          break;
        case 'students':
          data = mockStudents;
          break;
        case 'teachers':
          data = mockTeachers;
          break;
        case 'courses':
          data = mockCourses;
          break;
        default:
          data = [];
      }
      
      return {
        select: (columns = '*') => createQueryBuilder(data, errorState),
        insert: (values: any) => {
          if (errorState.shouldError) {
            return Promise.resolve({ data: null, error: { message: errorState.message } });
          }
          
          const newItem = { id: String(data.length + 1), ...values };
          data.push(newItem);
          
          return Promise.resolve({ data: newItem, error: null });
        },
        update: (values: any) => {
          return {
            eq: (column: string, value: any) => {
              if (errorState.shouldError) {
                return Promise.resolve({ data: null, error: { message: errorState.message } });
              }
              
              const index = data.findIndex(item => item[column] === value);
              if (index === -1) {
                return Promise.resolve({ data: null, error: { message: 'Item not found' } });
              }
              
              data[index] = { ...data[index], ...values };
              
              return Promise.resolve({ data: data[index], error: null });
            }
          };
        },
        delete: () => {
          return {
            eq: (column: string, value: any) => {
              if (errorState.shouldError) {
                return Promise.resolve({ data: null, error: { message: errorState.message } });
              }
              
              const index = data.findIndex(item => item[column] === value);
              if (index === -1) {
                return Promise.resolve({ data: null, error: { message: 'Item not found' } });
              }
              
              const deleted = data.splice(index, 1)[0];
              
              return Promise.resolve({ data: deleted, error: null });
            }
          };
        }
      };
    },
    
    // Storage methods
    storage: {
      from: (bucket: string) => ({
        upload: jest.fn().mockImplementation((path, file) => {
          if (errorState.shouldError) {
            return Promise.resolve({ data: null, error: { message: errorState.message } });
          }
          
          return Promise.resolve({ data: { path }, error: null });
        }),
        
        download: jest.fn().mockImplementation((path) => {
          if (errorState.shouldError) {
            return Promise.resolve({ data: null, error: { message: errorState.message } });
          }
          
          return Promise.resolve({ data: new Blob(['mock file content']), error: null });
        }),
        
        getPublicUrl: jest.fn().mockImplementation((path) => {
          return { data: { publicUrl: `https://mock-storage.com/${bucket}/${path}` } };
        }),
        
        remove: jest.fn().mockImplementation((paths) => {
          if (errorState.shouldError) {
            return Promise.resolve({ data: null, error: { message: errorState.message } });
          }
          
          return Promise.resolve({ data: { paths }, error: null });
        }),
      }),
    },
    
    // Helper for testing
    _setError: setError,
    _getMockData: () => ({
      users: mockUsers,
      students: mockStudents,
      teachers: mockTeachers,
      courses: mockCourses,
    }),
  };
};

export default { createClient };
