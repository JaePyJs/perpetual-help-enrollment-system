import { render, screen, fireEvent } from '@testing-library/react';
import Form, { FormRow, FormActions } from './Form';

describe('Form', () => {
  it('renders children', () => {
    render(
      <Form onSubmit={() => {}}>
        <div>Form content</div>
      </Form>
    );
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', () => {
    const handleSubmit = jest.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );
    
    fireEvent.submit(screen.getByRole('form'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Form onSubmit={() => {}} className="custom-form">
        <div>Form content</div>
      </Form>
    );
    expect(container.firstChild).toHaveClass('custom-form');
  });

  it('sets id attribute when provided', () => {
    render(
      <Form onSubmit={() => {}} id="test-form">
        <div>Form content</div>
      </Form>
    );
    expect(screen.getByRole('form')).toHaveAttribute('id', 'test-form');
  });

  it('sets autoComplete attribute', () => {
    render(
      <Form onSubmit={() => {}} autoComplete="off">
        <div>Form content</div>
      </Form>
    );
    expect(screen.getByRole('form')).toHaveAttribute('autocomplete', 'off');
  });

  it('sets noValidate attribute when true', () => {
    render(
      <Form onSubmit={() => {}} noValidate>
        <div>Form content</div>
      </Form>
    );
    expect(screen.getByRole('form')).toHaveAttribute('novalidate', '');
  });
});

describe('FormRow', () => {
  it('renders children', () => {
    render(
      <FormRow>
        <div>Row content</div>
      </FormRow>
    );
    expect(screen.getByText('Row content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormRow className="custom-row">
        <div>Row content</div>
      </FormRow>
    );
    expect(container.firstChild).toHaveClass('custom-row');
  });
});

describe('FormActions', () => {
  it('renders children', () => {
    render(
      <FormActions>
        <button>Submit</button>
      </FormActions>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormActions className="custom-actions">
        <button>Submit</button>
      </FormActions>
    );
    expect(container.firstChild).toHaveClass('custom-actions');
  });

  it('applies alignment class', () => {
    const { container } = render(
      <FormActions align="center">
        <button>Submit</button>
      </FormActions>
    );
    expect(container.firstChild).toHaveClass('form-actions-center');
  });

  it('defaults to right alignment', () => {
    const { container } = render(
      <FormActions>
        <button>Submit</button>
      </FormActions>
    );
    expect(container.firstChild).toHaveClass('form-actions-right');
  });
});
