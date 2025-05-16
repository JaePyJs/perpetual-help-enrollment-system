import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Card Title">Card Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<Card subtitle="Card Subtitle">Card Content</Card>);
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Card footer={<button>Footer Button</button>}>Card Content</Card>);
    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  it('renders header action when provided', () => {
    render(
      <Card headerAction={<button>Action Button</button>}>Card Content</Card>
    );
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    const { container } = render(<Card variant="compact">Card Content</Card>);
    expect(container.firstChild).toHaveClass('card-compact');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Card Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
