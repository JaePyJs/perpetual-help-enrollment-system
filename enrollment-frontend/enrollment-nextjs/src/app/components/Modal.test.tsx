import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });
  
  it('renders content when open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });
  
  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Modal Title">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });
  
  it('renders footer when provided', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        footer={<button>Save</button>}
      >
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', async () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    await userEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('calls onClose when clicking outside if closeOnOutsideClick is true', async () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnOutsideClick={true}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Click on the overlay (outside the modal content)
    const overlay = screen.getByRole('presentation');
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClose when clicking outside if closeOnOutsideClick is false', async () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnOutsideClick={false}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Click on the overlay (outside the modal content)
    const overlay = screen.getByRole('presentation');
    fireEvent.click(overlay);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
  
  it('calls onClose when Escape key is pressed if closeOnEscape is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnEscape={true}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClose when Escape key is pressed if closeOnEscape is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnEscape={false}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
  
  it('applies the correct size class', () => {
    const { container, rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="small">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(container.querySelector('.modal-small')).toBeInTheDocument();
    
    rerender(
      <Modal isOpen={true} onClose={mockOnClose} size="large">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(container.querySelector('.modal-large')).toBeInTheDocument();
  });
  
  it('applies custom className', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-modal">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(container.querySelector('.custom-modal')).toBeInTheDocument();
  });
  
  it('has the correct accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Accessible Modal">
        <div>Modal Content</div>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });
});
