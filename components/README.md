# Graphics System Components

This directory contains reusable components for the School Enrollment System's graphics system.

## Components

### Avatar

The `Avatar` component displays user avatars with support for different roles and genders.

```jsx
import Avatar from '../components/Avatar';

// Usage
<Avatar type="student" gender="female" size="large" />
<Avatar type="teacher" gender="male" size="medium" />
<Avatar type="admin" size="small" />
```

Props:
- `type`: "student" | "teacher" | "admin" (required)
- `gender`: "male" | "female" (default: "male")
- `size`: "small" | "medium" | "large" (default: "medium")
- `alt`: Alternative text for the image (optional)
- `className`: Additional CSS class (optional)

### Icon

The `Icon` component displays icons for various purposes.

```jsx
import Icon from '../components/Icon';

// Usage
<Icon type="grades" category="dashboard" size="medium" />
<Icon type="success" category="status" size="small" />
```

Props:
- `type`: Icon type (e.g., "grades", "finances", "success", "error") (required)
- `category`: "dashboard" | "status" (default: "dashboard")
- `size`: "small" | "medium" | "large" (default: "medium")
- `alt`: Alternative text for the image (optional)
- `onClick`: Click handler function (optional)
- `className`: Additional CSS class (optional)

### DashboardIcon

The `DashboardIcon` component displays a dashboard navigation icon with a label.

```jsx
import DashboardIcon from '../components/DashboardIcon';

// Usage
<DashboardIcon 
  type="grades" 
  label="Grades" 
  active={activeSection === 'grades'} 
  onClick={() => setActiveSection('grades')} 
/>
```

Props:
- `type`: Icon type (e.g., "grades", "finances") (required)
- `label`: Text label for the icon (required)
- `active`: Whether the icon is active (default: false)
- `onClick`: Click handler function (optional)
- `className`: Additional CSS class (optional)

### EmptyState

The `EmptyState` component displays a message when no data is available.

```jsx
import EmptyState from '../components/EmptyState';

// Usage
<EmptyState 
  type="grades" 
  title="No Grades Available" 
  message="Your grades will appear here once they are posted." 
  actionLabel="View Courses" 
  onAction={() => navigate('/courses')} 
/>
```

Props:
- `type`: Type of empty state (e.g., "grades", "finances") (required)
- `title`: Title text (optional)
- `message`: Message text (optional)
- `actionLabel`: Label for the action button (optional)
- `onAction`: Click handler for the action button (optional)
- `className`: Additional CSS class (optional)

### Alert

The `Alert` component displays status messages and notifications.

```jsx
import Alert from '../components/Alert';

// Usage
<Alert 
  type="success" 
  message="Your changes have been saved successfully." 
  onClose={() => setShowAlert(false)} 
/>
```

Props:
- `type`: "success" | "error" | "warning" | "info" (default: "info")
- `message`: Alert message (required)
- `onClose`: Close handler function (optional)
- `className`: Additional CSS class (optional)

### Chart Components

The chart components display data visualizations.

```jsx
import { GpaChart, SubjectChart, AttendanceChart } from '../components/charts';

// Usage
<GpaChart data={{ labels: ['1st Sem', '2nd Sem'], values: [3.5, 3.7] }} />
<SubjectChart data={{ labels: ['Math', 'Science'], values: [85, 92] }} />
<AttendanceChart data={[85, 5, 10]} />
```

Props for all chart components:
- `data`: Chart data (required)
- `title`: Chart title (optional)
- `className`: Additional CSS class (optional)

## Image Requirements

The components expect images to be placed in the following directories:

- Avatars: `/public/images/avatars/`
  - `male-student-avatar.png`
  - `female-student-avatar.png`
  - `male-teacher-avatar.png`
  - `female-teacher-avatar.png`
  - `admin-avatar.png`

- Dashboard Icons: `/public/images/icons/dashboard/`
  - `grades-icon.png`
  - `finances.png`
  - `schedule.png`
  - `courses.png`
  - `notifications.png`

- Status Icons: `/public/images/icons/status/`
  - `success-icon.png`
  - `error-icon.png`
  - `warning-icon.png`
  - `info-icon.png`
