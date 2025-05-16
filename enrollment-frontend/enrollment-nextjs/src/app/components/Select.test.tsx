import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select', () => {
  it('renders with label', () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        label="Test Label"
      />
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
      />
    );
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders required indicator when required', () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        label="Test Label"
        required
      />
    );
    const label = screen.getByText('Test Label');
    expect(label.parentElement).toHaveTextContent('*');
  });

  it('renders error message when error is provided', () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        error="This field is required"
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders helper text when provided and no error', () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        helperText="Helper text"
      />
    );
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('does not render helper text when error is provided', () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        helperText="Helper text"
        error="This field is required"
      />
    );
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('calls onChange when select value changes', () => {
    const handleChange = jest.fn();
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when select loses focus', () => {
    const handleBlur = jest.fn();
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        onBlur={handleBlur}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.blur(select);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('renders placeholder option when provided', () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        placeholder="Select an option"
      />
    );
    
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('applies disabled attribute when disabled', () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        disabled
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('applies aria-invalid when error is provided', () => {
    render(
      <Select
        id="test-select"
        name="test-select"
        options={mockOptions}
        error="This field is required"
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });
});
