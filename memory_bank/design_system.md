# Design System

This document outlines the design system for the School Enrollment System, providing guidelines for consistent visual design and user experience.

## Color Palette

Our color palette is built around the primary brand color (#e77f33) with complementary colors that create a cohesive and accessible design.

### Primary Colors (Orange)

The primary orange color represents the brand identity of Perpetual Help College.

- `--primary-50`: #fff8f1 - Lightest orange, used for backgrounds and hover states
- `--primary-100`: #feecdc - Very light orange, used for backgrounds and borders
- `--primary-200`: #fcd9bd - Light orange, used for backgrounds and borders
- `--primary-300`: #fdba8c - Medium light orange, used for accents and highlights
- `--primary-400`: #ff8a4c - Medium orange, used for secondary buttons and icons
- `--primary-500`: #e77f33 - Brand orange, used for primary buttons and key elements
- `--primary-600`: #dd6b20 - Darker orange, used for hover states
- `--primary-700`: #c05621 - Dark orange, used for active states
- `--primary-800`: #9c4221 - Very dark orange, used for text on light backgrounds
- `--primary-900`: #7b341e - Darkest orange, used for text on light backgrounds

### Secondary Colors (Blue)

The secondary blue color is complementary to orange and provides a nice contrast for secondary actions and information.

- `--secondary-50`: #ebf5ff - Lightest blue, used for backgrounds
- `--secondary-100`: #e1effe - Very light blue, used for backgrounds
- `--secondary-200`: #c3ddfd - Light blue, used for backgrounds and borders
- `--secondary-300`: #a4cafe - Medium light blue, used for accents
- `--secondary-400`: #76a9fa - Medium blue, used for secondary elements
- `--secondary-500`: #3f83f8 - Main blue, used for secondary buttons and links
- `--secondary-600`: #1c64f2 - Darker blue, used for hover states
- `--secondary-700`: #1a56db - Dark blue, used for active states
- `--secondary-800`: #1e429f - Very dark blue, used for text on light backgrounds
- `--secondary-900`: #233876 - Darkest blue, used for text on light backgrounds

### Accent Colors (Purple)

The accent purple color is used for highlighting special elements and creating visual interest.

- `--accent-50`: #f5f3ff - Lightest purple, used for backgrounds
- `--accent-100`: #ede9fe - Very light purple, used for backgrounds
- `--accent-200`: #ddd6fe - Light purple, used for backgrounds and borders
- `--accent-300`: #c4b5fd - Medium light purple, used for accents
- `--accent-400`: #a78bfa - Medium purple, used for accents
- `--accent-500`: #8b5cf6 - Main purple, used for accent elements
- `--accent-600`: #7c3aed - Darker purple, used for hover states
- `--accent-700`: #6d28d9 - Dark purple, used for active states
- `--accent-800`: #5b21b6 - Very dark purple, used for text on light backgrounds
- `--accent-900`: #4c1d95 - Darkest purple, used for text on light backgrounds

### Neutral Colors (Gray)

The neutral gray colors are used for text, backgrounds, and borders.

- `--neutral-50`: #f9fafb - Lightest gray, used for backgrounds
- `--neutral-100`: #f3f4f6 - Very light gray, used for backgrounds
- `--neutral-200`: #e5e7eb - Light gray, used for borders
- `--neutral-300`: #d1d5db - Medium light gray, used for borders
- `--neutral-400`: #9ca3af - Medium gray, used for disabled text
- `--neutral-500`: #6b7280 - Main gray, used for secondary text
- `--neutral-600`: #4b5563 - Darker gray, used for secondary text
- `--neutral-700`: #374151 - Dark gray, used for text
- `--neutral-800`: #1f2937 - Very dark gray, used for text
- `--neutral-900`: #111827 - Darkest gray, used for headings and primary text

### Semantic Colors

These colors convey specific meanings and are used consistently throughout the application.

- `--success`: #10b981 - Green, used for success messages and indicators
- `--warning`: #f59e0b - Amber, used for warnings and caution indicators
- `--danger`: #ef4444 - Red, used for errors and destructive actions
- `--info`: #3b82f6 - Blue, used for informational messages

## Typography

Our typography system uses a combination of Poppins for headings and Inter for body text, creating a modern and readable interface.

### Font Families

- `--font-sans`: 'Poppins', sans-serif - Used for headings and display text
- `--font-body`: 'Inter', sans-serif - Used for body text and UI elements

### Font Sizes

- `--text-xs`: 0.75rem (12px) - Used for small labels and badges
- `--text-sm`: 0.875rem (14px) - Used for secondary text and small UI elements
- `--text-base`: 1rem (16px) - Used for body text
- `--text-lg`: 1.125rem (18px) - Used for large body text
- `--text-xl`: 1.25rem (20px) - Used for small headings
- `--text-2xl`: 1.5rem (24px) - Used for medium headings
- `--text-3xl`: 1.875rem (30px) - Used for large headings
- `--text-4xl`: 2.25rem (36px) - Used for extra large headings
- `--text-5xl`: 3rem (48px) - Used for display headings

## Components

The design system includes a set of reusable components that follow consistent styling and behavior:

### Buttons

- **Primary Button**: Orange background, white text, used for primary actions
- **Secondary Button**: Blue background, white text, used for secondary actions
- **Tertiary Button**: Transparent background with border, used for less important actions
- **Danger Button**: Red background, white text, used for destructive actions
- **Button Sizes**: Small, medium, and large variants
- **Button States**: Normal, hover, active, disabled, and focus states
- **Button Icons**: Support for left or right icon placement

### Cards

- **Default Card**: White background, shadow, rounded corners, used for content containers
- **Compact Card**: Smaller padding, used for dense content
- **Bordered Card**: Border instead of shadow, used for subtle containers
- **Card Header**: Title, subtitle, and action area
- **Card Body**: Main content area
- **Card Footer**: Action buttons or additional information

### Forms

- **Form Layout**: Consistent spacing and alignment for form elements
- **Form Actions**: Button container with alignment options (left, center, right)
- **Input**: Text input with label, error state, and helper text
- **Select**: Dropdown select with custom styling and validation
- **Checkbox**: Custom styled checkbox
- **Radio**: Custom styled radio button
- **Textarea**: Multi-line text input
- **Form Validation**: Client-side validation with error messages
- **Form Hooks**: Custom hooks for form state management and validation

### Alerts

- **Success Alert**: Green background, used for success messages
- **Warning Alert**: Amber background, used for warnings
- **Danger Alert**: Red background, used for errors
- **Info Alert**: Blue background, used for information
- **Alert Icons**: Support for custom icons
- **Alert Titles**: Optional title for more context
- **Alert Actions**: Optional close button or custom actions

### Badges

- **Primary Badge**: Orange background, used for primary labels
- **Secondary Badge**: Blue background, used for secondary labels
- **Success Badge**: Green background, used for success status
- **Warning Badge**: Amber background, used for warning status
- **Danger Badge**: Red background, used for error status
- **Info Badge**: Blue background, used for informational status

### Modals

- **Modal Sizes**: Small, medium, and large variants
- **Modal Header**: Title and close button
- **Modal Body**: Main content area
- **Modal Footer**: Action buttons
- **Modal Overlay**: Background overlay with click-to-close functionality
- **Modal Accessibility**: Keyboard navigation and screen reader support
- **Modal States**: Open, closed, and transitions

### Tabs

- **Tab Variants**: Default, pills, and underlined
- **Tab Orientations**: Horizontal and vertical
- **Tab States**: Active, inactive, disabled, and hover
- **Tab Icons**: Support for icons in tabs
- **Tab Content**: Content panels that show/hide based on active tab
- **Tab Accessibility**: Keyboard navigation and ARIA attributes

### Pagination

- **Pagination Variants**: Default, rounded, and simple
- **Pagination Sizes**: Small, medium, and large
- **Pagination Controls**: First, previous, next, and last buttons
- **Pagination Pages**: Page numbers with active state
- **Pagination Ellipsis**: Truncation for large page ranges
- **Pagination Accessibility**: Keyboard navigation and ARIA attributes

## Accessibility

The design system is built with accessibility in mind:

- All color combinations meet WCAG 2.1 AA contrast requirements
- Interactive elements have visible focus states
- Form elements have associated labels
- Icons have appropriate alt text
- Components use semantic HTML

## Implementation

The design system is implemented using:

- CSS variables for design tokens
- Component-based architecture
- Responsive design principles
- Consistent naming conventions

## Files

- `src/styles/design-system.css`: Core design tokens and variables
- `src/styles/component-guide.css`: Component-specific styles
- `src/docs/design-system.md`: Detailed documentation
- `src/app/components/`: React components that implement the design system
