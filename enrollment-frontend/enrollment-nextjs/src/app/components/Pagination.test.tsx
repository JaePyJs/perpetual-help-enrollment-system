import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders with correct current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    
    const currentPageButton = screen.getByRole('button', { current: 'page' });
    expect(currentPageButton).toHaveTextContent('3');
  });
  
  it('calls onPageChange when a page button is clicked', async () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    
    // Click on page 5
    await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));
    
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });
  
  it('disables previous and first buttons on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).not.toBeDisabled();
  });
  
  it('disables next and last buttons on last page', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    
    expect(screen.getByRole('button', { name: 'First page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });
  
  it('navigates to previous page when prev button is clicked', async () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
  
  it('navigates to next page when next button is clicked', async () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });
  
  it('navigates to first page when first button is clicked', async () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'First page' }));
    
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });
  
  it('navigates to last page when last button is clicked', async () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'Last page' }));
    
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });
  
  it('renders simple variant correctly', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        variant="simple"
      />
    );
    
    expect(screen.getByText('Page 5 of 10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveTextContent('Previous');
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveTextContent('Next');
    
    // Should not render page buttons in simple variant
    expect(screen.queryByRole('button', { name: 'Page 5' })).not.toBeInTheDocument();
  });
  
  it('hides first/last buttons when showFirstLast is false', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        showFirstLast={false}
      />
    );
    
    expect(screen.queryByRole('button', { name: 'First page' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Last page' })).not.toBeInTheDocument();
  });
  
  it('hides prev/next buttons when showPrevNext is false', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        showPrevNext={false}
      />
    );
    
    expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
  });
  
  it('disables all buttons when disabled is true', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        disabled={true}
      />
    );
    
    screen.getAllByRole('button').forEach(button => {
      expect(button).toBeDisabled();
    });
  });
  
  it('applies custom className', () => {
    const { container } = render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        className="custom-pagination"
      />
    );
    
    expect(container.querySelector('.custom-pagination')).toBeInTheDocument();
  });
  
  it('applies the correct size class', () => {
    const { container, rerender } = render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        size="small"
      />
    );
    
    expect(container.querySelector('.pagination-small')).toBeInTheDocument();
    
    rerender(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        size="large"
      />
    );
    
    expect(container.querySelector('.pagination-large')).toBeInTheDocument();
  });
  
  it('shows ellipsis for large page ranges', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );
    
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBe(2); // Should show ellipsis on both sides
  });
});
