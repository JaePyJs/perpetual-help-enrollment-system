import { render, screen, fireEvent } from '@testing-library/react';
import Alert from './Alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert variant="info">Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('renders with the correct variant class', () => {
    const { container } = render(<Alert variant="success">Success alert</Alert>);
    expect(container.firstChild).toHaveClass('alert-success');
  });

  it('renders title when provided', () => {
    render(<Alert variant="warning" title="Warning Title">Warning message</Alert>);
    expect(screen.getByText('Warning Title')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <Alert 
        variant="danger" 
        icon={<span data-testid="test-icon" />}
      >
        Danger alert
      </Alert>
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Alert variant="info" onClose={handleClose}>
        Closable alert
      </Alert>
    );
    
    const closeButton = screen.getByRole('button', { name: /close alert/i });
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Alert variant="info">Non-closable alert</Alert>);
    
    const closeButton = screen.queryByRole('button', { name: /close alert/i });
    expect(closeButton).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Alert variant="info" className="custom-class">
        Alert with custom class
      </Alert>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has the correct accessibility role', () => {
    const { container } = render(<Alert variant="info">Accessible alert</Alert>);
    expect(container.firstChild).toHaveAttribute('role', 'alert');
  });
});
