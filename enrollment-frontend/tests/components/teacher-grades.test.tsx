import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TeacherGrades } from '@/components/teacher/teacher-grades';
import { teacherApi } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

// Mock the API and auth context
jest.mock('@/services/api', () => ({
  teacherApi: {
    getCourses: jest.fn(),
    getStudents: jest.fn(),
    submitGrades: jest.fn(),
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

describe('TeacherGrades Component', () => {
  // Sample data for tests
  const mockCourses = [
    {
      id: 'course-1',
      code: 'CS101',
      name: 'Introduction to Programming',
      section: 'A',
      schedule: 'MWF 9:00 AM - 10:30 AM',
      room: 'Room 101',
      students: [
        {
          id: 'student-1',
          name: 'John Doe',
          studentId: 'M23-1470-578',
          email: 'john.doe@uphc.edu.ph',
        },
        {
          id: 'student-2',
          name: 'Jane Smith',
          studentId: 'M23-1470-579',
          email: 'jane.smith@uphc.edu.ph',
        },
      ],
    },
    {
      id: 'course-2',
      code: 'CS201',
      name: 'Data Structures and Algorithms',
      section: 'B',
      schedule: 'TTh 1:00 PM - 2:30 PM',
      room: 'Room 203',
      students: [
        {
          id: 'student-3',
          name: 'Robert Johnson',
          studentId: 'M23-1470-580',
          email: 'robert.johnson@uphc.edu.ph',
        },
      ],
    },
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (teacherApi.getCourses as jest.Mock).mockResolvedValue(mockCourses);
    (teacherApi.submitGrades as jest.Mock).mockResolvedValue(true);
    
    // Mock auth context
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'teacher-1', role: 'teacher' },
      isAuthenticated: true,
    });
  });

  test('renders loading state initially', () => {
    render(<TeacherGrades />);
    expect(screen.getByText(/Loading course data/i)).toBeInTheDocument();
  });

  test('renders courses after loading', async () => {
    render(<TeacherGrades />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading course data/i)).not.toBeInTheDocument();
    });
    
    // Check if course information is displayed
    expect(screen.getByText('Grade Management')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
    expect(screen.getByText('Section A • MWF 9:00 AM - 10:30 AM • Room 101')).toBeInTheDocument();
  });

  test('displays error message when API fails', async () => {
    // Mock API failure
    (teacherApi.getCourses as jest.Mock).mockRejectedValue(new Error('Failed to fetch courses'));
    
    render(<TeacherGrades />);
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to load courses/i)).toBeInTheDocument();
    });
  });

  test('allows changing selected course', async () => {
    render(<TeacherGrades />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading course data/i)).not.toBeInTheDocument();
    });
    
    // Find and click the course selector
    const courseSelector = screen.getByRole('combobox');
    fireEvent.click(courseSelector);
    
    // Select a different course
    const secondCourse = screen.getByText('CS201 - Data Structures and Algorithms');
    fireEvent.click(secondCourse);
    
    // Verify that the course information changed
    expect(screen.getByText('Data Structures and Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Section B • TTh 1:00 PM - 2:30 PM • Room 203')).toBeInTheDocument();
  });

  test('allows editing student grades', async () => {
    render(<TeacherGrades />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading course data/i)).not.toBeInTheDocument();
    });
    
    // Find and click the edit button for the first student
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    // Find the midterm input and change its value
    const midtermInput = screen.getByRole('spinbutton', { name: '' });
    fireEvent.change(midtermInput, { target: { value: '95' } });
    
    // Save the grades
    const saveButton = screen.getByRole('button', { name: /Save Grades/i });
    fireEvent.click(saveButton);
    
    // Verify that the API was called with the correct data
    await waitFor(() => {
      expect(teacherApi.submitGrades).toHaveBeenCalled();
      expect(screen.getByText(/Grades saved successfully/i)).toBeInTheDocument();
    });
  });

  test('displays empty state when no courses are available', async () => {
    // Mock empty courses
    (teacherApi.getCourses as jest.Mock).mockResolvedValue([]);
    
    render(<TeacherGrades />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading course data/i)).not.toBeInTheDocument();
    });
    
    // Check if empty state is displayed
    expect(screen.getByText(/No courses available/i)).toBeInTheDocument();
  });

  test('allows searching for students', async () => {
    render(<TeacherGrades />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading course data/i)).not.toBeInTheDocument();
    });
    
    // Find the search input and enter a search term
    const searchInput = screen.getByPlaceholderText('Search students...');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    
    // Verify that only the matching student is displayed
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
