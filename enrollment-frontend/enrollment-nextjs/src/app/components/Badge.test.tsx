import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies the primary variant class by default', () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    expect(container.firstChild).toHaveClass('badge-primary');
  });

  it('applies the correct variant class when specified', () => {
    const { container } = render(<Badge variant="success">Success Badge</Badge>);
    expect(container.firstChild).toHaveClass('badge-success');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Custom Badge</Badge>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('combines multiple classes correctly', () => {
    const { container } = render(
      <Badge variant="warning" className="custom-class">Warning Badge</Badge>
    );
    expect(container.firstChild).toHaveClass('badge');
    expect(container.firstChild).toHaveClass('badge-warning');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
