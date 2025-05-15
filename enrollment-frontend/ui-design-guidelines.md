# Perpetual Help College of Manila - UI Design Guidelines

## Color Scheme
The following color scheme must be strictly adhered to across all interfaces:

| Element     | Hex Code  | Description           | Usage                                  |
|-------------|-----------|------------------------|---------------------------------------|
| Sidebar     | `#41413c` | Dark grayish-brown    | Sidebar backgrounds, secondary buttons |
| Accent      | `#e77f33` | Warm orange           | Primary buttons, links, icons, borders |
| Background  | `#fdf6f2` | Light peachy/off-white | Page backgrounds, cards               |

## Dark Mode Colors
When implementing dark mode, use these variations:

| Element     | Light Mode | Dark Mode   | Notes                             |
|-------------|------------|-------------|------------------------------------|
| Sidebar     | `#41413c`  | `#41413c`   | Remains unchanged in both modes    |
| Accent      | `#e77f33`  | `#e77f33`   | Remains unchanged in both modes    |
| Background  | `#fdf6f2`  | `#2d2d2d`   | Changes to dark gray in dark mode  |
| Text Primary| `#333333`  | `#f0f0f0`   | Dark in light mode, light in dark  |
| Card BG     | `#ffffff`  | `#3a3a3a`   | White in light mode, dark in dark  |
| Border      | `#e5e7eb`  | `#4a4a4a`   | Light in light mode, dark in dark  |

## CSS Variables Implementation

Always implement these colors as CSS variables for easy theming:

```css
:root {
  /* Light theme (default) */
  --primary: #e77f33; /* Warm orange accent */
  --sidebar: #41413c; /* Dark grayish-brown sidebar */
  --background: #fdf6f2; /* Light peachy/off-white background */
  --text-primary: #333333;
  --text-secondary: #666666;
  --bg-primary: #fdf6f2;
  --bg-card: white;
  --border-color: #e5e7eb;
  --shadow-color: rgba(0, 0, 0, 0.05);
}

/* Dark theme */
.dark {
  --text-primary: #f0f0f0;
  --text-secondary: #cccccc;
  --bg-primary: #2d2d2d;
  --bg-card: #3a3a3a;
  --border-color: #4a4a4a;
  --shadow-color: rgba(0, 0, 0, 0.2);
  --sidebar-bg: #41413c; /* Maintain the sidebar color in dark mode */
}
```

## Typography

- Primary Font: 'Roboto', sans-serif
- Use consistent font sizing:
  - Page Titles: 2rem (32px)
  - Section Headers: 1.5rem (24px)
  - Card Titles: 1.25rem (20px)
  - Body Text: 1rem (16px)
  - Small Text: 0.875rem (14px)

## Common Components

### Buttons

Primary Button:
```html
<button class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors">
  Button Text
</button>
```

Secondary Button:
```html
<button class="bg-sidebar hover:bg-sidebar-dark text-white font-bold py-2 px-4 rounded transition-colors">
  Button Text
</button>
```

Outlined Button:
```html
<button class="border border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-4 rounded transition-colors">
  Button Text
</button>
```

### Cards

All cards should follow this structure:
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
  </div>
  <div class="card-body">
    <!-- Card content -->
  </div>
</div>
```

With this CSS:
```css
.card {
  background-color: var(--bg-card);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: all 0.3s ease;
  padding: 1.25rem;
  overflow: hidden;
  position: relative;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px var(--shadow-color);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background-color: var(--primary);
  opacity: 0.7;
}
```

### Forms

Form fields should use this styling:
```html
<div class="space-y-2">
  <label for="field-id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Label Text</label>
  <input type="text" id="field-id" name="field-id" 
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        placeholder="Placeholder text">
</div>
```

### Sidebar

The sidebar should use the #41413c color in both light and dark modes:
```html
<aside class="sidebar bg-sidebar text-white shadow-md w-64 flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out">
  <!-- Sidebar content -->
