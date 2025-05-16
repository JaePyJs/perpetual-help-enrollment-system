import { renderHook, act } from '@testing-library/react';
import useForm from './useForm';

describe('useForm', () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validator = (values: any) => {
    const errors: Record<string, string> = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    return errors;
  };

  const mockSubmit = jest.fn();

  it('should initialize with initial values', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should update values on handleChange', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.values.name).toBe('John Doe');
  });

  it('should update touched state on handleBlur', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    act(() => {
      result.current.handleBlur({
        target: { name: 'name' },
      } as React.FocusEvent<HTMLInputElement>);
    });
    
    expect(result.current.touched.name).toBe(true);
  });

  it('should validate on handleBlur', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    act(() => {
      result.current.handleBlur({
        target: { name: 'name' },
      } as React.FocusEvent<HTMLInputElement>);
    });
    
    expect(result.current.errors.name).toBe('Name is required');
  });

  it('should update values with setFieldValue', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    act(() => {
      result.current.setFieldValue('name', 'John Doe');
    });
    
    expect(result.current.values.name).toBe('John Doe');
  });

  it('should update touched state with setFieldTouched', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    act(() => {
      result.current.setFieldTouched('name', true);
    });
    
    expect(result.current.touched.name).toBe(true);
  });

  it('should reset form to initial values', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    // Change values
    act(() => {
      result.current.setFieldValue('name', 'John Doe');
      result.current.setFieldValue('email', 'john@example.com');
      result.current.setFieldTouched('name', true);
    });
    
    // Reset form
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('should validate all fields on submit', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    // Submit form with empty values
    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });
    
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password is required');
    expect(result.current.touched.name).toBe(true);
    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.password).toBe(true);
  });

  it('should call onSubmit when form is valid', async () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    // Set valid values
    act(() => {
      result.current.setFieldValue('name', 'John Doe');
      result.current.setFieldValue('email', 'john@example.com');
      result.current.setFieldValue('password', 'password123');
    });
    
    // Submit form
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
  });

  it('should not call onSubmit when form is invalid', async () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validate: validator,
      onSubmit: mockSubmit,
    }));
    
    // Set invalid values
    act(() => {
      result.current.setFieldValue('name', 'John Doe');
      result.current.setFieldValue('email', 'invalid-email');
      result.current.setFieldValue('password', 'short');
    });
    
    // Submit form
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe('Invalid email address');
    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
  });
});
