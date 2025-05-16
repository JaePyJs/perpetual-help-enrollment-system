import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input id="test" name="test" label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders required indicator when required', () => {
    render(<Input id="test" name="test" label="Test Label" required />);
    const label = screen.getByText('Test Label');
    expect(label.parentElement).toHaveTextContent('*');
  });

  it('renders error message when error is provided', () => {
    render(<Input id="test" name="test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders helper text when provided and no error', () => {
    render(<Input id="test" name="test" helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('does not render helper text when error is provided', () => {
    render(
      <Input
        id="test"
        name="test"
        helperText="Helper text"
        error="This field is required"
      />
    );
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const handleChange = jest.fn();
    render(<Input id="test" name="test" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when input loses focus', () => {
    const handleBlur = jest.fn();
    render(<Input id="test" name="test" onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.blur(input);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('renders with icon on the left', () => {
    render(
      <Input
        id="test"
        name="test"
        icon={<span data-testid="test-icon" />}
        iconPosition="left"
      />
    );
    
    const icon = screen.getByTestId('test-icon');
    const iconContainer = icon.parentElement;
    
    expect(icon).toBeInTheDocument();
    expect(iconContainer).toHaveClass('input-icon-left');
  });

  it('renders with icon on the right', () => {
    render(
      <Input
        id="test"
        name="test"
        icon={<span data-testid="test-icon" />}
        iconPosition="right"
      />
    );
    
    const icon = screen.getByTestId('test-icon');
    const iconContainer = icon.parentElement;
    
    expect(icon).toBeInTheDocument();
    expect(iconContainer).toHaveClass('input-icon-right');
  });

  it('applies disabled attribute when disabled', () => {
    render(<Input id="test" name="test" disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies aria-invalid when error is provided', () => {
    render(<Input id="test" name="test" error="This field is required" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