</aside>
```

## Theme Switching

Implement a consistent theme toggle across all pages:

```html
<div class="theme-switcher">
  <button id="theme-light" class="theme-button" title="Light Mode">
    <i class="fas fa-sun"></i>
  </button>
  <button id="theme-dark" class="theme-button" title="Dark Mode">
    <i class="fas fa-moon"></i>
  </button>
</div>
```

With this JavaScript for theme management:

```javascript
// Get theme preference from localStorage or system preference
function getThemePreference() {
  if (localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  
  // Use system preference as fallback
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to document
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Update active button state
  updateActiveThemeButton(theme);
}

// Set theme and save preference
function setTheme(theme) {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}

// Update which theme button is active
function updateActiveThemeButton(activeTheme) {
  document.querySelectorAll('.theme-button').forEach(button => {
    button.classList.remove('active');
  });
  
  document.getElementById(`theme-${activeTheme}`).classList.add('active');
}

// Apply the initial theme
const currentTheme = getThemePreference();
applyTheme(currentTheme);
```

## Animation Guidelines

Use these subtle animations for a more engaging interface:

```css
/* Animation classes */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

.animate-scale {
  animation: scale 0.5s ease-out;
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Keyframe animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scale {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

## Responsive Design Guidelines

- Use a mobile-first approach with sensible breakpoints:
  - Small: 640px
  - Medium: 768px
  - Large: 1024px
  - XL: 1280px

- Implement responsive patterns:
  - Sidebar collapses to top nav on mobile
  - Single column layout on small screens
  - Multi-column layout on larger screens
  - Font sizes scale down slightly on mobile

## Dashboard Layout

All dashboards should follow this layout structure:

```html
<div class="dashboard-container">
  <!-- Sidebar -->
  <aside class="sidebar bg-sidebar text-white">
    <!-- Logo and branding -->
    <div class="sidebar-header">
      <!-- Logo and title -->
    </div>
    
    <!-- Navigation -->
    <nav class="sidebar-nav">
      <!-- Navigation links -->
    </nav>
    
    <!-- Theme toggle at bottom -->
    <div class="sidebar-footer">
      <!-- Theme toggle -->
    </div>
  </aside>
  
  <!-- Main content -->
  <main class="main-content bg-background">
    <!-- Header with user info and actions -->
    <header class="content-header">
      <!-- Page title and actions -->
    </header>
    
    <!-- Dashboard sections -->
    <div class="dashboard-sections">
      <!-- Multiple sections with cards -->
    </div>
    
    <!-- Footer -->
    <footer class="content-footer">
      <!-- Footer content -->
    </footer>
  </main>
</div>
```

## Best Practices

1. **Consistency First**: Maintain consistent UI patterns across all pages
2. **Semantic HTML**: Use proper HTML5 semantic elements
3. **Accessible Design**: Ensure adequate contrast and keyboard navigation
4. **Progressive Enhancement**: Ensure basic functionality works even if JS fails
5. **Performance**: Optimize images and minimize CSS/JS
6. **Responsive Design**: Test on various screen sizes

## Common Anti-Patterns to Avoid

1. **Color Inconsistency**: Never use colors outside the specified color scheme
2. **Jarring Dark Mode**: Ensure dark mode transitions are smooth
3. **Inconsistent Spacing**: Maintain consistent spacing between elements
4. **Cluttered UI**: Avoid overcrowding interfaces with too many elements
5. **Non-responsive Design**: Ensure all interfaces work on mobile devices

## Implementation Checklist

When implementing a new interface or updating an existing one, verify:

- [ ] All colors match the mandated color scheme
- [ ] Dark mode is properly implemented
- [ ] Typography is consistent with guidelines
- [ ] Component styling matches the design system
- [ ] Responsive design principles are followed
- [ ] Animations are subtle and purposeful
- [ ] Theme toggle works correctly
- [ ] Accessibility requirements are met
