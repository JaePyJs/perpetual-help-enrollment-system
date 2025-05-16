import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs, { TabItem } from './Tabs';

describe('Tabs', () => {
  const mockTabs: TabItem[] = [
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
    { id: 'tab3', label: 'Tab 3', content: <div>Content 3</div>, disabled: true },
  ];
  
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders all tabs', () => {
    render(<Tabs tabs={mockTabs} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });
  
  it('renders the first tab content by default', () => {
    render(<Tabs tabs={mockTabs} />);
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeVisible();
    expect(screen.queryByText('Content 3')).not.toBeVisible();
  });
  
  it('renders the specified default tab content', () => {
    render(<Tabs tabs={mockTabs} defaultActiveTab="tab2" />);
    
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeVisible();
  });
  
  it('switches tab content when tab is clicked', async () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Initially shows first tab content
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    
    // Click on second tab
    await userEvent.click(screen.getByText('Tab 2'));
    
    // Should show second tab content
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
  
  it('calls onChange when tab is clicked', async () => {
    render(<Tabs tabs={mockTabs} onChange={mockOnChange} />);
    
    // Click on second tab
    await userEvent.click(screen.getByText('Tab 2'));
    
    // Should call onChange with tab id
    expect(mockOnChange).toHaveBeenCalledWith('tab2');
  });
  
  it('does not switch to disabled tab when clicked', async () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Initially shows first tab content
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    
    // Click on disabled tab
    await userEvent.click(screen.getByText('Tab 3'));
    
    // Should still show first tab content
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeVisible();
    
    // Should not call onChange
    expect(mockOnChange).not.toHaveBeenCalled();
  });
  
  it('applies the correct variant class', () => {
    const { container } = render(<Tabs tabs={mockTabs} variant="pills" />);
    
    expect(container.querySelector('.tabs-pills')).toBeInTheDocument();
  });
  
  it('applies the correct orientation class', () => {
    const { container } = render(<Tabs tabs={mockTabs} orientation="vertical" />);
    
    expect(container.querySelector('.tabs-vertical')).toBeInTheDocument();
    expect(container.querySelector('.tabs-list-vertical')).toBeInTheDocument();
  });
  
  it('applies custom className', () => {
    const { container } = render(
      <Tabs 
        tabs={mockTabs} 
        className="custom-tabs"
        tabClassName="custom-tab"
        contentClassName="custom-content"
      />
    );
    
    expect(container.querySelector('.custom-tabs')).toBeInTheDocument();
    expect(container.querySelector('.custom-tab')).toBeInTheDocument();
    expect(container.querySelector('.custom-content')).toBeInTheDocument();
  });
  
  it('renders tab with icon when provided', () => {
    const tabsWithIcon: TabItem[] = [
      { 
        id: 'tab1', 
        label: 'Tab 1', 
        icon: <span data-testid="tab-icon">🔍</span>, 
        content: <div>Content 1</div> 
      },
      { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
    ];
    
    render(<Tabs tabs={tabsWithIcon} />);
    
    expect(screen.getByTestId('tab-icon')).toBeInTheDocument();
  });
  
  it('has the correct accessibility attributes', () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Tab list
    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveAttribute('aria-orientation', 'horizontal');
    
    // Active tab
    const activeTab = screen.getByRole('tab', { selected: true });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
    expect(activeTab).toHaveAttribute('tabindex', '0');
    expect(activeTab).toHaveAttribute('aria-controls', 'tabpanel-tab1');
    
    // Inactive tab
    const inactiveTab = screen.getByRole('tab', { name: 'Tab 2' });
    expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    expect(inactiveTab).toHaveAttribute('tabindex', '-1');
    
    // Tab panel
    const tabPanel = screen.getByRole('tabpanel');
    expect(tabPanel).toHaveAttribute('aria-labelledby', 'tab-tab1');
    expect(tabPanel).toHaveAttribute('tabindex', '0');
  });
});
