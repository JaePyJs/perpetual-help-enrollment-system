import { createClient } from './supabase';

describe('Supabase Mock', () => {
  let supabase: ReturnType<typeof createClient>;

  beforeEach(() => {
    supabase = createClient();
  });

  describe('Auth', () => {
    it('should sign in a user with valid credentials', async () => {
      const result = await supabase.auth.signIn({ 
        email: 'student@example.com', 
        password: 'password' 
      });
      
      expect(result.data.user).toBeTruthy();
      expect(result.data.user.email).toBe('student@example.com');
      expect(result.error).toBeNull();
    });

    it('should return an error for invalid credentials', async () => {
      const result = await supabase.auth.signIn({ 
        email: 'nonexistent@example.com', 
        password: 'password' 
      });
      
      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });

    it('should sign up a new user', async () => {
      const result = await supabase.auth.signUp({ 
        email: 'newuser@example.com', 
        password: 'password' 
      });
      
      expect(result.data.user).toBeTruthy();
      expect(result.data.user.email).toBe('newuser@example.com');
      expect(result.error).toBeNull();
    });

    it('should return an error when signing up with an existing email', async () => {
      // First sign up
      await supabase.auth.signUp({ 
        email: 'duplicate@example.com', 
        password: 'password' 
      });
      
      // Try to sign up again with the same email
      const result = await supabase.auth.signUp({ 
        email: 'duplicate@example.com', 
        password: 'password' 
      });
      
      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });

    it('should sign out a user', async () => {
      const result = await supabase.auth.signOut();
      expect(result.error).toBeNull();
    });

    it('should get the current session', async () => {
      const result = await supabase.auth.getSession();
      expect(result.data.session).toBeTruthy();
      expect(result.data.session.user).toBeTruthy();
      expect(result.error).toBeNull();
    });
  });

  describe('Database', () => {
    it('should select all users', async () => {
      const { data, error } = await supabase.from('users').select().then(res => res);
      
      expect(error).toBeNull();
      expect(data).toHaveLength(3); // Based on the mock data
      expect(data[0].email).toBe('student@example.com');
    });

    it('should filter users with eq', async () => {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('role', 'teacher')
        .then(res => res);
      
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data[0].role).toBe('teacher');
    });

    it('should return a single result', async () => {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', '1')
        .single()
        .then(res => res);
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data.id).toBe('1');
    });

    it('should insert a new record', async () => {
      const newCourse = { code: 'CS103', name: 'Web Development', units: 3 };
      const { data, error } = await supabase
        .from('courses')
        .insert(newCourse);
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data.code).toBe('CS103');
      
      // Verify it was added to the mock data
      const { data: courses } = await supabase
        .from('courses')
        .select()
        .then(res => res);
      
      expect(courses).toHaveLength(3); // 2 initial + 1 new
    });

    it('should update a record', async () => {
      const { data, error } = await supabase
        .from('courses')
        .update({ name: 'Updated Course Name' })
        .eq('id', '1');
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data.name).toBe('Updated Course Name');
      
      // Verify it was updated in the mock data
      const { data: course } = await supabase
        .from('courses')
        .select()
        .eq('id', '1')
        .single()
        .then(res => res);
      
      expect(course.name).toBe('Updated Course Name');
    });

    it('should delete a record', async () => {
      const { data, error } = await supabase
        .from('courses')
        .delete()
        .eq('id', '1');
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      
      // Verify it was deleted from the mock data
      const { data: courses } = await supabase
        .from('courses')
        .select()
        .then(res => res);
      
      expect(courses).toHaveLength(1); // 2 initial - 1 deleted
    });
  });

  describe('Storage', () => {
    it('should upload a file', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const { data, error } = await supabase
        .storage
        .from('documents')
        .upload('test.txt', file);
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data.path).toBe('test.txt');
    });

    it('should download a file', async () => {
      const { data, error } = await supabase
        .storage
        .from('documents')
        .download('test.txt');
      
      expect(error).toBeNull();
      expect(data).toBeInstanceOf(Blob);
    });

    it('should get a public URL for a file', () => {
      const { data } = supabase
        .storage
        .from('documents')
        .getPublicUrl('test.txt');
      
      expect(data.publicUrl).toBe('https://mock-storage.com/documents/test.txt');
    });

    it('should remove a file', async () => {
      const { data, error } = await supabase
        .storage
        .from('documents')
        .remove(['test.txt']);
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data.paths).toEqual(['test.txt']);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in auth methods', async () => {
      supabase._setError(true, 'Auth error');
      
      const result = await supabase.auth.signIn({ 
        email: 'student@example.com', 
        password: 'password' 
      });
      
      expect(result.data).toBeNull();
      expect(result.error.message).toBe('Auth error');
    });

    it('should handle errors in database methods', async () => {
      supabase._setError(true, 'Database error');
      
      const { data, error } = await supabase
        .from('users')
        .select()
        .then(res => res);
      
      expect(data).toBeNull();
      expect(error.message).toBe('Database error');
    });

    it('should handle errors in storage methods', async () => {
      supabase._setError(true, 'Storage error');
      
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const { data, error } = await supabase
        .storage
        .from('documents')
        .upload('test.txt', file);
      
      expect(data).toBeNull();
      expect(error.message).toBe('Storage error');
    });
  });
});
