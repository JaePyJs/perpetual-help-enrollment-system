import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("applies the correct variant class", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText("Secondary Button");
    expect(button).toHaveClass("btn-secondary");
  });

  it("applies the correct size class", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByText("Large Button");
    expect(button).toHaveClass("btn-lg");
  });

  it("applies fullWidth class when fullWidth is true", () => {
    render(<Button fullWidth>Full Width Button</Button>);
    const button = screen.getByText("Full Width Button");
    expect(button).toHaveClass("w-full");
  });

  it("renders with an icon", () => {
    render(
      <Button icon={<span data-testid="test-icon" />}>Button with Icon</Button>
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("positions icon correctly based on iconPosition prop", () => {
    const { rerender } = render(
      <Button icon={<span data-testid="test-icon" />} iconPosition="left">
        Button with Left Icon
      </Button>
    );

    const button = screen.getByText("Button with Left Icon");
    const buttonHTML = button.outerHTML;
    expect(buttonHTML.indexOf("test-icon")).toBeLessThan(
      buttonHTML.indexOf("Button with Left Icon")
    );

    rerender(
      <Button icon={<span data-testid="test-icon" />} iconPosition="right">
        Button with Right Icon
      </Button>
    );

    const updatedButton = screen.getByText("Button with Right Icon");
    const updatedButtonHTML = updatedButton.outerHTML;
    expect(updatedButtonHTML.indexOf("test-icon")).toBeGreaterThan(
      updatedButtonHTML.indexOf("Button with Right Icon")
    );
  });
});
