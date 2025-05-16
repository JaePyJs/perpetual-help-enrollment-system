import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { StudentGrades } from '@/components/student/student-grades';
import { studentApi } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

// Mock the API and auth context
jest.mock('@/services/api', () => ({
  studentApi: {
    getGrades: jest.fn(),
    getAcademicTerms: jest.fn(),
    getGpaData: jest.fn(),
  },
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('StudentGrades Component', () => {
  // Sample data for tests
  const mockGrades = [
    {
      id: '1',
      courseCode: 'CS101',
      courseName: 'Introduction to Programming',
      credits: 3,
      grade: 90,
      letterGrade: 'A',
    },
    {
      id: '2',
      courseCode: 'MATH201',
      courseName: 'Calculus I',
      credits: 4,
      grade: 85,
      letterGrade: 'B',
    },
  ];

  const mockTerms = [
    {
      id: '1',
      academicYear: '2023-2024',
      semester: '1st',
      startDate: '2023-08-15',
      endDate: '2023-12-15',
    },
    {
      id: '2',
      academicYear: '2023-2024',
      semester: '2nd',
      startDate: '2024-01-15',
      endDate: '2024-05-15',
    },
  ];

  const mockGpaData = [
    { term: '2022-2023 1st', gpa: 3.5 },
    { term: '2022-2023 2nd', gpa: 3.7 },
    { term: '2023-2024 1st', gpa: 3.8 },
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (studentApi.getGrades as jest.Mock).mockResolvedValue(mockGrades);
    (studentApi.getAcademicTerms as jest.Mock).mockResolvedValue(mockTerms);
    (studentApi.getGpaData as jest.Mock).mockResolvedValue(mockGpaData);
    
    // Mock auth context
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'student-1', role: 'student' },
      isAuthenticated: true,
    });
  });

  test('renders loading state initially', () => {
    render(<StudentGrades />);
    expect(screen.getByText(/Loading your academic records/i)).toBeInTheDocument();
  });

  test('renders grades after loading', async () => {
    render(<StudentGrades />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your academic records/i)).not.toBeInTheDocument();
    });
    
    // Check if grades are displayed
    expect(screen.getByText('Academic Grades')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
    expect(screen.getByText('Calculus I')).toBeInTheDocument();
  });

  test('displays error message when API fails', async () => {
    // Mock API failure
    (studentApi.getGrades as jest.Mock).mockRejectedValue(new Error('Failed to fetch grades'));
    
    render(<StudentGrades />);
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to load grades/i)).toBeInTheDocument();
    });
  });

  test('allows changing academic term', async () => {
    render(<StudentGrades />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your academic records/i)).not.toBeInTheDocument();
    });
    
    // Find and click the term selector
    const termSelector = screen.getByRole('combobox');
    fireEvent.click(termSelector);
    
    // Select a different term
    const secondTerm = screen.getByText('2023-2024 - 2nd Semester');
    fireEvent.click(secondTerm);
    
    // Verify that the API was called with the new term
    expect(studentApi.getGrades).toHaveBeenCalledWith('2023-2024', '2nd');
  });

  test('calculates GPA correctly', async () => {
    render(<StudentGrades />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your academic records/i)).not.toBeInTheDocument();
    });
    
    // Check if GPA is displayed
    expect(screen.getByText('3.80')).toBeInTheDocument(); // Cumulative GPA
  });

  test('displays empty state when no grades are available', async () => {
    // Mock empty grades
    (studentApi.getGrades as jest.Mock).mockResolvedValue([]);
    
    render(<StudentGrades />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your academic records/i)).not.toBeInTheDocument();
    });
    
    // Check if empty state is displayed
    expect(screen.getByText(/No grades available/i)).toBeInTheDocument();
  });
});
