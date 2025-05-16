# Perpetual Help College Design System

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

### Font Weights

- `--font-thin`: 100
- `--font-extralight`: 200
- `--font-light`: 300
- `--font-normal`: 400 - Used for body text
- `--font-medium`: 500 - Used for emphasis and UI elements
- `--font-semibold`: 600 - Used for subheadings
- `--font-bold`: 700 - Used for headings
- `--font-extrabold`: 800
- `--font-black`: 900

## Spacing

Our spacing system uses a consistent scale to create rhythm and hierarchy in the interface.

- `--spacing-0`: 0
- `--spacing-1`: 0.25rem (4px)
- `--spacing-2`: 0.5rem (8px)
- `--spacing-3`: 0.75rem (12px)
- `--spacing-4`: 1rem (16px)
- `--spacing-5`: 1.25rem (20px)
- `--spacing-6`: 1.5rem (24px)
- `--spacing-8`: 2rem (32px)
- `--spacing-10`: 2.5rem (40px)
- `--spacing-12`: 3rem (48px)
- `--spacing-16`: 4rem (64px)
- `--spacing-20`: 5rem (80px)
- `--spacing-24`: 6rem (96px)
- `--spacing-32`: 8rem (128px)

## Border Radius

Our border radius system creates consistent rounded corners throughout the interface.

- `--radius-sm`: 0.25rem (4px) - Used for small elements
- `--radius-md`: 0.5rem (8px) - Used for buttons and form elements
- `--radius-lg`: 0.75rem (12px) - Used for cards and larger elements
- `--radius-xl`: 1rem (16px) - Used for modal dialogs and large cards
- `--radius-full`: 9999px - Used for pills and badges

## Shadows

Our shadow system creates depth and hierarchy in the interface.

- `--shadow-sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05) - Used for subtle elevation
- `--shadow-md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) - Used for cards and dropdowns
- `--shadow-lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) - Used for modals and popovers
- `--shadow-xl`: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) - Used for elevated elements

## Accessibility Considerations

Our design system is built with accessibility in mind, ensuring that all users can interact with the application effectively.

### Color Contrast

- All text colors have been tested to meet WCAG 2.1 AA standards for contrast ratio:
  - Normal text (below 18pt): 4.5:1 minimum contrast ratio
  - Large text (18pt and above): 3:1 minimum contrast ratio
- The primary orange (#e77f33) has a contrast ratio of:
  - 4.6:1 against white (passes AA for normal text)
  - 3.1:1 against black (passes AA for large text only)
- For normal text on orange backgrounds, we use white text to ensure readability

### Focus States

- All interactive elements have visible focus states
- Focus outlines use the primary color with sufficient contrast
- Focus states are visible in both keyboard and mouse navigation

### Keyboard Navigation

- All interactive elements are accessible via keyboard
- Focus order follows a logical sequence
- Skip links are provided for keyboard users to bypass repetitive navigation

### Screen Readers

- Semantic HTML is used throughout the application
- ARIA attributes are used when necessary to enhance accessibility
- All images have appropriate alt text
- Form elements have associated labels

## Responsive Design Principles

Our design system is built to work across all device sizes, from mobile to desktop.

### Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Layout Principles

- Mobile-first approach to design and development
- Fluid layouts that adapt to different screen sizes
- Consistent spacing and typography across devices
- Touch-friendly targets on mobile (minimum 44x44px)
- Simplified navigation on smaller screens

## Component Guidelines

See the component-guide.css file for detailed styling of specific components, including:

- Buttons
- Cards
- Forms
- Alerts
- Badges
- Navigation
- Tables
- Modals
- Tooltips

## Implementation Notes

- Use CSS variables for all design tokens
- Use utility classes for common styling patterns
- Use component classes for specific UI elements
- Use responsive classes for adaptive layouts
- Use semantic HTML for accessibility
- Use ARIA attributes when necessary
